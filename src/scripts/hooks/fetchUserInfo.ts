import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeInfo } from '@api/meeting';
import { getUserInfo } from '@util/custom-jsbridge';
import { setCurrentUser } from '@actions/currentUser';

import { log } from '@util/ucar-track';

const useFetchUserInfo = () => {
  const currentUser = useSelector((state: any) => state.currentUser);
  const [isFetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  const getUser = useCallback(() => {
    (async () => {
      try {
        setFetching(true);
        const result = await getUserInfo();
        const { empno } = result;
        log(`会议预定`, `JSBridge获取用户信息`, JSON.stringify({ empno }));

        const userInfo = await getEmployeeInfo({
          code: empno,
          curEmpCode: empno,
        });
        log(`会议预定`, `API获取用户信息`, JSON.stringify({ userInfo }));
        dispatch(setCurrentUser(userInfo));
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser.employeeCode) return;
    getUser();
  }, [currentUser]);

  return [isFetching, currentUser];
};
export default useFetchUserInfo;
