import classNames from 'classnames';

import './index.less';

export enum LoadingType {
  BG_TYPE = 'bg-type',
  HORIZONTAL_TYPE = 'horizontal-type',
  VERTICAL_TYPE = 'vertical_type',
  NORMAL_TYPE = 'normal_type',
}

/**
 * 通用组 loading
 * @param {*} props
 */

const Loading: React.FC<{
  visable: boolean;
  type?: LoadingType;
  fixed: boolean;
}> = ({ visable, type = LoadingType.NORMAL_TYPE, fixed }) => {
  const loadingClass = classNames('loading', type);
  let info = '';
  let style = {};
  if (type === LoadingType.VERTICAL_TYPE) {
    info = '加载中';
  } else if (type === LoadingType.HORIZONTAL_TYPE) {
    info = '加载中....';
  } else if (type === LoadingType.BG_TYPE) {
    info = '正在加载';
    style = fixed ? { position: 'fixed' } : {};
  }

  return (
    <>
      {visable && (
        <div className="loading-main">
          {type === LoadingType.BG_TYPE ? (
            <div className="loading-mask" style={style} />
          ) : null}
          <div className={loadingClass} style={style}>
            <div className="loading-icon">
              <div className="loader" />
            </div>
            {type === LoadingType.VERTICAL_TYPE ||
            type === LoadingType.BG_TYPE ||
            type === LoadingType.HORIZONTAL_TYPE ? (
              <div className="text-info">{info}</div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
