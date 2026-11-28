// 渲染设置。镜头代码放在本文件夹外面（demos-own/、assets/lib/），
// 所以把本文件夹的 node_modules 加进查找路径，外面的文件 import 'remotion'、'react' 也能找到。
import os from 'node:os';
import path from 'node:path';
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(Math.max(1, Math.min(4, os.cpus().length))); // 最多 4 路；机器核少就少开
Config.overrideWebpackConfig((c) => ({
  ...c,
  resolve: { ...c.resolve, modules: [path.resolve(process.cwd(), 'node_modules'), ...(c.resolve?.modules ?? ['node_modules'])] },
}));
