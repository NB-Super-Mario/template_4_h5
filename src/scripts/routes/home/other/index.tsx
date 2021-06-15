import React from 'react';

import './index.less';
import { useHistory } from 'react-router-dom';

const Other = () => {
  const history = useHistory();
  return (
    <div className="reward-bg">
      <h1>其他</h1>
      <button
        className="go-back-btn"
        onClick={() => history.goBack()}
        type="button"
      >
        返回首页
      </button>
    </div>
  );
};

export default Other;
