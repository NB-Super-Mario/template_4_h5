import './index.less';
// import moment from 'moment';

import {
  getUrlParam,
  FromOrigin,
  setFromOrigin,
  getFromOrigin
} from '@util/index';

const Common = (): void => {
  const originParam =
    getUrlParam('origin') || getFromOrigin() || FromOrigin.c2c;
  const origin =
    originParam === FromOrigin.c2c ? FromOrigin.c2c : FromOrigin.driver;
  const originClass = originParam === FromOrigin.c2c ? 'c2c' : 'driver';
  setFromOrigin(origin);

  $('body')
    .addClass('app')
    .addClass(originClass);

  // const calcTime = moment('20190102').format('YYYY年M月D日');
  // console.log(`----${calcTime}`);
};
export default Common;
