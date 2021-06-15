import React, { Component } from 'react';
import NotFound from '@components/not-found';
import classNames from 'classnames';
import { EventInjector } from 'react-event-injector';
import './index.less';

const EventInjectorWrapper = props => (
  <EventInjector
    settings={{ passive: false }}
    onTouchMove={e => e.preventDefault()}
    onWheel={e => e.preventDefault()}
  >
    {props.children}
  </EventInjector>
);

/**
 * 通用组
 * @param {*} props
 */
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visable: this.props.visable
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visable !== this.props.visable) {
      this.setState({
        visable: nextProps.visable
      });
    }
  }

  render() {
    const { type = Loading.NORMAL_TYPE, fixed } = this.props;
    const loadingClass = classNames('loading', type);
    let info = '';
    let style = {};
    let clazz = 'loading-main';
    if (type === Loading.VERTICAL_TYPE) {
      info = '加载中';
    } else if (type === Loading.HORIZONTAL_TYPE) {
      info = '加载中....';
      clazz = classNames('dib', clazz);
    } else if (type === Loading.BG_TYPE) {
      info = '加载中...';
      style = fixed ? { position: 'fixed' } : {};
    }

    return this.state.visable ? (
      <div className={clazz}>
        {type === Loading.BG_TYPE ? (
          <EventInjectorWrapper>
            <div className="loading-mask" style={style} />
          </EventInjectorWrapper>
        ) : null}
        <EventInjectorWrapper>
          <div className={loadingClass} style={style}>
            {type === Loading.BG_TYPE ? (
              <div className="loading-car" />
            ) : (
              <div className="loading-icon">
                <div className="loader" />
              </div>
            )}
            {type === Loading.VERTICAL_TYPE ||
            type === Loading.BG_TYPE ||
            type === Loading.HORIZONTAL_TYPE ? (
              <div className="text-info">{info}</div>
            ) : null}
          </div>
        </EventInjectorWrapper>
      </div>
    ) : null;
  }
}
Loading.defaultProps = {
  visable: false,
  type: 'normal_type', // 1 含透明背景 2
  fixed: false
};
Loading.BG_TYPE = 'bg-type';
Loading.HORIZONTAL_TYPE = 'horizontal-type';
Loading.VERTICAL_TYPE = 'vertical_type';
Loading.NORMAL_TYPE = 'normal_type';
export default Loading;
