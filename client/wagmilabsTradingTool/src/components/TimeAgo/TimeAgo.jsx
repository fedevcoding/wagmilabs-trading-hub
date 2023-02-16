import React, { useEffect, useState } from "react";
import { formatTime } from "@Utils";

export const TimeAgo = ({timestamp, intervalMs, isUnix}) => {
    
    const rightTimestamp = isUnix ? timestamp * 1000 : timestamp;

    const [timeAgo, setTimeAgo] = useState(formatTime(rightTimestamp))

    useEffect(() => {

        const intervalId = setInterval(() => {
            setTimeAgo(formatTime(rightTimestamp));
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [rightTimestamp, intervalMs]);

    return (
        <p>{timeAgo}</p>
    )
}
