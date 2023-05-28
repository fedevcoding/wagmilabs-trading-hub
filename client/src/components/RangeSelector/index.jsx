import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import React from "react";
import "./style.scss";

export const RangeSelector = ({ value, onChange, min, max }) => {
  return (
    <div className="range-selector-component">
      <Box className="box-container">
        <Slider flex="1" mr="4" value={value} onChange={onChange} min={min} max={max} width="90%">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <input
          type="number"
          value={value}
          style={{ all: "unset", width: "10%" }}
          max={max}
          min={min}
          onChange={e => onChange(e.target.valueAsNumber)}
        />
      </Box>
    </div>
  );
};
