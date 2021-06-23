import { CommonActionType } from '../constants';

const initState = {
  loading: false
};

export default (state = initState, action: { type: any }) => {
  switch (action.type) {
    case CommonActionType.G_SHOW_LOADING:
      return { ...state, loading: true };
    case CommonActionType.G_HIDE_LOADING:
      return { ...state, loading: false };
    default:
  }
  return state;
};
