import React from "react";
import { Col, Row } from "@Components";
import FeedBanner from "../../../../assets/feed-banner.jpeg";

import "./style.scss";
import { Button } from "@chakra-ui/react";

export const Banner = React.memo(() => {
  const headline = "Wagmi Labs launching NFT pass mint to access Trading Hub";
  const summary = "The Wagmi Labs Trading Hub is now in FREE Beta for a limited period of time, after that whitelisted users will be able to mint an NFT pass to keep using the product";
  const link = "https://www.premint.xyz/WAGMI-Labs/";

  return (
    <a
      className="card"
      title={`News detail page: ${headline}`}
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      <Row>
        <Col className="info">
          <h3>{headline}</h3>
          <p className="feed-summary">{summary}</p>


          <div className="feed-banner-btn-container">
            <Button colorScheme={"white"}>
              Get Whitelisted!
            </Button>
          </div>
        </Col>
        <Col>
          <img alt={summary} src={FeedBanner} />
        </Col>
      </Row>
    </a>
  );
});
