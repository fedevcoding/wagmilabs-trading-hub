import React, { useEffect } from "react";
import { LoadingSpinner, PageWrapper, Pagination } from "@Components";
import { useGetNews } from "./useGetNews";

import PoweredBy from "../../assets/poweredbyluckytrader-light.png";

import "./style.scss";
import { Card } from "./Components";
import setPageTitle from "../../utils/functions/setPageTitle";
import { Banner } from "./Components/Banner";
import { generateRandomRangeInt } from "src/utils/formats/utils";

const Feed = React.memo(() => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    news: { news },
    isLoading,
  } = useGetNews(currentPage);

  useEffect(() => {
    setPageTitle("Feed | Wagmi Labs");
  }, []);

  let bannerPos = generateRandomRangeInt(0, 3);
  
  return (
    <PageWrapper page="feed">
      <h1>NFT news</h1>
      {(news && !isLoading && (
        <>
          <div className="cards">
            {news.map((n, index) => (
              <>
              {index === bannerPos && <Banner />}
              <Card key={n.link} news={n} />
              </>
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
