import HttpUtil from '@util/http';
import { AxiosPromise } from 'axios';

const FOO_DATA_URI = `${DOMAIN}static-mock/mock.json`;

export const getFoo = (): AxiosPromise =>
  HttpUtil.getData({
    url: FOO_DATA_URI
  });
