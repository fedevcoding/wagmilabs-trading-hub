import React, { memo } from "react";
import { PageWrapper } from "../../../utility-components";
import { useGetData } from "./useGetData";
import "./index.scss";
import Column from "./Column";
import SalesMapping from "./mappings/SalesMapping";





const LiveView = memo(({ address, collectionName }) => {

    const { sales } = useGetData(address)

    return (
        <PageWrapper page="collection-live-view">

            <div className="live-view-section">
                <Column type="sales">
                    <SalesMapping sales={sales} />
                </Column>

                <Column type="listings">
                    <SalesMapping sales={sales} />
                </Column>
            </div>
        </PageWrapper>
    );
});

export default LiveView;
