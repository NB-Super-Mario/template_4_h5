/*= =========react 相关========= */
const ip = require("ip").address();

const PORT = 9901;
let cookie;
// 本地开发访问测试api 地址 ，必须http开头， // 开头代理不过
const API_DOMAIN = "http://demo.com/";

module.exports = {
  port: PORT,
  hostname: `${ip}:${PORT}/`, // combo 将要替换的域名
  domain: `//${ip}:${PORT}/`, // 替换后域名
  apiDomain: API_DOMAIN,
  proxy: {
    "/api/*": {
      target: API_DOMAIN,
      changeOrigin: true,
      onProxyRes(proxyRes, req, res) {
        const cookies = proxyRes.headers["set-cookie"];
        if (!cookie) {
          cookie = cookies;
          // TODO 如有其他cookie需求再做filter
        }
      },
      onProxyReq(proxyReq) {
        if (cookie) {
          proxyReq.setHeader("Cookie", cookie);
        }
      },
    },
  },
  isOpenBrowser: true,
};

/*= =========react 相关========= */
