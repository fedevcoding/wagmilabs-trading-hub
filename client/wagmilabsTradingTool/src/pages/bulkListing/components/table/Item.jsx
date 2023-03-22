import React, { useState } from "react";
import { marketplacesData } from "../../../../utils/markeplacesData";
import { marketplaces as marketplacesOptions } from "../../options";
import { TableHr, EthLogo, MarketplaceImage, Plus, EthInput, Close, Image } from "@Components";
import ReactDatePicker from "react-datepicker";
import { roundPrice } from "../../../../utils/formats/formats";
import { HStack } from "@chakra-ui/react";
import { CustomModal } from "../../../../components/Modals/CustomModal";
const Item = ({ item, setMarketplace, changeListPrice, changeDuration }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { image, name, marketplaces, id, floorPrice } = item;

  return (
    <>
      <TableHr colSpan={6} />
      <tr>
        <td style={{ verticalAlign: "top" }}>
          <div className="token">
            <Image src={image} alt="nft" square customWidth borderRadius />
            <div className="col wrap-text">
              <p className="wrap-text">{name}</p>
              <EthLogo lowOpacity littleText text={"Floor: " + (floorPrice || "0")} size="14px" />
            </div>
          </div>
        </td>

        <td>
          <div className="marketplaces">
            {marketplaces.length > 0 ? (
              marketplaces?.map((marketplace, index) => {
                const { name } = marketplace;
                const hasAdd = index === 0 && marketplaces.length < 3;

                const remainingMarketplaces = marketplacesOptions.filter(option => {
                  const isNotInMarketplaces = !marketplaces.find(marketplace => marketplace.name === option.value);
                  return isNotInMarketplaces;
                });

                return (
                  <HStack>
                    {hasAdd && (
                      <>
                        <Plus hasBg onClick={() => setModalOpen(true)} />
                        <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen}>
                          <>
                            {remainingMarketplaces.map(({ value, name }) => {
                              return (
                                <p
                                  onClick={() => {
                                    setMarketplace(id, value, true);
                                    setModalOpen(false);
                                  }}
                                >
                                  {name}
                                </p>
                              );
                            })}
                          </>
                        </CustomModal>
                      </>
                    )}
                    <p>{marketplacesData[name]?.name}</p>
                    <MarketplaceImage name={name} />
                  </HStack>
                );
              })
            ) : (
              <>
                <Plus hasBg onClick={() => setModalOpen(true)} />
                <CustomModal isOpen={modalOpen} setIsOpen={setModalOpen}>
                  <>
                    {marketplacesOptions.map(({ value, name }) => {
                      return (
                        <p
                          onClick={() => {
                            setMarketplace(id, value, true);
                            setModalOpen(false);
                          }}
                        >
                          {name}
                        </p>
                      );
                    })}
                  </>
                </CustomModal>
              </>
            )}
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
            {marketplaces?.map(({ name }) => {
              return <Close onClick={() => setMarketplace(id, name, false)} />;
            })}
          </div>
        </td>
      </tr>
    </>
  );
};

export default Item;
