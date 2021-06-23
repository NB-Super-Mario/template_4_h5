import { useState } from 'react';

import './index.less';
// 箭头函数 状态保持不住
// https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/365
function CustomComponents() {
  const [count, setCount] = useState(1);

  return (
    <>
      <h3>{count}</h3>
      <button onClick={() => setCount(3)} type="button">
        count
      </button>
    </>
  );
}

export default CustomComponents;
