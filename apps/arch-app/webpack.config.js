// webpack.config.js
const { resolve } = require("node:path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require("webpack-merge");
const argv = require("yargs-parser")(process.argv.slice(2));

// 加载 .env 文件
require('dotenv').config();

const _mode = argv.mode || "development";

const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const webpackConfig = {
	mode: "development",

	entry: {
		main: resolve("src/index.tsx"),
	},

	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},

	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "typescript",
								tsx: true,
								decorators: true,
								dynamicImport: true,
							},
							transform: {
								react: {
									runtime: "automatic",
									development: false,
									refresh: true,
								},
							},
							target: "es2022",
						},
						module: {
							type: "es6",
						},
					},
				},
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { importLoaders: 1 } },
					"postcss-loader",
				],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: _mode
				? "styles/[name].[contenthash:5].css"
				: "styles/[name].css",
			chunkFilename: _mode
				? "styles/[name].[contenthash:5].css"
				: "styles/[name].css",
			ignoreOrder: false,
		}),
		// Define environment variables for the browser
		new webpack.DefinePlugin({
			"process.env.USE_LOCAL_CHAIN": JSON.stringify(
				process.env.USE_LOCAL_CHAIN || "false",
			),
			"process.env.NEXT_PUBLIC_USE_LOCAL_CHAIN": JSON.stringify(
				process.env.NEXT_PUBLIC_USE_LOCAL_CHAIN || "false",
			),
			"process.env.NODE_ENV": JSON.stringify(_mode),
			// Pinata 环境变量
			"process.env.VITE_PINATA_JWT": JSON.stringify(
				process.env.VITE_PINATA_JWT || "",
			),
			"process.env.VITE_PINATA_API_KEY": JSON.stringify(
				process.env.VITE_PINATA_API_KEY || "",
			),
			"process.env.VITE_PINATA_SECRET_KEY": JSON.stringify(
				process.env.VITE_PINATA_SECRET_KEY || "",
			),
			"process.env.VITE_IPFS_GATEWAY": JSON.stringify(
				process.env.VITE_IPFS_GATEWAY || "https://gateway.pinata.cloud",
			),
		}),
		// Ignore optional wagmi connectors that require additional dependencies
		new webpack.IgnorePlugin({
			resourceRegExp: /^(porto\/internal|porto|@base-org\/account|@coinbase\/wallet-sdk|@gemini-wallet\/core|@metamask\/sdk|@safe-global\/safe-apps-sdk|@safe-global\/safe-apps-provider|@walletconnect\/ethereum-provider)$/,
			contextRegExp: /@wagmi\/connectors/,
		}),
	],

};

module.exports = merge.default(webpackConfig, _mergeConfig);
