import React from "react";
import { LoadingSpinner, PageWrapper } from "../utility-components";
import { useGetNews } from "./useGetNews";

import "./style.css";
import { Card } from "./Components";

const Feed = React.memo(() => {
  const { news } = useGetNews();

  console.log(news);

  return (
    <PageWrapper page="feed">
      <h1>NFT news</h1>
      <div className="cards">
        {(news && (
          <>
            {news.map(n => (
              <Card key={n.link} news={n} />
            ))}
          </>
        )) || <LoadingSpinner />}
      </div>
    </PageWrapper>
  );
});

export default Feed;
