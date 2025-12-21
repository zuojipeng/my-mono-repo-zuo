import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { Link } from 'react-router-dom';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useChainId,
} from 'wagmi';
import {
  YD_TOKEN_ADDRESS,
  YD_TOKEN_ABI,
} from '../../costruct.config';
import { CURRENT_CHAIN_ID, IS_LOCAL_CHAIN, injectedConnector } from '@zuojipeng/my-libs/wagmi';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/contructsCommon/CourseCard';
import PurchaseCourseModal from '../components/contructsCommon/PurchaseCourseModal';
import CourseContentViewer from '../components/contructsCommon/CourseContentViewer';
import CreateCourseModal from '../components/contructsCommon/CreateCourseModal';
import type { Course } from '../types/course';

// 类型定义
interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isContentViewerOpen, setIsContentViewerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected, chainId: walletChainId } = useAccount();
  const chainId = useChainId();

  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // 获取课程列表
  const { courses, isLoading: isLoadingCourses, refetch: refetchCourses } = useCourses();

  // 统一处理 chainId 格式
  const normalizeChainId = (id: number | bigint | string | undefined): number | null => {
    if (!id) return null;
    if (typeof id === 'number') return id;
    if (typeof id === 'bigint') return Number(id);
    if (typeof id === 'string') {
      if (id.startsWith('0x')) {
        return parseInt(id, 16);
      }
      return parseInt(id, 10);
    }
    return null;
  };

  const normalizedChainId = normalizeChainId(chainId);
  const normalizedWalletChainId = normalizeChainId(walletChainId);
  const isCorrectNetwork = normalizedChainId === CURRENT_CHAIN_ID;

  // 读取 YD Token 余额
  const { data: balance } = useReadContract({
    address: YD_TOKEN_ADDRESS,
    abi: YD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isCorrectNetwork,
    }
  });

  const balanceDisplay = balance ? formatUnits(balance as bigint, 18) : '0';

  // 添加网络到 MetaMask
  const addHardhatNetwork = async () => {
    if (!window.ethereum) {
      alert('请安装 MetaMask');
      return;
    }

    const networkConfig: NetworkConfig = {
      chainId: '0x7A69', // 31337 的十六进制
      chainName: 'Hardhat Local',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['http://127.0.0.1:8545'],
      blockExplorerUrls: ['http://localhost:8545'],
    };

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
      alert('Hardhat 网络已添加！');
    } catch (error) {
      console.error('添加网络失败:', error);
      alert('添加网络失败，请查看控制台');
    }
  };

  // 切换网络
  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: CURRENT_CHAIN_ID });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 网络检查提示：放在内容区域上方，避免形成第二个导航条 */}
      {isConnected && !isCorrectNetwork && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">⚠️ 网络不匹配</p>
                <p className="text-xs text-yellow-600 mt-1">
                  请切换到 {IS_LOCAL_CHAIN ? 'Hardhat Local (31337)' : 'Sepolia (11155111)'} 网络
                </p>
              </div>
              <div className="flex gap-2">
                {IS_LOCAL_CHAIN && (
                  <button
                    onClick={addHardhatNetwork}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    添加网络
                  </button>
                )}
                <button
                  onClick={handleSwitchNetwork}
                  className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  切换网络
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎区域 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            欢迎来到 YD web3大学 课程平台 🎓
          </h2>
          <p className="text-gray-600 mb-4">
            一个基于区块链的去中心化课程交易平台
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🔒 去中心化</h3>
              <p className="text-sm text-blue-700">
                基于以太坊智能合约，交易透明可信
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">💰 YD Token</h3>
              <p className="text-sm text-purple-700">
                使用平台代币进行课程购买
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📚 丰富课程</h3>
              <p className="text-sm text-green-700">
                优质课程内容，存储在 IPFS
              </p>
            </div>
          </div>
        </div>

        {/* 快捷导航入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/faucet"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
          >
            <div className="text-4xl mb-3">🚰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">水龙头</h3>
            <p className="text-sm text-gray-500">领取测试代币</p>
          </Link>

          <Link
            to="/staking"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
          >
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">质押挖矿</h3>
            <p className="text-sm text-gray-500">质押获取奖励</p>
          </Link>

          <Link
            to="/treasury"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
          >
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">理财金库</h3>
            <p className="text-sm text-gray-500">管理资产收益</p>
          </Link>

          <Link
            to="/profile"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">个人中心</h3>
            <p className="text-sm text-gray-500">查看我的课程</p>
          </Link>
        </div>

        {/* 课程列表 */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">课程列表</h2>
            {isConnected && isCorrectNetwork && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                ➕ 创建课程
              </button>
            )}
          </div>

          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">请先连接钱包查看课程</p>
              <button
                onClick={() => connect({ connector: injectedConnector })}
                disabled={isConnecting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? '连接中...' : '连接钱包'}
              </button>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">请切换到正确的网络</p>
            </div>
          ) : isLoadingCourses ? (
            <div className="text-center py-12">
              <p className="text-gray-500">加载课程中...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无课程</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={(course) => {
                    // 点击卡片 → 查看课程详情
                    setSelectedCourse(course);
                    setIsContentViewerOpen(true);
                  }}
                  onPurchaseClick={(course) => {
                    // 点击购买按钮 → 打开购买弹窗
                    setSelectedCourse(course);
                    setIsPurchaseModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer 信息 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>使用 TypeChain + Wagmi 构建的 Web3 应用</p>
          <p className="mt-2">
            <a href="/demo" className="text-blue-600 hover:underline">
              查看 Tailwind Demo
            </a>
          </p>
        </div>
      </main>

      {/* 课程详情查看器 */}
      <CourseContentViewer
        isOpen={isContentViewerOpen}
        onClose={() => {
          setIsContentViewerOpen(false);
          setSelectedCourse(null);
        }}
        contentHash={selectedCourse?.contentHash}
        courseName={selectedCourse?.name}
        courseId={selectedCourse?.id}
        courseAuthor={selectedCourse?.author}
      />

      {/* 购买课程弹窗 */}
      <PurchaseCourseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSuccess={() => {
          // 购买成功后刷新课程列表
          refetchCourses();
        }}
      />

      {/* 创建课程弹窗 */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // 创建成功后刷新课程列表
          refetchCourses();
        }}
      />
    </div>
  );
}
