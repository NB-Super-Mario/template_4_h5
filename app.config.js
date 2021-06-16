const path = require('path');
const config = require('config');

const domain = config.get('domain');

const apiDomain = config.get('apiDomain');
const hostname = config.get('hostname');
const isOpenBrowser = config.get('isOpenBrowser');

const cwd = process.cwd();
const pkg = require(path.resolve(cwd, 'package.json'));

const src = path.resolve(cwd, 'src');
const PREFIX_TARGET = '';
module.exports = {
  definePlugin: [
    {
      API_DOMAIN: JSON.stringify(apiDomain),
      DOMAIN: JSON.stringify(domain),
    },
  ],
  alias: {
    '@components': path.resolve(cwd, 'src/scripts/components'),
    '@actions': path.resolve(cwd, 'src/scripts/actions'),
    '@api': path.resolve(cwd, 'src/scripts/api'),
    '@routes': path.resolve(cwd, 'src/scripts/routes'),
    '@util': path.resolve(cwd, 'src/scripts/util'),
  },
  domain,
  hostname,
  pkg,
  cwd,
  src,
  //prefixTarget: 'react/',
  prefixTarget: PREFIX_TARGET,
  dllEntry: {
    react: [
      'react',
      'react-dom',
      'react-router-dom',
      'redux',
      'react-redux',
      'connected-react-router',
    ],
  },
  dllOutput: path.resolve(cwd, 'src', 'dll'),
  provideDefs: {
    //$ jQuery 使用当前resolve的jquery
    $: 'zepto',
    Zepto: 'zepto',
    'window.$': 'zepto',
    'window.Zepto': 'zepto',
  },
  externals: {
    zepto: 'Zepto',
    zepto: '$',
  },
  alwaysWriteToDisk: true,
  minify: {
    /* removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true */
  },

  copyRes: [
    { from: 'src/static-res/mock', to: `${PREFIX_TARGET}static-mock` },
    { from: 'src/static-res/img', to: `${PREFIX_TARGET}static-img` },
    { from: 'src/static-res/css', to: `${PREFIX_TARGET}static-css` },
  ],
  dev: {
    publicPath: domain,
    output: path.resolve(cwd, '__build'),
    isOpenBrowser: false,
  },
  build: {
    publicPath: domain,
    output: path.resolve(cwd, 'target', `${pkg.name}`),
    bundleAnalyzerReport: process.env.npm_config_report, // npm run build --report
    productionGzip: false,
    combo: false, // 预留字段
    chunkhash: false,
  },
  isAntd: false,
  isBootstrap: false,
  indexPage: 'index.html',
};
