import React from "react";
import { PageWrapper } from "../utility-components";
import { useGetNews } from "./useGetNews";

import "./style.css";

const Feed = React.memo(() => {
  const news = useGetNews();

  console.log(news);

  return (
    <PageWrapper page="feed">
      <h1>NFT news</h1>
    </PageWrapper>
  );
});

export default Feed;
