import React from "react";
// import { Select } from "../../../../components/Form/Select";
import {
  durationSelectOptions,
  planOptions,
  // getDurationSelectors
} from "./options";
import Plan from "./Plan";
import "./style.scss";

const Plans = ({ plans }) => {
  const [durationSelector] = React.useState(durationSelectOptions[0]);
  // const durationSelectors = getDurationSelectors();

  return (
    <div className={`plans-section ${plans && "plans-route"}`}>
      <div className="header">
        <h2 className="title">Plans</h2>

        {/* <Select
          className="plan-selector"
          onChange={value => setDurationSelector(value)}
          label="Set duration"
          isSearchable={false}
          value={durationSelector}
          options={durationSelectors}
        /> */}
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
