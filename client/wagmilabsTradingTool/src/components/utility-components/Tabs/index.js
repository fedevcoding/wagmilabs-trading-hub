import "./style.css";

export const Tabs = ({ tabs, setTab, active }) => (
  <div className="tabs">
    {tabs.map(t => (
      <div
        onClick={() => setTab(t)}
        className={`btn ${t === active ? "active" : ""}`}
      >
        {t}
      </div>
    ))}
  </div>
);
