declare global {
  interface Window {
    CustomEvent: any;
    Event: any;
  }
}

export interface CallNative {
  protocol: string; // 协议
  parameters?: any; // 参数
  callBack(res: any); // 回调
}
(function() {
  try {
    // a : While a window.CustomEvent object exists, it cannot be called as a constructor.
    // b : There is no window.CustomEvent object
    new window.CustomEvent('T');
  } catch (e) {
    const CustomEvent = function(event: any, params: any) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      const evt = document.createEvent('CustomEvent');

      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );

      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }
})();
const handles = {};
const handleCallBack = params => {
  const handle = function(e: CustomEvent) {
    const responseData = params.callBack(e.detail.parameters);
    e.detail.callBack(responseData);
  };
  handles[params.protocol] = handle;
  return handle;
};
export const registerHandler = (params: CallNative) => {
  try {
    // 添加off 保证同一事件绑定不重复

    if (handles[params.protocol]) {
      document.removeEventListener(params.protocol, handles[params.protocol]);
      delete handles[params.protocol];
    }

    document.addEventListener(params.protocol, handleCallBack(params));
  } catch (error) {
    console.log(`error:registerHandler ${error}`);
  }
};
export const triggerHandler = (params: CallNative) => {
  const event = new window.CustomEvent(params.protocol, { detail: params });
  document.dispatchEvent(event);
};
