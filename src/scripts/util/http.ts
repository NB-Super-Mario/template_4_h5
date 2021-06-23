import axios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";
import Env from "./env";
import JSBridge from "./jsbridge";
import { nativeLogin, getFromOrigin, FromOrigin } from "./index";

import { Toast } from "antd-mobile";
import getStore from "../store";
import {
  showLoading as showCommonLoading,
  hideLoading as hideCommonLoading,
} from "@actions/common";

declare global {
  interface Window {
    isCallNativeLogin: boolean;
  }
}

declare let DEBUGUID: string;

const httpClient: AxiosInstance = axios.create({
  // baseURL: `${API_DOMAIN}`,
  timeout: 20000,
});
export interface ApiUri {
  c2c: string;
  driver: string;
}

export interface CustomeOpts {
  needError: boolean;
  showLoading: boolean;
}
const makeRequest = <T>(
  method: string,
  url: string,
  queryParams?: object,
  body?: object
) => {
  let request: AxiosPromise<T>;
  switch (method) {
    case "GET":
      request = httpClient.get<T>(url, { params: queryParams });
      break;
    case "POST":
      request = httpClient.post<T>(url, body, { params: queryParams });
      break;
    case "PUT":
      request = httpClient.put<T>(url, body, { params: queryParams });
      break;
    case "PATCH":
      request = httpClient.patch<T>(url, body, { params: queryParams });
      break;
    case "DELETE":
      request = httpClient.delete(url, { params: queryParams });
      break;

    default:
      throw new Error("Method not supported");
  }

  return new Promise((resolve, reject) => {
    request
      .then(async (response) => {
        const result: any = response.data;
        if (result.status === 0) {
          // 此处处理不同状态逻辑 例如 ajax 的登录拦截
          resolve(response.data);
        } else if (result.status === 5) {
          if (Env.getAppInfo().isMario) {
            if (window.isCallNativeLogin) return;
            window.isCallNativeLogin = true;
            try {
              await nativeLogin();
            } catch (error) {
              console.log(error);
            } finally {
              window.isCallNativeLogin = false;
            }
          } else {
            window.location.href = `/login?redirectURL=${encodeURIComponent(
              window.location.href
            )}`;
          }
        } else {
          reject(response.data);
        }
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};
export default class HttpUtil {
  /**
   * get 方式发送请求
   * @param opts ajax 参数
   */
  static getData(config: any) {
    const newConfig: AxiosRequestConfig = {
      method: "get", // default
      // baseURL: `${API_DOMAIN}`,
      responseType: "json",
      responseEncoding: "utf8",
      timeout: 50000,
      ...config,
    };
    return axios.request(newConfig);
  }

  /**
   * post 方式发送请求
   * @param opts ajax 参数
   */
  static postData(config: any): Promise<{ re: any }> {
    const newConfig: AxiosRequestConfig = {
      method: "post", // default
      // baseURL: `${API_DOMAIN}`,
      responseType: "json",
      responseEncoding: "utf8",
      timeout: 50000,
      ...config,
    };
    // 自定义配置
    const cusOptions: CustomeOpts = config.cusOptions;
    delete newConfig.cusOptions;
    const { needError = false, showLoading = true } = cusOptions || {};

    const store = getStore({});

    const hideLoading = () => {
      if (showLoading) {
        store.dispatch(hideCommonLoading());
      }
    };

    const loading = () => {
      if (showLoading) {
        store.dispatch(showCommonLoading());
      }
    };

    loading();

    const request: AxiosPromise = httpClient.request(newConfig);

    return new Promise((resolve, reject) => {
      request
        .then(async (response) => {
          const result: any = response.data;
          if (result.status === 0) {
            // 此处处理不同状态逻辑 例如 ajax 的登录拦截
            resolve(response.data);
          } else if (result.status === 5) {
            if (Env.getAppInfo().isMario) {
              if (window.isCallNativeLogin) return;
              window.isCallNativeLogin = true;
              try {
                await nativeLogin();
              } catch (error) {
                console.log(error);
              } finally {
                window.isCallNativeLogin = false;
              }
            } else {
              window.location.href = `/login?redirectURL=${encodeURIComponent(
                window.location.href
              )}`;
            }
          } else if (response.data && response.data.msg) {
            if (needError) {
              resolve(response.data);
            } else {
              setTimeout(() => {
                Toast.info(
                  response.data.msg
                    ? response.data.msg
                    : "服务请求失败, 请稍后再试!",
                  2
                );
              }, 10);
              resolve();
            }
          } else {
            reject(response.data);
          }

          hideLoading();
        })
        .catch((err: Error) => {
          Toast.info("服务请求失败, 请稍后再试!");
          hideLoading();
          resolve();
        });
    });

    // return axios.request(newConfig);
  }

  /**
   * api 接口调用统一是post data
   * @param opts ajax 调用参数
   */
  static apiData(config: any) {
    if (
      !config ||
      ("string" !== typeof config.url && "string" !== typeof config.api)
    )
      return false;
    if ("string" === typeof config.api) {
      const data = config.data || {};
      data.cid = `${DRIVER_CID}`;
      config.data = qs.stringify({
        uri: HttpUtil.getApiUri(config.api),
        data: JSON.stringify(data),
      });
      config.url = "/api/gw";
    }

    return HttpUtil.postData(config);
  }

  static c2cwApiData(config: any) {
    if (
      !config ||
      ("string" !== typeof config.url && "string" !== typeof config.api)
    )
      return null;

    const appInfo = Env.getAppInfo();

    // 判断是否是jsb环境
    // 不是jsb环境则走http
    console.log("appInfo :", appInfo);
    if (
      appInfo.isMarioInc &&
      appInfo.version &&
      appInfo.version.split(".").length === 3 &&
      appInfo.version >= "3.5.0"
    ) {
      return this.jsBridgeApi(config);
    }

    if ("string" === typeof config.api) {
      const data = config.data || {};
      data.cid = `${C2C_CID}`;
      config.data = qs.stringify({
        uri: config.api,
        data: JSON.stringify(data),
      });
      config.url = "/api/gw";
    }

    return HttpUtil.postData(config);
  }

  static dwApiData(config: any) {
    if (
      !config ||
      ("string" !== typeof config.url && "string" !== typeof config.api)
    )
      return null;
    if ("string" === typeof config.api) {
      const data = config.data || {};
      data.cid = `${DRIVER_CID}`;
      config.data = qs.stringify({
        uri: config.api,
        data: JSON.stringify(data),
      });
      config.url = "/api/gw";
    }

    return HttpUtil.postData(config);
  }

  /**
   * @description
   * @author Liying <ly.boy2012@gmail.com>
   * @date 2019-04-24
   * @static
   * @param {*} config
   * @returns
   */
  static driverApiData(config: any) {
    const origin = getFromOrigin();
    return origin === FromOrigin.c2c
      ? HttpUtil.c2cwApiData({ ...config, api: config.api.c2c })
      : HttpUtil.dwApiData({ ...config, api: config.api.driver });
  }

  static getApiUri(uri: ApiUri) {
    const origin = getFromOrigin();
    return origin === FromOrigin.c2c ? uri.c2c : uri.driver;
  }

  static get<T>(url: string, queryParams?: object) {
    return makeRequest<T>("GET", url, queryParams);
  }

  static post<T>(url: string, body: object, queryParams?: object) {
    const data: any = qs.stringify(body);
    return makeRequest<T>("POST", url, queryParams, data);
  }

  static put<T>(url: string, body: object, queryParams?: object) {
    return makeRequest<T>("PUT", url, queryParams, body);
  }

  static patch<T>(url: string, body: object, queryParams?: object) {
    return makeRequest<T>("PATCH", url, queryParams, body);
  }

  static delete(url: string, queryParams?: object) {
    return makeRequest("DELETE", url, queryParams);
  }

  /**
   * axios 不支持jsonp 后期换掉 axios
   * @param opts
   */
  static zeptoGetData(opts: any) {
    const newOpts = {
      type: "GET",
      cache: false,
      dataType: "json",
      timeout: 20000,
      ...opts,
    };
    return $.ajax(newOpts);
  }

  static fetch(opts: any) {
    return new Promise((resolve, reject) => {
      opts.success = (data) => {
        resolve(data); // 把需要数据返回
      };
      opts.error = (data) => {
        reject(data); // 把整个对象返回，status data 自己在逻辑处理
      };
      return HttpUtil.zeptoGetData(opts);
    });
  }

  /**
   * jsbridge调用http
   */
  static jsBridgeApi(opts: any) {
    const parameters = {
      path: opts.api,
      parameters: opts.data,
    };

    // 自定义配置
    const cusOptions: CustomeOpts = opts.cusOptions;
    const { showLoading = true } = cusOptions || {};

    const store = getStore({});

    const hideLoading = () => {
      if (showLoading) {
        store.dispatch(hideCommonLoading());
      }
    };

    const loading = () => {
      if (showLoading) {
        store.dispatch(showCommonLoading());
      }
    };

    loading();

    console.log("### [jsbHTTP] 请求参数:", parameters);
    return new Promise((resolve, reject) => {
      JSBridge.jsCallNative({
        protocol: "http",
        parameters,
        callBack: (data) => {
          console.log("data :", data);
          try {
            data = JSBridge.handleData(data);
            console.log(`### [jsbHTTP] ${opts.api} 返回结果:`, data);
            // 兼容现有项目
            if (data.data && data.data.content) {
              data.data.re = data.data.content;
              delete data.data.content;
            }

            if (data.status.success && data.data) {
              // 请求成功处理code逻辑
              const code = data.data.code;
              if (code === 1) {
                // 成功逻辑
                resolve(data.data); // 把需要数据返回
              } else if (code === 5) {
                // 登录逻辑
                if (window.isCallNativeLogin) return;
                nativeLogin()
                  .then(() => {
                    window.isCallNativeLogin = false;
                  })
                  .catch((err) => {
                    console.log(err);
                    window.isCallNativeLogin = false;
                  });
              } else {
                // 接口返回错误信息
                const msg = data.data.msg;

                // 自定义处理错误
                if (opts.cusOptions && opts.cusOptions.needError) {
                  resolve(data.data);
                  return;
                }

                // 通用弹出提示
                setTimeout(() => {
                  Toast.info(msg || "您的网络状况不好，请稍后再试");
                }, 10);
              }
            } else {
              // 网络or超时
              setTimeout(() => {
                Toast.info("您的网络状况不好，请稍后再试", 1);
              }, 10);

              // 自定义处理错误
              if (opts.cusOptions && opts.cusOptions.needError) {
                reject(data.data); // 把整个对象返回，status data 自己在逻辑处理 data==null是网络异常
              } else {
                resolve();
              }
            }
          } catch (error) {
            // 处理错误
          } finally {
            hideLoading();
          }
        },
      });
    });
  }

  /**
   * 新平台调用api
   * @param path
   * @param params
   * @param options
   */
  static newAPI(path: string, params?: object, options?: JSBOptions) {
    let data = params;
    let uid = DEBUGUID; // 开发环境 页面发送http用uid
    if (uid) {
      Object.assign(data, { uid });
    }

    return this.c2cwApiData({
      api: path,
      data,
      cusOptions: { ...options },
    });
  }

  /**
   * 判断是否请求成功
   *
   * @param res 响应内容
   * @param needContent 是否需要content字段
   */
  static isSuccess(res: any, needContent?: boolean) {
    if (res && res.code === 1) {
      if (needContent) {
        return !!res.re;
      }
      return true;
    }
    return false;
  }

  /**
   * 判断是否请求成功 租车
   * @param res 响应内容
   */
  static isSuccessZuche(res: any): boolean {
    if (res && res.code === 1) {
      if (!res.re) {
        return false;
      }

      if (res.re.status === 0) {
        return true;
      }
    }
    return false;
  }
}

interface JSBOptions {
  needError?: boolean;
  showLoading?: boolean;
}
