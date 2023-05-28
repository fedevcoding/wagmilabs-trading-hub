import React from "react";
import { LoadingSpinner, PageWrapper, Pagination } from "@Components";
import { useGetNews } from "./useGetNews";
import { Card } from "./Components";
import { useSetPageTitle } from "@Hooks";
import PoweredBy from "@Assets/poweredbyluckytrader-light.png";

import "./style.scss";
import { useSecurePro } from "../../custom-hooks/useSecurePro";

const Feed = React.memo(() => {
  useSecurePro();

  useSetPageTitle("Feed | Wagmi Labs");
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
              <React.Fragment key={n.link}>
                <Card key={n.link} news={n} />
              </React.Fragment>
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
            <a title="Powered By Luckytrader" href="https://www.luckytrader.com/?tag=WagmiLabs" rel="sponsored">
              <img src={PoweredBy} alt="Powered By Luckytrader" width={200} />
            </a>
          </div>
        </>
      )) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Feed;
