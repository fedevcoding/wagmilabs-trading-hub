import { HStack, Button } from "@chakra-ui/react";
import React from "react";
import getMarketplaceImage from "src/utils/marketplaceImageMapping";
import { marketplaces } from "../../options";
import { ImageButton, EthInput } from "@Components";
import { useGoBack } from "../../../../custom-hooks";
import ReactDatePicker from "react-datepicker";

export const Header = ({
  selectedMarketplaces,
  toggleMarketplace,
  togglePrices,
  priceValue,
  selectFp,
  selectAllExpirations,
  selectedExpiration,
}) => {
  const goBack = useGoBack();
  return (
    <div className="header">
      <HStack gap={"20px"} className="title">
        <i className="fa-solid fa-chevron-left low-opacity back-button" onClick={() => goBack(1)}></i>
        <h1>Bulk listing</h1>
      </HStack>

      <HStack gap={"35px"}>
        <div className="marketplaces">
          <p className="mb-10">Set all marketplaces as</p>
          <HStack gap={"10px"}>
            {marketplaces.map(({ value, name, royalties }) => {
              const marketplaceImage = getMarketplaceImage(value);
              const isSelected = selectedMarketplaces.includes(value);

              return (
                <ImageButton
                  key={value}
                  onClick={() => toggleMarketplace(value, isSelected)}
                  value={value}
                  image={marketplaceImage}
                  alt={name}
                  isSelected={isSelected}
                  text={royalties + "%"}
                />
              );
            })}
          </HStack>
        </div>

        <div>
          <p className="mb-10">Set all prices as</p>
          <HStack>
            <Button colorScheme={"blue"} width="8rem" onClick={selectFp}>
              <p>Floor price</p>
            </Button>
            <EthInput onChange={value => togglePrices(value)} value={priceValue} />
          </HStack>
        </div>

        <div>
          <p className="mb-10">Set all durations as</p>
          <ReactDatePicker
            minDate={Date.now()}
            onChange={expiration => selectAllExpirations(expiration)}
            selected={selectedExpiration}
            isClearable={true}
            placeholderText="Select event date"
            className="date-picker"
            showTimeSelect
            dateFormat="Pp"
            preventOpenOnFocus
            showMonthYearDropdown={false}
          />
        </div>
      </HStack>
    </div>
  );
};
