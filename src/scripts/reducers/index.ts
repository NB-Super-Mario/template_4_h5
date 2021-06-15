import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';

import common from './common';
import foo from './foo';

export default (history: History) =>
  combineReducers({
    common,
    foo,
    router: connectRouter(history)
    // 会把new 作为 state 一个属性赋值
  });
