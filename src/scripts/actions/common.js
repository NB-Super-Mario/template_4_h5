import { CommonActionType } from '../constants';

export const showLoading = () => ({
  type: CommonActionType.G_SHOW_LOADING
});

export const hideLoading = () => ({
  type: CommonActionType.G_HIDE_LOADING
});

export default {
  showLoading
};
