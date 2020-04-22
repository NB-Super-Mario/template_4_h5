import React from 'react';
import { hot } from 'react-hot-loader/root';
import history from '../../history';
import './index.less';

const goBack = (): void => history.goBack();

const Detail = () => (
  <div className="reward-bg">
    <h1>其他</h1>
    <button className="go-back-btn" onClick={goBack} type="button">
      返回首页
    </button>
  </div>
);

export default hot(Detail);
