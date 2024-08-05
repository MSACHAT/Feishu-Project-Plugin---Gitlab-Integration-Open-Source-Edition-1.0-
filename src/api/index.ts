import axios from 'axios';
import { ICommonSetting, ResponseWrap } from './types';
import { APP_KEY } from '../constants';
import { sdkManager } from '../utils';

interface ResWrapper<T = {}> {
  message: string;
  statusCode: number;
  data: T;
}
axios.interceptors.request.use(
  async config => {
    const sdk = await sdkManager.getSdkInstance();
    const token = sdk.storage.getItem(`${APP_KEY}_token`) || '';

    config.headers['X-TOKEN'] = token;
    config.headers['x-lark-gw'] = 1;
    return config;
  },
  err => Promise.reject(err),
);
axios.interceptors.response.use(
  function (response) {
    const statusCode =
      response.data?.status_code || response.data?.statusCode || response.data?.error?.code || 0;

    const errMsg =
      response?.data?.message ||
      response?.data?.msg ||
      response?.data?.error?.display_msg?.content ||
      response?.data?.error?.display_msg?.title;
    if (statusCode !== 0 && errMsg) {
      response.data = Object.assign(response.data, { errMsg });
      return Promise.reject(new Error(errMsg));
    }
    return response;
  },
  // 作为一个插件，如果报错，就捕获并上报，不要影响宿主业务
  // TODO: 错误上报
  function (error) {
    // TODO: 401，403
    return Promise.reject(error);
  },
);
// 获取自定义流转规则
export const getCommonSetting = (project_key: string) =>
  axios
    .get<unknown, ResponseWrap<ICommonSetting>>('/m-api/v1/builtin_app/gitlab/common_setting', {
      params: { project_key },
    })
    .then(res => res.data);
interface AuthRes {
  code: string;
  state: string;
  token: string;
  expire_time: string;
}
/**
 * Login authentication
 * @param data
 * @returns
 */
export function authAgree(code: string) {
  return axios
    .post<ResWrapper<AuthRes>>(`http://8.130.34.194:18081/login`, { code: code })
    .then(res => res.data);
}
