import { useState } from 'react';
import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import './index.less';
import CustomComponents from '@components/custom-components';

function Home() {
  const history = useHistory();
  const [test, setTest] = useState(1);
  return (
    <div className="detail-bg">
      <h1>首页{test}</h1>
      <Button type="primary" inline onClick={() => history.push('/detail')}>
        详情页面
      </Button>
      <Button type="primary" inline onClick={() => history.push('/other')}>
        其他页面
      </Button>
      <Button type="primary" inline onClick={() => setTest(3)}>
        test btn
      </Button>
      <span className="m-top" />
      <CustomComponents />
    </div>
  );
}

export default Home;
