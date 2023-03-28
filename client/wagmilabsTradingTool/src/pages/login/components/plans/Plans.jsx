import React from "react";
import { Select } from "../../../../components/Form/Select";
import { durationSelectOptions, planOptions, getDurationSelectors } from "./options";
import Plan from "./Plan";

const Plans = () => {
  const [durationSelector, setDurationSelector] = React.useState(durationSelectOptions[2]);
  const durationSelectors = getDurationSelectors();

  return (
    <div className="plans-section">
      <div className="header">
        <h2 className="title">Plans</h2>

        <Select
          className="plan-selector"
          onChange={value => setDurationSelector(value)}
          label="Set duration"
          isSearchable={false}
          value={durationSelector}
          options={durationSelectors}
        />
      </div>
      <div className="plans">
        {planOptions.map(planOption => {
          return <Plan key={planOption.id} planOption={planOption} durationSelector={durationSelector} />;
        })}
      </div>
    </div>
  );
};

export default Plans;
