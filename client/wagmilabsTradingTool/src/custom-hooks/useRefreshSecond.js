const {useEffect, useState} = require("react");


export const useRefreshSecond = () => {
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(!refresh);
        }, 1000);

        return () => clearInterval(interval);
    }, [refresh]);
    return refresh;
}