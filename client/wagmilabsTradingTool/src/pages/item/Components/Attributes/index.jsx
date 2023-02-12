import React from "react";

import "./style.scss";

export const Attributes = React.memo(({ attributes }) => {
  const [visible, setVisible] = React.useState(false);

  return attributes.length ? (
    <>
      <div className="dropdown-btn" onClick={() => setVisible(!visible)}>
        Properties
        <i className={`fa fa-angle-${visible ? "up" : "down"}`} />
      </div>
      <div
        className={`attributes dropdown-content ${visible ? "visible" : ""}`}
      >
        {attributes.map(a => (
          <div className="attribute" key={a.key}>
            <div className="key">{a.key}</div>
            <div className="value">{a.value}</div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <></>
  );
});
