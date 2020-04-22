import React from 'react';
import Loadable from 'react-loadable';

import Loading from '@components/loading';

const LoadingComponent = () => <Loading type={Loading.BG_TYPE} visable fixed />;

export const LoadableComponent = (
  loader: any,
  opts?:
    | Loadable.OptionsWithoutRender<unknown>
    | Loadable.OptionsWithRender<unknown, object>
    | undefined
) => () =>
  Loadable({
    loader,
    delay: 200,
    timeout: 10000,
    loading: LoadingComponent,
    ...opts
  });

/* 
使用实例
import LoadableComponent from './loadable-component';

const LoadableMyComponent = LoadableComponent({
  loader: () => import('./MyComponent'),
});

export defauwlt class App extends React.Component {
  render() {
    return <LoadableMyComponent/>;
  }
} 
*/
