import React from 'react';
import { Button } from 'antd-mobile';
import './index.less';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();
  return (
    <div className="detail-bg">
      <h1>首页</h1>
      <Button
        type="primary"
        inline
        onClick={() => history.push('/home/detail')}
      >
        详情页面
      </Button>
      <Button type="primary" inline onClick={() => history.push('/home/other')}>
        其他页面
      </Button>
    </div>
  );
};

export default Home;
