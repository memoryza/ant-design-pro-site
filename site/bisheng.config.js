const path = require('path');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;

module.exports = {
  port: 8001,
  root: '/test/',
  source: {
    components: './scaffold/src/components',
    docs: './docs',
  },
  theme: './site/theme',
  htmlTemplate: './site/theme/static/template.html',
  themeConfig: {
    typeOrder: {
      入门: 0,
      进阶: 1,
      其他: 2,
    },
  },
  filePathMapper(filePath) {
    return filePath;
  },
  doraConfig: {},
  webpackConfig(config) {
    config.resolve.alias = {
      'ant-design-pro/lib': path.join(process.cwd(), 'scaffold/src/components'),
      'ant-design-pro': path.join(process.cwd(), 'config/components/index'),
      site: path.join(process.cwd(), 'site'),
      'react-router': 'react-router/umd/ReactRouter',
    };

    config.externals = config.externals || {};
    config.externals['react-router-dom'] = 'ReactRouterDOM';
    config.externals.react = 'React';
    config.externals.React = 'React';
    config.externals['react-dom'] = 'ReactDOM';
    config.externals.ReactDOM = 'ReactDOM';

    config.babel.plugins.push([
      require.resolve('babel-plugin-transform-runtime'),
      {
        polyfill: false,
        regenerator: true,
      },
    ]);

    // components 下面的走 css module 其他不变
    config.module.loaders.forEach((loader) => {
      if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
        if (loader.exclude) {
          loader.exclude.push(/components/);
        } else {
          loader.exclude = [/components/];
        }
      }
      if (loader.test.toString() === '/\\.module\\.less$/') {
        loader.test = /components.*.less$/;
      }
    });

    config.plugins.push(new CSSSplitWebpackPlugin({ size: 4000 }));

    return config;
  },
};
