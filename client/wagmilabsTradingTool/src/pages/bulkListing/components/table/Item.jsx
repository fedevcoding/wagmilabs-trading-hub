import React from "react";
import { marketplacesData } from "../../../../utils/markeplacesData";
import { TableHr, EthLogo, MarketplaceImage, Plus, EthInput } from "@Components";
import ReactDatePicker from "react-datepicker";
import { roundPrice } from "../../../../utils/formats/formats";
import { HStack } from "@chakra-ui/react";
const Item = ({ item, setMarketplace, changeListPrice, changeDuration }) => {
  const { image, name, marketplaces, listPrice, id, listings, floorPrice } = item;

  return (
    <>
      <TableHr colSpan={6} />
      <tr>
        <td style={{ verticalAlign: "top" }}>
          <div className="token">
            <img src={image} alt="nft" />
            <div className="col wrap-text">
              <p className="wrap-text">{name}</p>
              <EthLogo lowOpacity littleText text={"Floor: " + floorPrice} size="14px" />
            </div>
          </div>
        </td>

        <td
        // onClick={() => setMarketplace(id, optionMarketplaces[1].value, true)}
        >
          <div className="marketplaces">
            {marketplaces?.map((marketplace, index) => {
              const { name } = marketplace;
              const hasAdd = index === 0 && marketplaces.length < 3;
              return (
                <HStack>
                  {hasAdd && <Plus hasBg />}
                  <p>{marketplacesData[name]?.name}</p>
                  <MarketplaceImage name={name} />
                </HStack>
              );
            })}
          </div>
        </td>

        <td className="price-inputs">
          {marketplaces?.map(({ price, name }) => (
            <EthInput alignRight value={price} onChange={value => changeListPrice(id, name, value)} />
          ))}
        </td>

        <td>
          <div className="fees">
            {marketplaces?.map(({ price, name }) => {
              const royaltie = marketplacesData[name]?.royalties;
              const fee = roundPrice((price * royaltie) / 100);
              return <EthLogo text={fee || "0"} />;
            })}
          </div>
        </td>

        <td>
          <div className="dates">
            {marketplaces?.map(({ expiration, name }) => {
              return (
                <ReactDatePicker
                  minDate={Date.now()}
                  onChange={duration => changeDuration(id, name, duration)}
                  selected={expiration}
                  isClearable={true}
                  placeholderText="Select event date"
                  className="date-picker"
                  showTimeSelect
                  dateFormat="Pp"
                  preventOpenOnFocus
                  showMonthYearDropdown={false}
                />
              );
            })}
          </div>
        </td>

        <td>
          <div className="remove-marketplace">
            {marketplaces?.map(() => {
              return <p>x</p>;
            })}
          </div>
        </td>
      </tr>
    </>
  );
};

export default Item;
