import ActionTypes from '../constants';

const initialState = {
  name: 'liying~~',
  email: 'ly.boy2012@gmail.com'
};

const foo = (state = initialState, action: any) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_FOO:
      return { ...state, ...action.foo };
    default:
      return state;
  }
};
export default foo;
