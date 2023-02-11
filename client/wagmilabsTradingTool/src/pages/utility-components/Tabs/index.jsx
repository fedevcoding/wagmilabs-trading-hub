import React from "react";
import "./style.css";

export const Tabs = ({ tabs, setTab, active, updateUrl = false }) => (
  <div className="tabs">
    {tabs.map(t => (
      <div
        onClick={() => {
          if (updateUrl) {
            window.location.hash = `#${t.toLowerCase()}`;
          }
          setTab(t);
        }}
        key={t}
        className={`btn ${t === active ? "active" : ""}`}
      >
        {t}
      </div>
    ))}
  </div>
);
