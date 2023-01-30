import React from "react";
import { Col, Row } from "../../../utility-components";
import moment from "moment";

import "./style.css";

export const Card = React.memo(({ news }) => {
  const {
    headline,
    summary,
    publishedAt,
    link,
    featuredImage,
    contract,
    tags,
  } = news;

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
          <h2>{headline}</h2>
          <p>{summary}</p>
          {(contract && (
            <div className="contract">
              Contract ({contract.chain}): <span>{contract.contract}</span>
            </div>
          )) ||
            ""}
          {(tags.length && (
            <div className="tags">
              {tags.map(t => (
                <div className="tag" key={t.slug}>
                  {t.name}
                </div>
              ))}
            </div>
          )) ||
            ""}
          <b className="date">
            {`${moment(publishedAt).utc().format("MMM DD, YYYY HH:mm:ss")} GMT`}
          </b>
        </Col>
        <Col>
          <img alt={summary} src={featuredImage.link} />
        </Col>
      </Row>
    </a>
  );
});
