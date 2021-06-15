import React, { ReactNode } from 'react';

import { Route, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import RouteWithSubRoutes from '../../routeWithSubRoutes';

import { fetchFoo } from '@actions/foo';
import Home from './home';
import { LoadableComponent } from '../../loadable-component';

import './index.less';

const routes = [
  {
    path: '/home/detail', // 年度荣誉
    component: LoadableComponent(() => import('../detail'))()
  },
  {
    path: '/home/other', // 年度荣誉
    component: LoadableComponent(() => import('../other'))()
  }
];

const Index = (props: any) => (
  <div className="main-content">
    {routes.map((route, i) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <RouteWithSubRoutes key={i} {...route} />
    ))}
    <Route exact path={props.match.url} render={(): ReactNode => <Home />} />
  </div>
);

function mapStateToProps(state: any) {
  return {
    foo: state.foo
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchFoo
    }
  )(Index)
);
