import {
  getStorage,
  setStorage,
  setSession,
  getSession,
  removeSession,
} from "./storage";
import Evn from "./env";

import JSBridge from "./jsbridge";

export { default as getScroll } from "./getScroll";
export { default as addEventListener } from "./addEventListener";

const DRIVER_KEY = "DRIVER_KEY"; // 机密key
const FROM_ORIGIN = "FROM_ORIGIN";

export enum FromOrigin {
  c2c = "FROM_C2C", // 优驾
  driver = "FROM_DRIVER", // 专职
}

export const escape = (str: string): string => {
  const regexEscape = /["&'<>`]/g;
  const escapeMap = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#x27;",
    "<": "&lt;",
    ">": "&gt;",
    "`": "&#x60;",
  };
  return str.replace(regexEscape, (s: string) => {
    // Note: there is no need to check `has(escapeMap, $0)` here.
    return escapeMap[s];
  });
};

export const wrapContent = (content: any) => {
  if (!content) return content;
  return `<p>${escape(content).replace(/\n/g, "<p>")}`;
};

export const trim = (str: string): string => {
  return str.replace(/^\s+|\s+$/gm, "");
};
export const getUrlParam = (name) => {
  // 给定URL参数名称取得对应的参数
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  if (reg.test(window.location.search.substr(1))) {
    return decodeURIComponent(RegExp.$2);
  }
  if (
    reg.test(window.location.hash.substr(window.location.hash.indexOf("?") + 1))
  ) {
    return decodeURIComponent(RegExp.$2);
  }
  return "";
};

export const generateCallbackUrl = (param: string) => {
  const protocol: string = window.location.protocol;
  const host = window.location.host;
  const path = window.location.pathname;

  return path.includes(param)
    ? `${protocol}//${host}${path}`
    : `${protocol}//${host}${path}${param}`;
};

export const getHostName = () => {
  return `${window.location.protocol}//${window.location.host}`;
};

export const getUid = async () => {
  return Evn.getAppInfo().isMario
    ? new Promise((resolve, reject) => {
        JSBridge.jsCallNative({
          protocol: "getUid",
          parameters: {},
          callBack: (data) => {
            data = JSBridge.handleData(data);
            if (data.status.success) {
              // 返回请求成功
              resolve(data.data.Uid); // 把需要数据返回
              console.info(JSON.stringify(data));
            } else {
              reject(undefined);
            }
          },
        });
      })
    : undefined;
};

export const getDriverKey = () => {
  return getStorage(DRIVER_KEY);
};
export const setDriverKey = (key: string) => {
  return setStorage(DRIVER_KEY, key);
};
export const getFromOrigin = () => {
  return getStorage(FROM_ORIGIN);
};
export const setFromOrigin = (origin: FromOrigin) => {
  return setStorage(FROM_ORIGIN, origin);
};

export const getOriginByQueryString = () => {
  const originParam = getUrlParam("origin");
  return originParam === FromOrigin.c2c ? FromOrigin.c2c : FromOrigin.driver;
};

export const getOrigin = () => {
  let origin = getFromOrigin();
  if (!origin) {
    origin = getOriginByQueryString();
  }
  return origin;
};

/**
 * 是否是合作司机
 */
export const isC2C = () => {
  const origin = getOrigin();
  return origin === FromOrigin.c2c;
};

export const getDriverType = () => {
  const origin = getOrigin();
  if (!origin) {
    return 0;
  }
  return origin === FromOrigin.c2c ? 2 : 1;
};

export const dateFillCN = (str: string): string => {
  const strs = str.split("-");
  if (strs.length === 2) {
    return `${strs.join("年")}月`;
  }
  if (strs.length === 3) {
    return `${strs[0]}年${strs[1]}月${strs[2]}日`;
  }

  return str;
};

