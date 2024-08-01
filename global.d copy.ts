// 相关静态资源
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ttf';
declare module '*.woff';
declare module '*.woff2';
declare module '*.less';
declare module '*.mp4';

declare module '*.svg' {
  const content: any;
  export default content;
}

// 飞书项目（Meego）注入的第三方模块
declare module 'RendererDefinitions';
declare module '@ies/semi-ui-react';
declare module '@meego/MeegoCdkDefinitions';
declare module 'BasePlugin';
declare module 'DetectInvalidValue';
declare module 'Component';
declare module 'SemiIcons';
declare module 'SemiUiReact';
declare module 'MeegoPingere';
declare module 'MeegoPingereDefinitions';
declare module 'Lodash';

declare const stores;
