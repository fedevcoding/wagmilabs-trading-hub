import { getFromServer } from "@Utils";

const { useState, useEffect } = require("react");

export const useGetData = ({ collectionAddress }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { response: data } = await getFromServer(
          `/collectionCharts/floorPrice?collectionAddress=${collectionAddress}&startDate=${"2023-01-01"}`
        );
        setData(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [collectionAddress]);

  return { data, error, loading };
};
