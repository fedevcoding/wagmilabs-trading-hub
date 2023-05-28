const { useState, useEffect } = require("react");

export const useLocationParams = () => {
  const [source, setSource] = useState(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window?.location?.search);
    const source = params.get("utm_source") || "";
    setSource(source);
  }, []);

  return { source };
};
