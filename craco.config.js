const path = require("path");
const appConfig = require("./src/AppConfig.json");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    port: appConfig.port,
  },
};
