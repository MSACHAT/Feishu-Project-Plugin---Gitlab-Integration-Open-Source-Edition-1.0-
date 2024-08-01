import { OutOfLimitError } from '@lark-project/js-sdk';

import { sdkManager } from './sdk';

export async function copyText(text: string) {
  const sdk = await sdkManager.getSdkInstance();
  try {
    const success = await sdk.clipboard.writeText(text);
    if (success) {
      sdk.toast.success('复制成功');
    } else {
      sdk.toast.warning('当前浏览器不支持复制');
    }
  } catch (error) {
    if (error.name === OutOfLimitError.name) {
      sdk.toast.error(error.originMessage);
    } else {
      sdk.toast.error('复制失败');
    }
  }
}
