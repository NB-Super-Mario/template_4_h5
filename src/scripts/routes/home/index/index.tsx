import { BrowserRouter, Switch } from 'react-router-dom';

import RouteWithSubRoutes from '@routes/routeWithSubRoutes';

import LoadableComponent from '@routes/loadable-component';

import './index.less';

const routes = [
  {
    exact: true, // 是否是默认
    path: '/',
    component: LoadableComponent(() => import('@routes/home/index/home'))(),
  },
  {
    path: '/detail',
    component: LoadableComponent(() => import('@routes/home/detail'))(),
  },
  {
    path: '/other',
    component: LoadableComponent(() => import('@routes/home/other'))(),
  },
];

const Index = () => (
  <div className="main-content">
    <BrowserRouter basename="/home">
      <Switch>
        {routes.map((route, i) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  </div>
);
export default Index;
