import React from "react";
import { LoadingSpinner, PageWrapper, Pagination } from "../utility-components";
import { useGetNews } from "./useGetNews";

import PoweredBy from "../../assets/poweredbyluckytrader-light.png";

import "./style.css";
import { Card } from "./Components";

const Feed = React.memo(() => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    news: { news },
    isLoading,
  } = useGetNews(currentPage);

  return (
    <PageWrapper page="feed">
      <h1>NFT news</h1>
      <div className="cards">
        {(news && !isLoading && (
          <>
            {news.map(n => (
              <Card key={n.link} news={n} />
            ))}
          </>
        )) || <LoadingSpinner />}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={p => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCurrentPage(p);
        }}
      />
      <div id="powered-by">
        <a
          title="Powered By Luckytrader"
          href="https://www.luckytrader.com/?tag=WagmiLabs"
          rel="sponsored"
        >
          <img src={PoweredBy} alt="Powered By Luckytrader" width={200} />
        </a>
      </div>
    </PageWrapper>
  );
});

export default Feed;
