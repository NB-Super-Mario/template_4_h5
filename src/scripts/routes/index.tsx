import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import RouteWithSubRoutes from './routeWithSubRoutes';
import Loading from '@components/loading';
import { connect } from 'react-redux';

import { LoadableComponent } from './loadable-component';

// 顶级路由配置
const routes = [
  {
    exact: true, // 是否是默认
    path: '/',
    // component: LoadableComponent('./coupon/index/index')(),
    component: () => <Redirect to="/home" />
  },
  {
    path: '/home',
    component: LoadableComponent(() => import('./home/index/index'))()
    // component: AsyncHome
  }
];

const BaseRouter = () => {
  return (
    <div className="main">
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
      <CommonLoading />
    </div>
  );
};

const CommonLoading = connect(state => {
  return state.common;
})(props => {
  return <Loading visable={props.loading} fixed type={Loading.BG_TYPE} />;
});

/**
 * 根据json 动态配置路由
 * @param {*} route
 */

export default BaseRouter;
