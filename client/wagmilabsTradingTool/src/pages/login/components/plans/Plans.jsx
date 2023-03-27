import React from "react";
import { planOptions } from "./options";
import Plan from "./Plan";

const Plans = () => {
  return (
    <div className="plans-section">
      <div className="header">
        <h2 className="title">Plans</h2>
        <select name="" id="" className="plan-selector">
          <option value="">Monthly</option>
          <option value="">Quarter</option>
          <option value="">Semester</option>
        </select>
      </div>
      <div className="plans">
        {planOptions.map(planOption => {
          return <Plan key={planOption.id} planOption={planOption} />;
        })}
      </div>
    </div>
  );
};

export default Plans;
