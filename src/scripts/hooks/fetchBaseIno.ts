import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeInfo, queryServerTimeAndOpenTime } from '@api/punch-in';
import { getUserInfo } from '@util/custom-jsbridge';
import { setCurrentUser } from '@actions/currentUser';
import { setPunchInfTimeInfo } from '@actions/punchInTime';
import { log } from '@util/ucar-track';

const useFetchBaseInfo = () => {
  const punchInTime = useSelector((state: any) => state.punchInTime);
  const currentUser = useSelector((state: any) => state.currentUser);
  const [isFetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  const getUser = useCallback(() => {
    (async () => {
      try {
        setFetching(true);

        const result = await getUserInfo();
        const { empno } = result;
        log(`健康打卡`, `JSBridge获取用户信息`, JSON.stringify({ empno }));

        const userInfo = await getEmployeeInfo({
          code: empno,
          curEmpCode: empno,
        });
        log(`健康打卡`, `API获取用户信息`, JSON.stringify({ userInfo }));
        dispatch(setCurrentUser(userInfo));

        const timeInfo = await queryServerTimeAndOpenTime();
        dispatch(setPunchInfTimeInfo(timeInfo));
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

  return [isFetching, currentUser, punchInTime];
};
export default useFetchBaseInfo;
