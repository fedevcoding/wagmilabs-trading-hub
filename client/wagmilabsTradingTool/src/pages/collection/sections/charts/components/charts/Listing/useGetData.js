import { getFromServer } from "@Utils";

const { useState, useEffect } = require("react");

export const useGetData = ({ window, collectionAddress }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/collectionCharts/listings?collectionAddress=${collectionAddress}&window=${window}`;
        const data = await getFromServer(url);

        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionAddress, window]);

  return { data, loading, error };
};
