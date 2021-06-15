import { useState, useEffect, useCallback } from 'react';

const useDataFetch = (api: any, query?: { [key: string]: any }) => {
  const [isFetching, setFetching] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState<any>(null);

  const getData = useCallback(() => {
    (async () => {
      try {
        setFetching(true);
        const result = await api(query);
        setData(result);
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setFetching(false);
      }
    })();
  }, [api, JSON.stringify(query)]);

  useEffect(() => {
    getData();
  }, [JSON.stringify(query)]);

  return [isFetching, isError, data, getData];
};
export default useDataFetch;
