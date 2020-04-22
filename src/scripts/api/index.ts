import HttpUtil, { ApiUri, CustomeOpts } from "@util/http";
import { getUid } from "@util/custom-jsbridge";
import { getFromOrigin, FromOrigin } from "@util/index";
import Env from "@util/env";

/**
 *
 * @param apiUri
 * @param data
 * @param cusOpts
 */
export const uidApi = async (
  apiUri: ApiUri,
  data: any = {},
  cusOpts?: CustomeOpts
) => {
  const cusOptions: CustomeOpts = cusOpts || {
    showLoading: false,
    needError: false,
  };
  let uid = DEBUGUID;
  if (!uid) {
    uid = await getUid();
  }
  return HttpUtil.driverApiData({
    api: apiUri,
    data: {
      ...data,
      uid,
    },
    cusOptions,
  });
};

/**
 * 新封装api 访问 如果在webview 环境 同时支持 http jsbridge 的c2c 接口才会生效
 * @param apiUri
 * @param data
 * @param cusOpts
 */
export const api = async (
  apiUri: ApiUri,
  data: any = {},
  cusOpts?: ICustomeOpts
) => {
  // 如果在app webview 内，同时是c2c
  if (Env.getAppInfo().isMarioInc && getFromOrigin() === FromOrigin.c2c) {
    return HttpUtil.jsBridgeApi({
      api: apiUri,
      data,
    });
  }
  const cusOptions: CustomeOpts = cusOpts || {
    showLoading: false, // 是否请求过程需要loading
    needError: false,
  };
  let uid = DEBUGUID;
  if (!uid) {
    uid = await getUid();
  }
  return HttpUtil.driverApiData({
    api: apiUri,
    data: {
      ...data,
      uid,
    },
    cusOptions,
  });
};
