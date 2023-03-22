import { HStack, NumberInput, NumberInputField, InputRightElement, InputGroup } from "@chakra-ui/react";
import { EthLogo } from "@Components";
import React from "react";

export const EthInput = ({ placeholder, width, onChange, max, min, alignRight, value }) => {
  return (
    <NumberInput
      width={width || "8rem"}
      margin={alignRight && "0 0 0 auto"}
      value={value}
      onChange={value => typeof onChange === "function" && onChange(value)}
    >
      <InputGroup>
        <InputRightElement pointerEvents="none" children={<EthLogo lowOpacity />} />
        <HStack justifyContent={"right"}>
          <NumberInputField placeholder={placeholder || "Amount"}></NumberInputField>
        </HStack>
      </InputGroup>
    </NumberInput>
  );
};
