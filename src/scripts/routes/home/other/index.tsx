import React from 'react';
import { hot } from 'react-hot-loader/root';
import history from '../../history';
import './index.less';

const goBack = () => {
  history.goBack();
};

const Other = () => (
  <div className="reward-bg">
    <h1>其他</h1>
    <button className="go-back-btn" onClick={goBack} type="button">
      返回首页
    </button>
  </div>
);

export default hot(Other);
