import React from "react";

import "./style.css";

export const Attributes = React.memo(({ attributes }) => {
  const [visible, setVisible] = React.useState(false);

  console.log("attributes", attributes);

  return (
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
  );
});
