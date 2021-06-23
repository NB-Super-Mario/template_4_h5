import { useHistory } from 'react-router-dom';

import './index.less';

const Detail = () => {
  const history = useHistory();
  return (
    <div className="reward-bg">
      <h1>详情</h1>
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

export default Detail;
