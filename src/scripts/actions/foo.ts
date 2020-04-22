import ActionTypes from '../constants';
import { Dispatch } from 'redux';

import { getFoo } from '@api/foo';

export const receiveFoo = (foo: any) => ({
  type: ActionTypes.RECEIVE_FOO,
  foo
});
export const fetchFoo = () => async (dispatch: Dispatch): Promise<void> => {
  const result = await getFoo();
  dispatch(receiveFoo(result.data));
};
