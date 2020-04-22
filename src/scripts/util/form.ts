import { Toast } from 'antd-mobile';
import EmojiRegExp from 'emoji-regex';
import { popView } from './custom-jsbridge';
import { alert as cAlert, confirm as cConfirm } from '@components/custom-modal';
/**
 * 表单验证，toast提示错误
 * @param form
 * @param showToast
 */
export const submitPreChecker = (form, showToast = true) =>
  new Promise((resolve, reject) => {
    if (form && 'function' === typeof form.validateFields) {
      form.validateFields((errors, value) => {
        if (errors) {
          const keys = Object.keys(errors);
          const msg = errors[keys[0]].errors[0].message;
          if (showToast) Toast.info(msg, Toast.SHORT);
          reject(new Error(msg));
        } else {
          resolve(value);
        }
      });
    } else {
      reject(new Error('from is not instanceof rc-form'));
    }
  });

export const confirm = (message, okStr = '确认提交', cancelStr = '取消') =>
  new Promise((resolve, reject) => {
    cConfirm(message, okStr, cancelStr).then(ok => {
      if (ok) {
        resolve();
      } else {
        reject();
      }
    });
  });

export const alert = (message, btnStr = '好的，知道了') => {
  cAlert(message, btnStr);
};

export const alertForSubmitSuccess = (
  formName,
  btnStr = '确定',
  type = 'A'
) => {
  const textEnum = {
    A: `您的【${formName}】已经提交成功，会尽快处理，您可在"订单详情-我的反馈"中查看处理结果。`,
    B: `您的【${formName}】已经提交成功，会3个工作日内回复，您可在"联系客服-我的反馈"中查看处理结果。`
  };

  cAlert(textEnum[type.toUpperCase()], btnStr).then(() => {
    popView();
  });
};

/**
 * 格式化输入的数字字符串
 * @param val
 * @param form this.props.form
 * @param key 字段名
 * @param limit 小数点后保留几位
 */
export const formatInput = (val, form, key, limit) => {
  if (!form || !form.setFieldsValue) return;
  const reg = new RegExp(
    `^[1-9]\\d{0,3}\\.\\d{0,${limit}}$|^[1-9]\\d{0,3}$|^10000$|^0$|^0\\.\\d{0,${limit -
      1}}[1-9]?$`
  );
  if (!reg.test(val)) {
    form.setFieldsValue({
      [key]: val.substr(0, val.length - 1)
    });
  } else {
    form.setFieldsValue({
      [key]: val
    });
  }
};
/**
 * 格式化输入的整数字符串
 * @param val
 * @param form this.props.form
 * @param key 字段名
 * @param limit 最大值后面几个零
 */
export const formatIntInput = (val, form, key, limit) => {
  const count = limit - 1;
  if (!form || !form.setFieldsValue) return;
  const reg = new RegExp(`^[1-9]\\d{0,${count}}$|^10{${limit},${limit}}$|^0$`);
  if (!reg.test(val)) {
    form.setFieldsValue({
      [key]: val.substr(0, val.length - 1)
    });
  } else {
    form.setFieldsValue({
      [key]: val
    });
  }
};
/**
 * 过滤emoji表情符
 * @param val
 * @param form
 * @param key
 */
export const filterEmoji = (val, form, key) => {
  const reg = EmojiRegExp();
  form.setFieldsValue({
    [key]: val.replace(reg, '')
  });
};
export const formatInputToLetterOrNumber = (val, form, key, limit) => {
  const str = val.replace(/[^a-zA-z0-9]/g, '').toUpperCase();
  form.setFieldsValue({
    [key]: limit ? str.substr(0, limit) : str
  });
};

export function inputScrollIntoView() {
  const zEl = $('textarea');
  const el = zEl && zEl[0] ? zEl[0] : null;
  if (!el || !el.scrollIntoView) return;
  setTimeout(() => {
    el.scrollIntoView(false);
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded();
    setTimeout(() => {
      el.scrollIntoView(false);
      if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded();
    }, 800);
  }, 800);
}

export function inputScrollIntoViewByName(name) {
  const zEl = $(`[name=${name}]`);
  const el = zEl && zEl[0] ? zEl[0] : null;
  if (!el || !el.scrollIntoView) return;
  setTimeout(() => {
    el.scrollIntoView(false);
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded();
  }, 800);
}

export default {
  submitPreChecker,
  confirm,
  alert,
  alertForSubmitSuccess,
  formatInput,
  inputScrollIntoView
};
