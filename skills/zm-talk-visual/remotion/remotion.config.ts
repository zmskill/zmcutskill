import path from 'path';
import {Config} from '@remotion/cli/config';

// 镜头代码在上一级的 shot-library/ 里，那里没有 node_modules。让打包器回到本文件夹的 node_modules 找 react 和 remotion。
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {...config.resolve, modules: [path.resolve(process.cwd(), 'node_modules'), 'node_modules']},
}));
