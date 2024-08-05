// Get the login status of the plug-in

import { authAgree } from './api';
import { isVisible } from './api/service';
import { APP_KEY } from './constants';
import useSdkContext from './hooks/useSdkContext';
import { sdkManager } from './utils';

// If return false, will call the function `authorize` with a code
export async function isLogin(): Promise<boolean> {
  // const sdk = await sdkManager.getSdkInstance();

  // const token = sdk.storage.getItem(`${APP_KEY}_token`);
  // const expireTimeStr = sdk.storage.getItem(`${APP_KEY}_expire_time`);

  // if (!token || !expireTimeStr) {
  //   return false;
  // }

  // const expireTime: number = Number(expireTimeStr);
  // if (isNaN(expireTime) || expireTime - Date.now() <= 0) {
  //   return false;
  // }

  return true;
}

export const authorize = async (code: string): Promise<boolean> => {
  const sdk = await sdkManager.getSdkInstance();
  /**
   * authAgree 为服务端提供的code换token的接口
   * 拿到token后存储到缓存中
   */
  return new Promise((resolve, reject) => {
    // 可以直接resolve表示无需鉴权
    // resolve(true);
    authAgree(code)
      .then(async res => {
        const { token, expireTime } = res.data;
        // expire_time示例值 7200 秒，这里累加当前时间，再减去五分钟，作为最终失效时间

        await sdk.storage.setItem(`${APP_KEY}_token`, token);
        // 前端比后端的过期时间早五分钟

        await sdk.storage.setItem(
          `${APP_KEY}_expire_time`,
          (Number(expireTime) * 1000 + Date.now() - 300000).toString(),
        );
      })
      .catch(error => {
        console.log(error);
        reject(false);
      });
  });
};

export const visibilityControl = (type, key) => {
  return new Promise((resolve, reject) => {
    if (type === 'DASHBOARD') {
      // resolve(true);
      const ctx = useSdkContext();
      const project_key = ctx?.mainSpace?.id || '';
      const work_item_id = ctx?.activeWorkItem?.id || 0;
      const work_item_type_key = ctx?.activeWorkItem?.workObjectId || '';
      if (work_item_id && work_item_type_key) {
        isVisible({
          project_key,
          work_item_id,
          work_item_type_key,
        })
          .then(res => {
            if (res.data?.is_visbile) resolve(true);
            else resolve(false);
          })
          .catch(() => {
            resolve(false);
          });
      } else {
        resolve(false);
      }
    }
  });
};

export function getIntergrationPointConfig(type, key = '') {
  const configs = {
    BUTTON: {
      button_demo: { need_self_renderer: true, work_item_type: ['_all'] },
      button_id: { need_self_renderer: true, work_item_type: ['_all'] },
    },
  };
  return configs[type] ? configs[type][key] : {};
}
