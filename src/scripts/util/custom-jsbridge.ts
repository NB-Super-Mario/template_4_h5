import Evn from "./env";
import JSBridge from "./jsbridge";
import getStore from "./../store";
import {
  showLoading as showCommonLoading,
  hideLoading as hideCommonLoading,
} from "@actions/common";
import { isFastClick } from ".";

interface IJSBOptions {
  showLoading?: boolean;
}

/**
 * jsbridge调用
 */
export const call = (
  serviceName,
  params = {},
  options?: IJSBOptions
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isMario) {
      const showLoading = options ? options.showLoading : true;
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

      JSBridge.jsCallNative({
        protocol: serviceName,
        parameters: params,
        callBack: (data) => {
          try {
            data = JSBridge.handleData(data);
            if (data.status.success) {
              resolve(data);
            } else {
              reject(data);
            }
          } catch (error) {
            // 处理错误
          } finally {
            hideLoading();
          }
        },
      });
    } else {
      reject(true);
    }
  });
};

/**
 * 注册监听handler
 */
export const callbackHandler = (protocol: string, cb: Function) => {
  if (Evn.getAppInfo().isMario) {
    JSBridge.registerHandler({
      protocol,
      callBack: (parameters) => {
        cb(parameters);
      },
    });
  }
};

/**
 * receiveTransfer 接收 native
 * @param cb
 */
export const receiveTransferCallBack = (cb: Function) => {
  callbackHandler("receiveTransfer", cb);
};

/**
 * http调用
 */
export const http = ({ path, params }) => {
  return call("http", params);
};

/**
 * 获取经纬度
 */
export const location = () => {
  return call("location");
};

/**
 * transfer 传输数据
 * @param url
 * @param isCurrent  //是否只是当webview刷新 默认false
 * @param parameters
 */
export const transfer = (
  url: string,
  needGoBack?: boolean,
  isCurrent?: boolean,
  hasInfoBar?: boolean,
  parameters?: object
) => {
  if (isFastClick()) {
    return Promise.resolve();
  }
  return call("transfer", {
    url,
    needGoBack: !!needGoBack,
    isCurrent: !!isCurrent,
    hasInfoBar: !!hasInfoBar,
    parameters,
  });
};

/**
 *  退出webview
 * true 退出成功
 * false 退出失败
 */
export const popView = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isMario) {
      JSBridge.jsCallNative({
        protocol: "popView",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(true);
    }
  });
};

/**
 *  获得当前登录用户的uid ，获得不到返回空字符串
 */
export const getUid = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "getUid",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.Uid);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

export enum UploadFileType {
  giveBack = 45, // 在线处理系统物品归还图片
  report = 46, // 在线处理系统订单报备图片
  feedback = 47, // 在线处理系统我的反馈图片
}
/**
 *  上传图片（单张）
 *  入参 图片大小限制
 *  返回上传图片的ftp url
 * 上传失败返回空字符串
 */
export const uploadPic = (
  maxSize: number = 1024 * 5,
  uploadFileType: UploadFileType,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "uploadPic",
        parameters: {
          maxSize,
          uploadFileType,
          width,
          height,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.url);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};
/**
 *  选择订单
 *  返回选择的订单id
 *  无内容回空字符串
 */
export const selectOrder = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "selectOrder",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * 获得司机id
 * 无内容回空字符串
 */
export const getDriverId = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "getDriverId",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.driverId);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};
/**
 * 获得司机服务城市id
 * 无内容回空字符串
 */
export const getCityId = (): Promise<{ cityId: string }> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "getCityId",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * 获取加密字符串
 * 无内容回空字符串
 */
export const getKeys = (keys: any[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "getKeys",
        parameters: {
          keys,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.key);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * 登录
 * 登录调用到 true
 * 调用失败 false
 */
export const login = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "login",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(false);
    }
  });
};

/**
 * 确实支付密码
 * 确实 true
 * 失败 false
 */
export const confirmPayPassword = (mobile: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "confirmPayPassword",
        parameters: {
          mobile,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(false);
    }
  });
};

/**
 * 选择时间
 * 返回时间字符串  2018-12-19 2018-12
 * 失败 返回空字符串
 */
export const selectDate = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "selectDate",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.date);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * 仅iOS 下刷新UI 解决iOS 不重新渲染问题
 */
export const updateUI = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario && Evn.getOSInfo().isIOS) {
      JSBridge.jsCallNative({
        protocol: "updateUI",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      resolve(true);
    }
  });
};

export enum ShareTye {
  none = 0, // 未知渠道
  ShareTimeline = 1, // 微信好友
  AppMessage = 2, // 微信朋友圈
  QQ = 3,
  qqZone = 4,
  weibo = 5,
  message = 6,
}

export interface IShareConf {
  title: string;
  content: string;
  url: string;
  imgUrl: string;
  shareType: number;
}
/**
 * 仅iOS 下刷新UI 解决iOS 不重新渲染问题
 */
export const newShare = (conf: IShareConf): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "newShare",
        parameters: conf,
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(false);
    }
  });
};

/**
 * 选择通讯录手机号
 */
export const showAddressBook = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "showAddressBook",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.phoneNumber);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * 图片展示
 */
export const gallery = (
  images: string[],
  current: number = 0
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "gallery",
        parameters: {
          images,
          current: `${current}`,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(true);
    }
  });
};
/**
 * 刷新webview
 */
