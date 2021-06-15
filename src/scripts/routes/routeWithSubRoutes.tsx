import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithSubRoutes = route => (
  <Route
    exact={!!route.exact}
    path={route.path}
    render={props => <route.component {...props} routes={route.routes} />}
  />
);
export default RouteWithSubRoutes;

/* const RouteWithSubRoutes = route => (
  <Authorized
    authority={route.authority}
    noMatch={
      <Route render={() => <Redirect to={{ pathname: route.redirectPath }} />} />
    }
  >
    <Route
      exact={!!route.exact}
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  </Authorized>
); */
