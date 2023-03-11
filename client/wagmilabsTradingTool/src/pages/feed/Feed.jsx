import React from "react";
import { LoadingSpinner, PageWrapper, Pagination } from "@Components";
import { useGetNews } from "./useGetNews";
import { Card } from "./Components";
import { Banner } from "./Components/Banner";
import { generateRandomRangeInt } from "@Utils/formats/utils";
import { useSetPageTitle } from "@Hooks";
import PoweredBy from "@Assets/poweredbyluckytrader-light.png";

import "./style.scss";

const Feed = React.memo(() => {
  useSetPageTitle("Feed | Wagmi Labs");
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    news: { news },
    isLoading,
  } = useGetNews(currentPage);

  let bannerPos = generateRandomRangeInt(0, 3);

  return (
    <PageWrapper page="feed">
      <h1>NFT news</h1>
      {(news && !isLoading && (
        <>
          <div className="cards">
            {news.map((n, index) => (
              <React.Fragment key={n.link}>
                {index === bannerPos && <Banner />}
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
