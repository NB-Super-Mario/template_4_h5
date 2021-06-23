import Loadable from 'react-loadable';

import Loading, { LoadingType } from '@components/loading/index';

export const LoadingComponent = () => (
  <Loading type={LoadingType.BG_TYPE} visable fixed />
);

const LoadableComponent = (
  loader: any,
  opts?: any
  // | Loadable.OptionsWithoutRender<unknown>
  // | Loadable.OptionsWithRender<unknown, object>
  // | undefined
) => () =>
  Loadable({
    loader,
    delay: 200,
    timeout: 10000,
    loading: LoadingComponent,
    ...opts,
  });
export default LoadableComponent;

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
