import React from 'react';
import { Button } from 'antd-mobile';
import { hot } from 'react-hot-loader/root';
import history from '../../history';

import './index.less';

const goToDetail = (): void => history.push('/home/detail');
const Home = () => (
  <div className="detail-bg">
    <h1>首页</h1>
    <Button type="primary" inline onClick={goToDetail}>
      详情页面
    </Button>
  </div>
);

export default hot(Home);
