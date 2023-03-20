import { HStack, NumberInput, NumberInputField, Button } from "@chakra-ui/react";
import React from "react";
import getMarketplaceImage from "src/utils/marketplaceImageMapping";
import { marketplaces } from "../../options";

export const Header = () => {
  return (
    <div className="header">
      <h1>Bulk listing</h1>

      <HStack gap={"35px"}>
        <div>
          <p>Marketplaces</p>
          <HStack gap={"10px"}>
            {marketplaces.map(marketplace => {
              const { value, name, royalties } = marketplace;
              const marketplaceImage = getMarketplaceImage(value);
              return (
                <HStack value={marketplace.value} className="marketplace-button">
                  <img src={marketplaceImage} alt={name} />
                  <p>{royalties}%</p>
                </HStack>
              );
            })}
          </HStack>
        </div>

        <div>
          <p>List all as</p>
          <HStack>
            <Button>
              <p>Floor price</p>
            </Button>
            <NumberInput>
              <HStack>
                <NumberInputField placeholder="Amount (eth)"></NumberInputField>
              </HStack>
            </NumberInput>
          </HStack>
        </div>
      </HStack>
    </div>
  );
};
