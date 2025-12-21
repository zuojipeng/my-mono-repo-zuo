const { resolve } = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",

  // Source maps for production (smaller but still debuggable)
  devtool: "source-map",

  output: {
    path: resolve(__dirname, "../dist"),
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    publicPath: "/",
    clean: true, // Clean dist folder before build
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "../public/index.html"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log in production
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info", "console.debug"],
          },
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false,
      }),
    ],

    // Code splitting configuration
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // Vendor dependencies (node_modules)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          reuseExistingChunk: true,
        },

        // React and React-DOM
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          priority: 20,
          reuseExistingChunk: true,
        },

        // Web3 libraries (wagmi, viem, ethers)
        web3: {
          test: /[\\/]node_modules[\\/](wagmi|viem|@wagmi|ethers)[\\/]/,
          name: "web3",
          priority: 15,
          reuseExistingChunk: true,
        },

        // Common shared code
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: "common",
        },
      },
    },

    // Runtime chunk for better long-term caching
    runtimeChunk: {
      name: "runtime",
    },

    // Module IDs based on hash for better caching
    moduleIds: "deterministic",
  },

  performance: {
    hints: "warning",
    maxEntrypointSize: 512000, // 500 KB
    maxAssetSize: 512000, // 500 KB
  },
};