export const nativeLogin = async () => {
  return Evn.getAppInfo().isMario
    ? new Promise((resolve, reject) => {
        JSBridge.jsCallNative({
          protocol: "login",
          parameters: {},
          callBack: (data) => {
            data = JSBridge.handleData(data);
            if (data.status.success) {
              // 返回请求成功
              resolve(data.data); // 把需要数据返回
              console.info(JSON.stringify(data));
            } else {
              reject(undefined);
            }
          },
        });
      })
    : undefined;
};
export const selectAddrBook = () => {
  return Evn.getAppInfo().isMario
    ? new Promise((resolve, reject) => {
        JSBridge.jsCallNative({
          protocol: "showAddressBook",
          parameters: {},
          callBack: (data) => {
            data = JSBridge.handleData(data);
            if (data.status.success) {
              // 返回请求成功
              resolve(data.data.phoneNumber); // 把需要数据返回
            } else {
              reject("");
            }
            // $('#share-info').text(`${JSON.stringify(data)}`);
          },
        });
      })
    : "";
};

export const updateNativeUI = () => {
  if (Evn.getAppInfo().isMario && Evn.getOSInfo().isIOS) {
    JSBridge.jsCallNative({
      protocol: "updateUI",
      parameters: {},
      callBack: () => {},
    });
  }
};
export const getFormatTelphone = (num) => {
  num = num.replace(/\D/g, "").substring(0, 11);
  const valueLen = num.length;
  if (valueLen > 3 && valueLen < 8) {
    num = `${num.substr(0, 3)} ${num.substr(3)}`;
  } else if (valueLen >= 8) {
    num = `${num.substr(0, 3)} ${num.substr(3, 4)} ${num.substr(7)}`;
  }
  return num;
};

const WAP_CITY_LIST_KEY = "WAP_CITY_LIST_KEY";
const WAP_CITY_TIMESTAMP_KEY = "WAP_CITY_TIMESTAMP_KEY";
const WAP_CURRENT_CITY_KEY = "WAP_CURRENT_CITY_KEY";
export const getCityListByStorage = () => {
  return getStorage(WAP_CITY_LIST_KEY);
};

export const setCityListByStorage = (cityList) => {
  setStorage(WAP_CITY_LIST_KEY, cityList);
};

export const getCityTimestampByStorage = () => {
  return getStorage(WAP_CITY_TIMESTAMP_KEY);
};

export const setCityTimestampByStorage = (timestamp) => {
  setStorage(WAP_CITY_TIMESTAMP_KEY, timestamp);
};

export const getCityTimestampBySessionStorage = () => {
  return getSession(WAP_CITY_TIMESTAMP_KEY);
};

export const setCityTimestampBySessionStorage = (timestamp) => {
  setSession(WAP_CITY_TIMESTAMP_KEY, timestamp);
};

export const setSessionCurrentCity = (currentCity) => {
  setSession(WAP_CURRENT_CITY_KEY, currentCity);
};
export const getSessionCurrentCity = () => {
  return getSession(WAP_CURRENT_CITY_KEY);
};
export const removeSessionCurrentCity = () => {
  return removeSession(WAP_CURRENT_CITY_KEY);
};

// 获得随机数
export const getRandom = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 随机排序函数
export const randomSort = (): number => {
  return Math.random() > 0.5 ? -1 : 1;
};
/* export const stopPropagation = e => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}  */
/**
 * 隐藏电话号码中间四位
 * @param tel 原始电话号码 例如 13188881234
 * @returns {string} 返回隐藏后的电话号码，例如 131****1234
 */
export const hiddenTelphone = (tel: string | number): string => {
  const reg = /^(\d{3})(\d{4})(\d*)$/;

  return String(tel).replace(reg, "$1****$3");
};

/**
 * 是否是快速点击
 */
let clickNow = 0;
export const isFastClick = () => {
  let rs = false;
  if (clickNow && Date.now() - 800 < clickNow) {
    rs = true;
  } else {
    clickNow = Date.now();
  }

  return rs;
};
