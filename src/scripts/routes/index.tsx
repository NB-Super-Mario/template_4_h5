import { Switch, BrowserRouter, Redirect } from 'react-router-dom';
import RouteWithSubRoutes from '@routes/routeWithSubRoutes';

import LoadableComponent from '@routes/loadable-component';

// 顶级路由配置
const routes = [
  {
    exact: true, // 是否是默认
    path: '/',
    component: () => <Redirect to="/home" />,
  },
  {
    path: '/home',
    component: LoadableComponent(() => import('./home/index'))(),
  },
];

export default function BaseRouter() {
  return (
    <div className="main">
      <BrowserRouter basename="/">
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

/**
 * 根据json 动态配置路由
 * @param {*} route
 */
