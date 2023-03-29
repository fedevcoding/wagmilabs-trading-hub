import React from "react";
import { Col, Row } from "@Components";
import FeedBanner from "@Assets/feed-banner.jpeg";

import "./style.scss";
import { Button } from "@chakra-ui/react";

export const Banner = React.memo(() => {
  const headline = "WAGMI LABS BETA CLOSING!";
  const summary =
    "The wagmi labs beta is finally closing and the NFT passes are minting TOMORROW (Thursday) at 12 PM EST!";
  const link = "https://discord.gg/wagmilabs";

  return (
    <a className="card" title={`News detail page: ${headline}`} href={link} target="_blank" rel="noreferrer">
      <Row>
        <Col className="info">
          <h3>{headline}</h3>
          <p className="feed-summary">{summary}</p>

          <div className="feed-banner-btn-container">
            <Button colorScheme={"white"}>Get Info!</Button>
          </div>
        </Col>
        <Col>
          <img alt={summary} src={FeedBanner} />
        </Col>
      </Row>
    </a>
  );
});
