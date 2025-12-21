import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { injectedConnector } from "@zuojipeng/my-libs/wagmi";
import { YD_TOKEN_ADDRESS, YD_TOKEN_ABI } from "../../../costruct.config";

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "🏠 首页" },
    { path: "/profile", label: "👤 个人中心" },
    { path: "/faucet", label: "🚰 水龙头" },
    { path: "/staking", label: "💎 质押" },
    { path: "/treasury", label: "🏦 理财" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // 钱包 & 余额信息
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance } = useReadContract({
    address: YD_TOKEN_ADDRESS,
    abi: YD_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const balanceDisplay =
    balance && typeof balance === "bigint"
      ? Number(formatUnits(balance as bigint, 18)).toFixed(2)
      : "0.00";

  const shortAddress =
    address && address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address || "";

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 左侧：Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl">🎓</div>
            <span className="text-white font-bold text-xl hidden md:block">
              Web3 University
            </span>
          </Link>

          {/* 中间：导航菜单 */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-wrap justify-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.path)
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden text-lg">
                    {item.label.split(" ")[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧：钱包信息 */}
          <div className="flex items-center space-x-3 min-w-[160px] justify-end">
            {isConnected && address ? (
              <>
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-400">YD 余额</span>
                  <span className="text-sm text-white font-semibold">
                    {balanceDisplay}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="flex items-center space-x-2 bg-gray-800 text-gray-100 px-3 py-1.5 rounded-full text-xs hover:bg-gray-700 transition"
                >
                  <span className="hidden sm:inline font-mono">
                    {shortAddress}
                  </span>
                  <span className="sm:hidden font-mono text-xs">
                    {address.slice(0, 4)}...{address.slice(-2)}
                  </span>
                  <span className="text-gray-400 text-[10px]">断开</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => connect({ connector: injectedConnector })}
                disabled={isConnecting}
                className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConnecting ? "连接中..." : "连接钱包"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
