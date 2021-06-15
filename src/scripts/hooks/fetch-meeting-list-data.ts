import { useState, useEffect, useCallback } from 'react';

const useListDataFetch = (
  api: any,
  query?: { [key: string]: any },
  responseKeyName?: any
) => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(query?.pageSize || 10);
  const [isFetching, setFetching] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [listData, setListData] = useState([]);
  const [isError, setError] = useState(false);

  const getListData = useCallback(() => {
    (async () => {
      try {
        setPageNo(1);
        setFetching(true);
        const result = await api({
          pageIndex: 1,
          pageSize,
          ...query,
        });
        console.info(result);
        if (typeof responseKeyName !== 'undefined') {
          setEmpty(
            !result[responseKeyName] || result[responseKeyName].length === 0
          );
          setListData(result[responseKeyName] || []);
        } else {
          setEmpty(!result?.list?.data || result?.list?.data?.length === 0);
          setListData(result?.list?.data || []);
        }
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setFetching(false);
      }
    })();
  }, [api, JSON.stringify(query)]);

  useEffect(() => {
    getListData();
  }, [JSON.stringify(query)]);

  // 提供给listview 上拉下拉回调
  const getData = async (type: number) => {
    let pageIndex = pageNo;
    if (1 === type) {
      // 1:上拉加载
      pageIndex = pageNo + 1;
      // setPageNo(pageNo + 1);
    } else if (2 === type) {
      // 2:下拉刷新
      //  setPageNo(1);
      pageIndex = 1;
    }
    // setPageNo(pageIndexNo);
    let list;
    try {
      const result = await api({ pageIndex, pageSize, ...query });
      setError(false);
      if (typeof responseKeyName !== 'undefined') {
        list = result[responseKeyName] || [];
        setPageNo(result?.pageNo || 1); // 以接口返回页面为准
      } else {
        list = result?.list?.data || [];
        setPageNo(pageIndex);
      }
    } catch (error) {
      setError(true);
      setPageNo(1); // 出错了再从第一页开始
    }

    return list;
  };

  return [isFetching, listData, getData, getListData, isEmpty, isError];
};
export default useListDataFetch;
