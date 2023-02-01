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
      {(news && !isLoading && (
        <>
          <div className="cards">
            {news.map(n => (
              <Card key={n.link} news={n} />
            ))}
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
        </>
      )) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Feed;
