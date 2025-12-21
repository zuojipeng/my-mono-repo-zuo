import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * API 测试页面
 * 用于测试 NestJS 后端服务的 CRUD 接口和 GitHub API
 */

// API 配置
const API_BASE_URL = 'https://pwhkfs7779.execute-api.us-east-1.amazonaws.com/prod';
// const API_BASE_URL = 'http://localhost:3000';

// 类型定义
interface Item {
  id?: string | number;
  name?: string;
  value?: string;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface GitHubUser {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  location: string;
  company: string;
  blog: string;
  twitter: string;
  profileUrl: string;
  createdAt: string;
  email: string;
}

type TabType = 'crud' | 'github';

export default function ApiTest(): React.ReactElement {
  // 标签页状态
  const [activeTab, setActiveTab] = useState<TabType>('crud');

  // CRUD 相关状态
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // 表单状态
  const [formData, setFormData] = useState<Item>({
    name: '',
    value: ''
  });
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // GitHub API 相关状态
  const [githubToken, setGithubToken] = useState<string>('');
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);
  const [githubError, setGithubError] = useState<string>('');
  const [githubSuccess, setGithubSuccess] = useState<string>('');

  // 获取所有项目
  const fetchItems = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      setItems(response.data);
      setSuccess('✅ 获取列表成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('获取列表失败:', err);
      setError(`❌ 获取失败: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 创建新项目
  const createItem = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formData.name) {
      setError('请输入名称');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/items`, formData);
      console.log('创建响应:', response.data);
      setSuccess('✅ 创建成功');
      setFormData({ name: '', value: '' });
      await fetchItems(); // 刷新列表
    } catch (err: any) {
      console.error('创建失败:', err);
      setError(`❌ 创建失败: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 更新项目
  const updateItem = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!editingId || !formData.name) {
      setError('请输入名称');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/api/items/${editingId}`, formData);
      console.log('更新响应:', response.data);
      setSuccess('✅ 更新成功');
      setEditingId(null);
      setFormData({ name: '', value: '' });
      await fetchItems(); // 刷新列表
    } catch (err: any) {
      console.error('更新失败:', err);
      setError(`❌ 更新失败: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 删除项目
  const deleteItem = async (id: string | number): Promise<void> => {
    if (!confirm(`确定要删除 ID 为 ${id} 的项目吗？`)) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`);
      setSuccess('✅ 删除成功');
      await fetchItems(); // 刷新列表
    } catch (err: any) {
      console.error('删除失败:', err);
      setError(`❌ 删除失败: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取单个项目
  const getItem = async (id: string | number): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/${id}`);
      console.log('获取单个项目:', response.data);
      setFormData(response.data);
      setEditingId(id);
      setSuccess('✅ 获取项目详情成功');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('获取失败:', err);
      setError(`❌ 获取失败: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const cancelEdit = (): void => {
    setEditingId(null);
    setFormData({ name: '', value: '' });
    setError('');
  };

  // GitHub API: 获取用户信息
  const fetchGitHubUser = async (): Promise<void> => {
    if (!githubToken.trim()) {
      setGithubError('❌ 请输入 GitHub Token');
      return;
    }

    setGithubLoading(true);
    setGithubError('');
    setGithubSuccess('');
    setGithubUser(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/github/user`, {
        headers: {
          'Authorization': `Bearer ${githubToken.trim()}`
        }
      });

      setGithubUser(response.data);
      setGithubSuccess('✅ 获取用户信息成功');
      setTimeout(() => setGithubSuccess(''), 3000);
    } catch (err: any) {
      console.error('获取 GitHub 用户信息失败:', err);
      const errorMessage = err.response?.data?.message || err.message || '获取失败';
      setGithubError(`❌ ${errorMessage}`);
    } finally {
      setGithubLoading(false);
    }
  };

  // 从本地存储加载 Token
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  // 保存 Token 到本地存储
  const handleTokenChange = (token: string): void => {
    setGithubToken(token);
    if (token.trim()) {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
  };

  // 页面加载时获取列表
  useEffect(() => {
    if (activeTab === 'crud') {
      fetchItems();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">🧪 API 接口测试</h1>
          <p className="text-gray-300">测试 NestJS 后端服务</p>

          {/* 仅在开发环境显示 API 地址，线上隐藏 */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 bg-gray-800 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-400">API 地址</p>
              <p className="text-white font-mono text-sm break-all">
                {API_BASE_URL}
              </p>
            </div>
          )}
        </div>

        {/* 标签页切换 */}
        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('crud')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'crud'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📝 CRUD 测试
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'github'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🐙 GitHub API
          </button>
        </div>

        {/* CRUD 测试内容 */}
        {activeTab === 'crud' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：表单区域 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              {editingId ? '📝 编辑项目' : '➕ 创建项目'}
            </h2>

            <form onSubmit={editingId ? updateItem : createItem} className="space-y-4">
              {/* 名称输入 */}
              <div>
                <label className="block text-gray-300 mb-2">
                  名称 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="请输入名称"
                  required
                />
              </div>

              {/* 描述输入 */}
              <div>
                <label className="block text-gray-300 mb-2">
                  描述
                </label>
                <textarea
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 h-32"
                  placeholder="请输入描述"
                />
              </div>

              {/* 按钮组 */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </span>
                  ) : (
                    editingId ? '💾 保存更新' : '➕ 创建'
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    ❌ 取消
                  </button>
                )}
              </div>
            </form>

            {/* 快速测试按钮 */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">快速测试</h3>
              <button
                onClick={fetchItems}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                🔄 刷新列表 (GET /items)
              </button>
            </div>
          </div>

          {/* 右侧：列表区域 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-400">
                📋 项目列表
              </h2>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {items.length} 项
              </span>
            </div>

            {/* 成功提示 */}
            {success && (
              <div className="mb-4 bg-green-900/20 border border-green-500 rounded-lg p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* 加载状态 */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* 列表内容 */}
            {!loading && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">暂无数据</p>
                    <p className="text-gray-500 text-sm mt-2">创建第一个项目试试吧</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-gray-700 rounded-lg p-4 border transition ${
                        editingId === item.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                              ID: {item.id}
                            </span>
                            {editingId === item.id && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                                编辑中
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {item.name || '未命名'}
                          </h3>
                          {item.value && (
                            <p className="text-gray-400 text-sm">
                              {item.value}
                            </p>
                          )}
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => getItem(item.id!)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            title="查看详情 (GET)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => getItem(item.id!)}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            title="编辑 (PUT)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteItem(item.id!)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            title="删除 (DELETE)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            </div>
          </div>

          {/* API 文档 */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">📚 CRUD API 接口文档</h2>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                <span className="text-green-400 font-bold">GET</span>
                <span className="text-gray-400 ml-3">{API_BASE_URL}/items</span>
                <span className="text-gray-500 ml-3"># 获取项目列表</span>
              </div>
              <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                <span className="text-blue-400 font-bold">POST</span>
                <span className="text-gray-400 ml-3">{API_BASE_URL}/items</span>
                <span className="text-gray-500 ml-3"># 创建新项目</span>
              </div>
              <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                <span className="text-green-400 font-bold">GET</span>
                <span className="text-gray-400 ml-3">{API_BASE_URL}/items/:id</span>
                <span className="text-gray-500 ml-3"># 获取单个项目</span>
              </div>
              <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                <span className="text-yellow-400 font-bold">PUT</span>
                <span className="text-gray-400 ml-3">{API_BASE_URL}/items/:id</span>
                <span className="text-gray-500 ml-3"># 更新项目</span>
              </div>
              <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                <span className="text-red-400 font-bold">DELETE</span>
                <span className="text-gray-400 ml-3">{API_BASE_URL}/items/:id</span>
                <span className="text-gray-500 ml-3"># 删除项目</span>
              </div>
            </div>
          </div>
          </>
        )}

        {/* GitHub API 测试内容 */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            {/* GitHub Token 输入区域 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">🔑 GitHub Token 配置</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Personal Access Token <span className="text-red-400">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => handleTokenChange(e.target.value)}
                      className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 font-mono text-sm"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    />
                    <button
                      onClick={fetchGitHubUser}
                      disabled={githubLoading || !githubToken.trim()}
                      className="px-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {githubLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          获取中...
                        </span>
                      ) : (
                        '🔍 获取用户信息'
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    💡 Token 会保存在本地浏览器中，不会上传到服务器
                  </p>
                </div>

                {/* 获取 Token 链接 */}
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
                  <p className="text-blue-400 text-sm mb-2">
                    📖 如何获取 GitHub Token？
                  </p>
                  <ol className="text-blue-300 text-xs space-y-1 list-decimal list-inside">
                    <li>访问 <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">GitHub Settings</a></li>
                    <li>点击 "Generate new token" → "Generate new token (classic)"</li>
                    <li>选择至少 <code className="bg-blue-900/50 px-1 rounded">read:user</code> 权限</li>
                    <li>复制生成的 Token（只显示一次）</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 成功提示 */}
            {githubSuccess && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <p className="text-green-400 text-sm">{githubSuccess}</p>
              </div>
            )}

            {/* 错误提示 */}
            {githubError && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-sm">{githubError}</p>
              </div>
            )}

            {/* GitHub 用户信息展示 */}
            {githubUser && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-purple-400 mb-6">👤 GitHub 用户信息</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 左侧：头像和基本信息 */}
                  <div className="md:col-span-1">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <img
                        src={githubUser.avatar}
                        alt={githubUser.username}
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500"
                      />
                      <h3 className="text-xl font-bold text-white mb-1">
                        {githubUser.name || githubUser.username}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">@{githubUser.username}</p>

                      {githubUser.bio && (
                        <p className="text-gray-300 text-sm mb-4">{githubUser.bio}</p>
                      )}

                      <div className="space-y-2 text-sm">
                        {githubUser.location && (
                          <div className="flex items-center justify-center text-gray-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {githubUser.location}
                          </div>
                        )}
                        {githubUser.company && (
                          <div className="flex items-center justify-center text-gray-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {githubUser.company}
                          </div>
                        )}
                        {githubUser.email && (
                          <div className="flex items-center justify-center text-gray-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {githubUser.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 右侧：详细统计信息 */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {githubUser.followers}
                        </div>
                        <div className="text-gray-400 text-sm">Followers</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {githubUser.following}
                        </div>
                        <div className="text-gray-400 text-sm">Following</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {githubUser.publicRepos}
                        </div>
                        <div className="text-gray-400 text-sm">Public Repos</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {new Date(githubUser.createdAt).getFullYear()}
                        </div>
                        <div className="text-gray-400 text-sm">Joined</div>
                      </div>
                    </div>

                    {/* 链接信息 */}
                    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Profile URL</label>
                        <a
                          href={githubUser.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-purple-400 hover:underline text-sm break-all"
                        >
                          {githubUser.profileUrl}
                        </a>
                      </div>
                      {githubUser.blog && (
                        <div>
                          <label className="text-gray-400 text-sm">Blog</label>
                          <a
                            href={githubUser.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-purple-400 hover:underline text-sm break-all"
                          >
                            {githubUser.blog}
                          </a>
                        </div>
                      )}
                      {githubUser.twitter && (
                        <div>
                          <label className="text-gray-400 text-sm">Twitter</label>
                          <a
                            href={`https://twitter.com/${githubUser.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-purple-400 hover:underline text-sm"
                          >
                            @{githubUser.twitter}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GitHub API 文档 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">📚 GitHub API 接口文档</h2>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded p-3 font-mono text-sm">
                  <span className="text-green-400 font-bold">GET</span>
                  <span className="text-gray-400 ml-3">{API_BASE_URL}/api/github/user</span>
                  <span className="text-gray-500 ml-3"># 获取 GitHub 用户信息</span>
                </div>
                <div className="bg-gray-700 rounded p-3 text-sm">
                  <p className="text-gray-400 mb-2">请求头:</p>
                  <code className="text-gray-300">Authorization: Bearer &lt;your-github-token&gt;</code>
                </div>
                <div className="bg-gray-700 rounded p-3 text-sm">
                  <p className="text-gray-400 mb-2">响应字段:</p>
                  <ul className="text-gray-300 space-y-1 text-xs">
                    <li>• username, name, avatar, bio</li>
                    <li>• followers, following, publicRepos</li>
                    <li>• location, company, email, blog, twitter</li>
                    <li>• profileUrl, createdAt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
