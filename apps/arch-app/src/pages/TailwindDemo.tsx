import { useState } from 'react';

const TailwindDemo = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
			<div className="container mx-auto py-12 px-4">
				{/* Header */}
				<header className="mb-12 animate-fadeIn">
					<h1 className="text-5xl font-bold text-primary-700 mb-4">
						Tailwind CSS 配置展示
					</h1>
					<p className="text-xl text-gray-600">
						展示自定义颜色、间距、动画等高频配置效果
					</p>
				</header>

				{/* Color Palette */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8 animate-slideUp">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">自定义颜色</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="space-y-2">
							<div className="h-24 bg-primary-500 rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
								Primary
							</div>
							<div className="h-16 bg-primary-300 rounded-lg"></div>
							<div className="h-16 bg-primary-700 rounded-lg"></div>
						</div>
						<div className="space-y-2">
							<div className="h-24 bg-secondary-500 rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
								Secondary
							</div>
							<div className="h-16 bg-secondary-300 rounded-lg"></div>
							<div className="h-16 bg-secondary-700 rounded-lg"></div>
						</div>
						<div className="space-y-2">
							<div className="h-24 bg-success rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
								Success
							</div>
						</div>
						<div className="space-y-2">
							<div className="h-24 bg-error rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
								Error
							</div>
						</div>
					</div>
				</section>

				{/* Buttons */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">按钮样式</h2>
					<div className="flex flex-wrap gap-4">
						<button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-glow">
							主要按钮
						</button>
						<button className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
							次要按钮
						</button>
						<button className="px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-all duration-300">
							边框按钮
						</button>
						<button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow-lg">
							渐变按钮
						</button>
					</div>
				</section>

				{/* Cards */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">卡片组件</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-primary-500">
							<div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
								<span className="text-2xl">🚀</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">快速开发</h3>
							<p className="text-gray-600">
								使用 Tailwind CSS 可以快速构建现代化的用户界面
							</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-secondary-500">
							<div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
								<span className="text-2xl">🎨</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">自定义主题</h3>
							<p className="text-gray-600">
								轻松自定义颜色、间距、字体等样式配置
							</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-success">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
								<span className="text-2xl">⚡</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">高性能</h3>
							<p className="text-gray-600">
								按需生成，只包含使用到的样式，体积更小
							</p>
						</div>
					</div>
				</section>

				{/* Animations */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">动画效果</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="flex flex-col items-center">
							<div className="w-20 h-20 bg-primary-500 rounded-lg animate-spin-slow mb-3"></div>
							<p className="text-sm text-gray-600">慢速旋转</p>
						</div>
						<div className="flex flex-col items-center">
							<div className="w-20 h-20 bg-secondary-500 rounded-full animate-bounce-slow mb-3"></div>
							<p className="text-sm text-gray-600">弹跳</p>
						</div>
						<div className="flex flex-col items-center">
							<div className="w-20 h-20 bg-success rounded-lg animate-pulse-fast mb-3"></div>
							<p className="text-sm text-gray-600">脉冲</p>
						</div>
						<div className="flex flex-col items-center">
							<div className="w-20 h-20 bg-warning rounded-full shadow-glow mb-3"></div>
							<p className="text-sm text-gray-600">发光效果</p>
						</div>
					</div>
				</section>

				{/* Typography */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">字体排版</h2>
					<div className="space-y-4">
						<p className="text-5xl font-bold text-primary-600">
							特大标题 (5xl)
						</p>
						<p className="text-4xl font-bold text-gray-700">大标题 (4xl)</p>
						<p className="text-3xl font-semibold text-gray-600">
							中标题 (3xl)
						</p>
						<p className="text-xl text-gray-600">
							正文文本 - 使用自定义字体族，支持多种字重和样式
						</p>
						<p className="font-mono text-sm bg-gray-100 p-4 rounded-lg">
							const code = "这是等宽字体，适合展示代码";
						</p>
					</div>
				</section>

				{/* Spacing & Layout */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">间距布局</h2>
					<div className="space-y-4">
						<div className="bg-primary-100 p-4 rounded-lg">
							<p className="text-gray-700">标准间距 (p-4)</p>
						</div>
						<div className="bg-secondary-100 p-8 rounded-lg">
							<p className="text-gray-700">较大间距 (p-8)</p>
						</div>
						<div className="bg-primary-200 p-12 rounded-lg">
							<p className="text-gray-700">超大间距 (p-12)</p>
						</div>
					</div>
				</section>

				{/* Interactive Modal Example */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">交互组件</h2>
					<button
						onClick={() => setIsModalOpen(true)}
						className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
					>
						打开模态框
					</button>

					{isModalOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
							<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-slideUp shadow-2xl">
								<h3 className="text-2xl font-bold text-gray-800 mb-4">
									模态框标题
								</h3>
								<p className="text-gray-600 mb-6">
									这是一个使用 Tailwind CSS
									构建的模态框组件，包含淡入和滑动动画效果。
								</p>
								<div className="flex gap-4">
									<button
										onClick={() => setIsModalOpen(false)}
										className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-300"
									>
										确认
									</button>
									<button
										onClick={() => setIsModalOpen(false)}
										className="flex-1 px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors duration-300"
									>
										取消
									</button>
								</div>
							</div>
						</div>
					)}
				</section>

				{/* Responsive Grid */}
				<section className="mb-12 bg-white rounded-4xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">响应式网格</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
							<div
								key={item}
								className="bg-gradient-to-br from-primary-400 to-secondary-400 text-white p-6 rounded-xl text-center font-bold text-xl"
							>
								项目 {item}
							</div>
						))}
					</div>
					<p className="text-sm text-gray-600 mt-4">
						尝试调整浏览器窗口大小，查看响应式布局效果
					</p>
				</section>
			</div>
		</div>
	);
};

export default TailwindDemo;