export const reload = () => {
  if (Evn.getAppInfo().isisMario) {
    JSBridge.registerHandler({
      protocol: "reload",
      callBack: (parameters) => {
        return JSBridge.succData(parameters);
      },
    });
  }
};

export interface IServiceCity {
  /**
   * @description 服务城市ID
   * @type {string}
   * @memberof IServiceCity
   */
  cityId: string;
  /**
   * @description 服务城市名称
   * @type {string}
   * @memberof IServiceCity
   */
  cityName: string;
}

/**
 * @description 获取司机当前服务城市信息
 * @returns {Promise<IServiceCity>}
 */
export const getServiceCity = (): Promise<IServiceCity> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "getCityId",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

export interface IShareConfig {
  /**
   * @description 标题
   * @type {string}
   * @memberof IShareConfig
   */
  title: string;
  /**
   * @description 摘要
   * @type {string}
   * @memberof IShareConfig
   */
  content: string;
  /**
   * @description 网页URL地址
   * @type {string}
   * @memberof IShareConfig
   */
  url: string;
  /**
   * @description 网页缩略图链接
   * @type {string}
   * @memberof IShareConfig
   */
  imgUrl: string;
  /**
   * @description 分享渠道：1: 微信好友; 2: 微信朋友圈; 3: QQ好友; 4: QQ空间; 5: 新浪微博; 6: 短信
   * @type {(1 | 2 | 3 | 4 | 5 | 6)}
   * @memberof IShareConfig
   */
  shareType: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * @description 调用SNS分享
 * @param {IShareConfig} conf
 * @returns {Promise<boolean>}
 */
export const shareSNS = (conf: IShareConfig): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "share",
        parameters: conf,
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(false);
    }
  });
};

/**
 * @description 通过URL地址生成对应的二维码图片
 * @param {string} url 网页地址
 * @returns {Promise<string>}
 */
export const createQrCode = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "createQrCode",
        parameters: {
          url,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.base64Str);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * @description 唤起城市选择控件
 * @returns {(Promise<IServiceCity | null>)}
 */
export const selectCity = (): Promise<IServiceCity | null> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "selectCity",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data);
          } else {
            reject(null);
          }
        },
      });
    } else {
      reject(null);
    }
  });
};
/**
 * @description 查看推荐历史页面
 * @returns {Promise<boolean>}
 */
export const goRecommandHistory = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "myRecommand",
        parameters: {},
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            reject(false);
          }
        },
      });
    } else {
      reject(false);
    }
  });
};

/**
 * @description 打开相册
 * @param {number} maxSize 最大可选取照片数量
 * @param {object} [uploadParams={}] 上传图片额外参数对象
 * @param {boolean} [upload=false] 是否需要通过jsbridge上传图片
 * @returns {Promise<{url: string, base64Str: string}[]>} 图片对象数组
 */
export const openAlbum = (
  maxSize: number,
  uploadParams: object = {},
  upload: boolean = false
): Promise<{ url: string; base64Str: string }[] | string[]> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "album",
        parameters: {
          maxSize,
          uploadParams,
          upload,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data.list);
          } else {
            reject([]);
          }
        },
      });
    } else {
      reject([]);
    }
  });
};

/**
 * @description 打开相机
 * @param {object} [uploadParams={}] 上传图片额外参数对象
 * @param {boolean} [upload=false] 是否需要通过jsbridge上传图片
 * @returns {Promise<{url: string, base64Str: string}>} 图片对象
 */
export const openCamera = (
  uploadParams: object = {},
  upload: boolean = false
): Promise<{ url: string; base64Str: string }> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "camera",
        parameters: {
          uploadParams,
          upload,
        },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(data.data);
          } else {
            reject("");
          }
        },
      });
    } else {
      reject("");
    }
  });
};

/**
 * appTrack
 * @description 埋点上报
 * @param {string} eventCode
 * @param {object} remark
 * @returns {Promise<boolean>}
 */
export const appTrack = (
  eventCode: string,
  remark?: object
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "track",
        parameters: { event_code: eventCode, remark },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      });
    } else {
      resolve(false);
    }
  });
};

/**
 * openBrowser
 * @description 使用原生浏览器打开链接
 * @param {string} url
 * @returns {Promise<boolean>}
 */
export const openBrowser = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Evn.getAppInfo().isisMario) {
      JSBridge.jsCallNative({
        protocol: "openBrowser",
        parameters: { url },
        callBack: (data) => {
          data = JSBridge.handleData(data);
          if (data.status.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      });
    } else {
      resolve(false);
    }
  });
};

// 积分商城-验证钱包密码
export const checkPayPwd = (operateType: number, scb: Function) => {
  JSBridge.jsCallNative({
    protocol: "newConfirmPayPassword",
    parameters: {
      operateType, // 当前操作类型:0 兑换，1 查看卡
    },
    callBack: (data) => {
      data = JSBridge.handleData(data);
      if (data.status.success) {
        scb(data.data.code);
      }
    },
  });
};

// 积分商城-复制
export const copyContent = (content: string, scb?: Function) => {
  JSBridge.jsCallNative({
    protocol: "clipboard",
    parameters: {
      content, // 目前卡号券码、卡号密码 两个copy 功能
    },
    callBack: (data) => {
      data = JSBridge.handleData(data);
      if (data.status.success) {
        scb();
      }
    },
  });
};
