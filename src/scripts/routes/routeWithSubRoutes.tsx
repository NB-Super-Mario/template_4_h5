import { Route } from 'react-router-dom';

export default function RouteWithSubRoutes(route: any) {
  return (
    <Route
      exact={!!route.exact}
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  );
}

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
