import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import RouteWithSubRoutes from '@routes/routeWithSubRoutes';
import Home from '@routes/home/index/home';

import LoadableComponent from '@routes/loadable-component';

// 顶级路由配置
const routes = [
  {
    exact: true, // 是否是默认
    path: '/',
    component: () => <Home />,
  },
  {
    path: '/home',
    component: LoadableComponent(() => import('./home/index'))(),
  },
];

const BaseRouter = () => {
  return (
    <div className="main">
      <BrowserRouter>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
};

/**
 * 根据json 动态配置路由
 * @param {*} route
 */

export default BaseRouter;
