import { useState, useEffect, useCallback } from 'react';

const useListDataFetch = (api: any, query?: { [key: string]: any }) => {
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
        setEmpty(!result?.re?.rows || result?.re?.rows?.length === 0);
        setListData(result?.re?.rows || []);
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
      list = result?.re?.rows || [];
      setPageNo(result?.re?.pageNo || 1); // 以接口返回页面为准
    } catch (error) {
      setError(true);
      setPageNo(1); // 出错了再从第一页开始
    }

    return list;
  };

  return [isFetching, listData, getData, getListData, isEmpty, isError];
};
export default useListDataFetch;
