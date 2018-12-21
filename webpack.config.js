const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const workboxPlugin = require('workbox-webpack-plugin');
const webpack = require("webpack");
const merge = require("webpack-merge");
const fs = require("fs");

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";
  const name = (pre, ext, post) => {
    const theName = str => {
      return `${pre ? pre : ""}[name]${post ? "-" + post : ""}${
        devMode ? "" : ".[" + str + ":4]"
      }.${ext ? ext : "[ext]"}`;
    };
    return {
      hashed: theName("hash"),
      chunkhashed: theName("chunkhash")
    };
  };

  const cleanDist = {
    plugins: [new CleanWebpackPlugin(["dist"])]
  };

  const common = {
    devServer: {
      stats: 'errors-only'
    },
    mode: devMode ? "development" : "production",
    resolve: {
      extensions: [".mjs", ".js", ".vue", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    entry: {
      main: "@/main.js"
    },
    output: {
      path: path.resolve(__dirname, "dist")
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.m?js$/,
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            ecma: 6,
            warnings: false
          }
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        cacheGroups: {
          styles: {
            test: /\.(postcss|css)$/,
            name: "style",
            chunks: "all",
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [{
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.m?js$/,
          exclude: /shim/,
          loader: "babel-loader",
          exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
        },
        {
          test: /\.html$/,
          use: [{
            loader: "html-loader",
            options: {
              minimize: !devMode
            }
          }]
        },
        {
          test: /\.(postcss|css)$/,
          use: [
            devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            "postcss-loader"
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [{
            loader: "file-loader",
            options: {
              name: name("[path]").hashed,
              context: "src/assets"
            }
          }]
        }
      ]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: name("styles/", "css").chunkhashed,
        chunkFilename: name("styles/", "css").chunkhashed
      }),
      new HtmlWebPackPlugin({
        favicon: "./public/favicon.ico",
        template: "./public/index.ejs",
        filename: "index.html",
        meta: {
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
          "theme-color": "#42b983"
        },
        minify: {
          removeComments: !devMode,
          collapseWhitespace: !devMode,
          removeAttributeQuotes: false
        },
        inject: true,
        title: "Vue Next",
        inline: fs.readFileSync("./public/scripts/nomodule-shim.js", "utf8")
      }),
      new ScriptExtHtmlWebpackPlugin({
        module: /\.mjs$/,
        preload: /\.m?js$/,
        prefetch: {
          test: /\.m?js$/,
          chunks: "async"
        }
      }),
      new workboxPlugin.GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: true,
      })
    ]
  };

  const modern = {
    output: {
      filename: name("scripts/", "mjs").chunkhashed,
      chunkFilename: name("scripts/", "mjs").chunkhashed
    },
    module: {
      rules: [{
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true
                  }
                }
              ]
            ]
          }
        }
      }]
    }
  };

  const legacy = {
    output: {
      filename: name("scripts/", "js", "legacy").chunkhashed,
      chunkFilename: name("scripts/", "js", "legacy").chunkhashed
    }
  };

  let modernConfig = merge.smart(cleanDist, common, modern);
  let legacyConfig = merge.smart(common, legacy);

  if (env && env.hybrid) {

    modernConfig = merge.smart(modernConfig, {
      plugins: [
        new IgnoreEmitPlugin("index.html"),
        new HtmlWebPackPlugin({
          filename: "index.ejs",
        })
      ]
    });

    legacyConfig = merge.smart(legacyConfig, {
      module: {
        rules: [{
          test: /\.(png|jpg|gif)$/,
          use: [{
            loader: "file-loader",
            options: {
              emitFile: false
            }
          }]
        }]
      },
      plugins: [
        new IgnoreEmitPlugin(/\.(ico)$/),
        new HtmlWebPackPlugin({
          template: "./dist/index.ejs"
        })
      ]
    });
  } else {
    legacyConfig = merge.smart(cleanDist, legacyConfig);
  }

  return (env && env.build && env.build === "legacy") ? legacyConfig : modernConfig;
};
