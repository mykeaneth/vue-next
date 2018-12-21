module.exports = {
  presets: [
    ["@babel/preset-env", {
      useBuiltIns: "entry",
      modules: false
    }]
  ],
  plugins: ["@babel/plugin-syntax-dynamic-import"]
}
