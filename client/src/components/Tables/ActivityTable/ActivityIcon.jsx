import React from "react";

export const ActivityIcon = ({ type }) => {
  return (
    <>
      {(() => {
        switch (type) {
          case "sale":
            return <i className="fa-light fa-bag-shopping"></i>;
          case "ask":
            return <i className="fa-light fa-tag"></i>;
          case "bid":
            return <i className="fa-light fa-megaphone"></i>;
          case "transfer":
            return <i className="fa-light fa-truck"></i>;
          default:
            return <i className="fa-solid fa-question"></i>;
        }
      })()}
    </>
  );
};
