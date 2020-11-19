const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.resolve.alias.set("@", resolve("src"));
    config.entry("index").add("babel-polyfill");
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      );
      if (process.env.npm_config_report) {
        // 打包后模块大小分析//npm run build --report
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    }
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/index.scss";`
      }
    }
  },

  // 打包时生成.map文件
  productionSourceMap: false,

  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  devServer: {
    open: false, // 启动服务后是否打开浏览器
    host: "0.0.0.0",
    port: 8180, // 服务端口
    // https: false,
    // hotOnly: true,
    proxy: {
      "/mrguyu_test": {
        target: "https://fy.wego168.com/mrguyu_test",
        changeOrigin: true,
        pathRewrite: {
          "/mrguyu_test": ""
        }
      },
      "/mrguyu": {
        target: "https://fy.wego168.com/mrguyu1",
        changeOrigin: true,
        pathRewrite: {
          "/mrguyu": "mrguyu"
        }
      }
    }
  }
};
