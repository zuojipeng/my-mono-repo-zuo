import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Loading, PageNotFoundView } from "../components/common";
import MainLayout from "../layout";

// 懒加载包装器
const _lazyLoad = (
	Component: React.LazyExoticComponent<React.ComponentType>,
) => {
	return (
		<Suspense fallback={<Loading text="页面加载中..." />}>
			<Component />
		</Suspense>
	);
};

// 懒加载页面组件
const TailwindDemo = lazy(() => import('../pages/TailwindDemo'));
const HomePage = lazy(() => import('../pages/HomePage'));
const FaucetPage = lazy(() => import('../pages/faucet'));
const ProfilePage = lazy(() => import('../pages/profile'));
const StakingPage = lazy(() => import('../pages/staking'));
const TreasuryPage = lazy(() => import('../pages/treasury'));
const ApiTestPage = lazy(() => import('../pages/ApiTest'));

// 路由配置
const routes: RouteObject[] = [
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: _lazyLoad(HomePage),
			},
			{
				path: 'demo',
				element: _lazyLoad(TailwindDemo),
			},
			{
				path: 'faucet',
				element: _lazyLoad(FaucetPage),
			},
			{
				path: 'profile',
				element: _lazyLoad(ProfilePage),
			},
			{
				path: 'staking',
				element: _lazyLoad(StakingPage),
			},
			{
				path: 'treasury',
				element: _lazyLoad(TreasuryPage),
			},
			{
				path: 'api-test',
				element: _lazyLoad(ApiTestPage),
			},
		],
	},
	// 404 页面
	{
		path: "/404",
		element: <PageNotFoundView />,
	},
	// 重定向所有未匹配的路由到 404
	{
		path: "*",
		element: <Navigate to="/404" replace />,
	},
];

const router = createBrowserRouter(routes);

export default router;
export { routes };
