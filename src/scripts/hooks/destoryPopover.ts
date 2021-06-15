import { useState, useEffect, useCallback } from 'react';

const destoryPopover = () => {
  // 用于销毁popover残留的dom
  useEffect(() => {
    return () => {
      $('.am-popover-mask')
        .parent()
        .parent()
        .remove();
      console.info('隐藏mask dom已经删除');
    };
  }, []);
};
export default destoryPopover;
