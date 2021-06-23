// const UC = /(?:UCWEB|UCBrowser\/)([\d\.]+)/;
const QQ = /MQQBrowser\/([\d.]+)/;
const FIREFOX = /(?:Firefox|FxiOS)\/([\d.]+)/;
const IOS_WEBVIEW = /OS ([\d_.]+) like Mac OS X/;
// const WINDOWS_PHONE = /Windows\sPhone\s(?:OS\s)?([\d\.]+)/;
const CHROME_WEBVIEW = /Version\/[\d+.]+\s*Chrome/;
const MSIE = /MSIE\s([\d\.]+)/;
const IE_MOBILE = /IEMobile\/([\d.]+)/;

interface Browser {
  name: string;
  isWindowsPhone?: boolean;
  isQQ?: boolean;
  isFirefox?: boolean;
  isIEMobile?: boolean;
  isIE?: boolean;
  isIELikeWebkit?: boolean;
  isWebview?: boolean;
  isSafari?: boolean;
  isAndroid?: boolean;
  isChrome?: boolean;
  version: string;
}
interface AppInfo {
  appname: string;
  isWeixin?: boolean;
  isWeibo?: boolean;
  isMario?: boolean;
  isMarioInc?: boolean;
  platform?: string;
  version?: string;
  apiNumber?: string;
}

interface OSInfo {
  name: string;
  isWindowsPhone?: boolean;
  isIPhone?: boolean;
  isIPad?: boolean;
  isIOS?: boolean;
  isAndroid?: boolean;
  isAndroidPad?: boolean;
  version: string;
}

export default {
  /**
   * 获得当前系统信息
   */
  getOSInfo: (): OSInfo => {
    const ua = navigator.userAgent;
    let matchs;
    if ((matchs = ua.match(/Windows\sPhone\s(?:OS\s)?([\d\.]+)/))) {
      return {
        name: "Windows Phone",
        isWindowsPhone: true,
        version: matchs[1],
      };
    }
    if (ua.match(/Safari/) && (matchs = ua.match(/Android[\s\/]([\d\.]+)/))) {
      if (ua.match(/Mobile\s+Safari/)) {
        return {
          name: "Android",
          isAndroid: true,
          version: matchs[1],
        };
      }
      return {
        name: "AndroidPad",
        isAndroidPad: true,
        version: matchs[1],
      };
    } else if ((matchs = ua.match(/(iPhone|iPad|iPod)/))) {
      var name = matchs[1];
      if ((matchs = ua.match(/OS ([\d_\.]+) like Mac OS X/))) {
        return {
          name: name,
          isIPhone: "iPhone" === name || "iPod" === name,
          isIPad: "iPad" === name,
          isIOS: true,
          version: matchs[1].split("_").join("."),
        };
      }
    }

    return {
      name: "unknown",
      version: "0.0.0",
    };
  },
  /**
   * 获得app 环境信息
   */
  getAppInfo: (): AppInfo => {
    const ua = navigator.userAgent;
    let matchs;
    if (
      (matchs = ua.match(
        /Mario(?:INC)?HybridWebView-(\w+)-(\d+)(-([\d\.]+))?/i
      ))
    ) {
      return {
        appname: "Mario",
        isMario: true,
        isMarioInc: /MARIOINCHybridWebView/i.test(ua),
        platform: matchs[1],
        apiNumber: matchs[2],
        version: matchs[4],
      };
    } else if (ua.match(/MicroMessenger/i)) {
      return {
        appname: "Weixin",
        isWeixin: true,
      };
    } else if (ua.match(/Weibo/i)) {
      return {
        appname: "Weibo",
        isWeibo: true,
      };
    } else {
      return {
        appname: "unknown",
      };
    }
  },
  /**
   * 获得浏览器环境信息
   */
  getBrowserInfo: (): Browser => {
    const ua = navigator.userAgent;
    let matchs;
    if ((matchs = ua.match(QQ))) {
      return {
        name: "QQ",
        isQQ: true,
        version: matchs[1],
      };
    } else if ((matchs = ua.match(FIREFOX))) {
      return {
        name: "Firefox",
        isFirefox: true,
        version: matchs[1],
      };
    } else if ((matchs = ua.match(MSIE)) && (matchs = ua.match(IE_MOBILE))) {
      if (ua.match(/IEMobile/)) {
        return {
          name: "IEMobile",
          isIEMobile: true,
          version: matchs[1],
        };
      } else {
        if (ua.match(/Android|iPhone/)) {
          return {
            name: "IE",
            isIELikeWebkit: true,
            version: matchs[1],
          };
        } else {
          return {
            name: "IE",
            isIE: true,
            version: matchs[1],
          };
        }
      }
    } else if ((matchs = ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/))) {
      if (ua.match(CHROME_WEBVIEW)) {
        return {
          name: "Chrome Webview",
          isWebview: true,
          version: matchs[1],
        };
      } else {
        return {
          name: "Chrome",
          isChrome: true,
          version: matchs[1],
        };
      }
    } else if (
      ua.match(/Safari/) &&
      (matchs = ua.match(/Android[\s\/]([\d\.]+)/))
    ) {
      return {
        name: "Android",
        isAndroid: true,
        version: matchs[1],
      };
    } else if (
      ua.match(/iPhone|iPad|iPod/) &&
      ua.match(/Safari/) &&
      (matchs = ua.match(/Version\/([\d\.]+)/))
    ) {
      return {
        name: "Safari",
        isSafari: true,
        version: matchs[1],
      };
    } else if ((matchs = ua.match(IOS_WEBVIEW))) {
      return {
        name: "iOS Webview",
        isWebview: true,
        version: matchs.replace(/\_/g, "."),
      };
    }
    return {
      name: "unknown",
      version: "0.0.0",
    };
  },
};
