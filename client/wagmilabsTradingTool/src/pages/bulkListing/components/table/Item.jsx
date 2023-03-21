import React from "react";
import { NumberInput, NumberInputField, HStack } from "@chakra-ui/react";
import { marketplaces as optionMarketplaces } from "../../options";
const Item = ({ item, setMarketplace }) => {
  const { image, name, marketplaces, listPrice, id, listings } = item;

  return (
    <tr>
      <td>
        <div className="token">
          <img src={image} alt="nft" />
          <div className="col">
            <p>{name}</p>
            <p className="little-text low-opacity">Floor: 0.0012</p>
          </div>
        </div>
      </td>
      <td onClick={() => setMarketplace(id, optionMarketplaces[0].name, true)}>
        {marketplaces?.map(marketplace => (
          <p>{marketplace.name}</p>
        ))}
      </td>
      <td>
        {/* {Object?.keys(listings || {})?.map((key, index) => {
          return (
            <NumberInput>
              <HStack>
                <NumberInputField placeholder={key}></NumberInputField>
              </HStack>
            </NumberInput>
          );
        })} */}
      </td>
      <td>{0}</td>
      <td></td>
    </tr>
  );
};

export default Item;
