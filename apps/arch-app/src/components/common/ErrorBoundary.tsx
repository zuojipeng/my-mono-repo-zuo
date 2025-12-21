import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 全局错误边界组件
 *
 * 功能：
 * 1. 捕获 React 组件树中的 JavaScript 错误
 * 2. 显示友好的错误页面，防止白屏
 * 3. 记录错误日志，方便调试
 * 4. 可集成第三方监控服务（Sentry、LogRocket 等）
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 更新 state 保存错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 可以在这里集成错误监控服务
    // 例如：Sentry.captureException(error, { extra: errorInfo });
    // 或者：发送到 Cloudflare Analytics
    this.reportError(error, errorInfo);
  }

  /**
   * 上报错误到监控服务
   * 可以集成：
   * - Sentry (推荐)
   * - LogRocket
   * - Cloudflare Web Analytics
   * - 自定义错误收集 API
   */
  reportError(error: Error, errorInfo: ErrorInfo) {
    // 如果在生产环境，上报错误
    if (process.env.NODE_ENV === 'production') {
      try {
        // 方式 1: 使用 Sentry（需要安装 @sentry/react）
        // if (typeof Sentry !== 'undefined') {
        //   Sentry.captureException(error, {
        //     contexts: {
        //       react: {
        //         componentStack: errorInfo.componentStack,
        //       },
        //     },
        //   });
        // }

        // 方式 2: 发送到自定义 API
        // fetch('/api/log-error', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     error: {
        //       message: error.message,
        //       stack: error.stack,
        //       name: error.name,
        //     },
        //     errorInfo: {
        //       componentStack: errorInfo.componentStack,
        //     },
        //     userAgent: navigator.userAgent,
        //     url: window.location.href,
        //     timestamp: new Date().toISOString(),
        //   }),
        // });

        // 方式 3: 使用 Cloudflare Web Analytics（如果启用）
        // 注意：需要在 index.html 中添加 Cloudflare Analytics 脚本
        if (typeof (window as any).cf !== 'undefined') {
          (window as any).cf('event', 'error', {
            error: error.message,
            stack: error.stack?.substring(0, 500), // 限制长度
          });
        }
      } catch (reportError) {
        // 上报失败也不应该影响用户体验
        console.error('Failed to report error:', reportError);
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;

      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback && error && errorInfo) {
        return this.props.fallback(error, errorInfo);
      }

      // 默认错误页面
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                哎呀，出错了！
              </h1>
              <p className="text-gray-600">
                应用遇到了一个意外错误，我们已经记录了这个问题。
              </p>
            </div>

            {/* 错误详情（仅开发环境显示） */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="text-red-900 font-semibold mb-2">错误信息：</h3>
                  <p className="text-red-700 text-sm font-mono break-all">
                    {error.toString()}
                  </p>
                </div>

                {errorInfo && (
                  <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer text-gray-700 font-semibold mb-2">
                      组件堆栈（点击展开）
                    </summary>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-64 mt-2">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                重新尝试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                返回首页
              </button>
            </div>

            {/* 提示信息 */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                如果问题持续存在，请尝试：
              </p>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• 刷新页面（Ctrl/Cmd + R）</li>
                <li>• 清除浏览器缓存</li>
                <li>• 检查网络连接</li>
                <li>• 确保钱包连接正常</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
