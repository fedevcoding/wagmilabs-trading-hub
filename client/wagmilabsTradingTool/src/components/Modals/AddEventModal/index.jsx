import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Input,
  HStack,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "./style.scss";

const formatLinks = links => {
  if (links && links.length > 0) {
    const temp = links.split(/:\s|,/);
    console.log(temp);
    const res = {};
    temp.map((el, index) => {
      if (index % 2 === 0) {
        return (res[el] = temp[index + 1]);
      }
    });
    return res;
  }
  return null;
};

const formatEventInfo = (eventInfo, section) => {
  const eventToSave = {};
  if (section !== "personal") {
    eventToSave.timestamp = eventInfo.date.getTime();
    eventToSave.links = formatLinks(eventInfo.links);
  }
  switch (section) {
    case "drops":
      eventToSave.collectionName = eventInfo.name;
      eventToSave.price = eventInfo.price;
      eventToSave.supply = eventInfo.supply;
      break;
    case "events":
      eventToSave.eventName = eventInfo.name;
      eventToSave.eventDescription = eventInfo.eventDescription;
      eventToSave.eventLocation = eventInfo.eventLocation;
      break;
    case "personal":
      eventToSave.event = {
          timestamp: eventInfo.date.getTime(),
          links: formatLinks(eventInfo.links),
          eventName: eventInfo.name,
          eventDescription: eventInfo.eventDescription
        }
      break;
    case "spaces":
      eventToSave.spaceName = eventInfo.name;
      eventToSave.spaceDescrition = eventInfo.eventDescription;
      eventToSave.spaceHost = eventInfo.spaceHost;
      break;
    default:
      break;
  }
  return eventToSave;
};

export const AddEventModal = React.memo(
  ({ isOpen, onClose, onSave, section }) => {
    const [eventInfo, setEventInfo] = useState({});

    const addEvent = () => {
      const eventToSave = formatEventInfo(eventInfo, section);
      onSave(eventToSave);
    };

    function updateEventInfo(e, type, isEvent) {
      let value;
      if (isEvent) value = e.target.value;
      else value = e;

      switch (type) {
        case "date":
          setEventInfo(prev => ({ ...prev, date: value }));
          break;
        case "name":
          setEventInfo(prev => ({ ...prev, name: value }));
          break;
        case "price":
          setEventInfo(prev => ({ ...prev, price: parseFloat(value) }));
          break;
        case "supply":
          setEventInfo(prev => ({ ...prev, supply: parseFloat(value) }));
          break;
        case "eventDescription":
          setEventInfo(prev => ({ ...prev, eventDescription: value }));
          break;
        case "eventLocation":
          setEventInfo(prev => ({ ...prev, eventLocation: value }));
          break;
        case "spaceHost":
          setEventInfo(prev => ({ ...prev, spaceHost: value }));
          break;
        case "links":
          setEventInfo(prev => ({ ...prev, links: value }));
          break;
        default:
          break;
      }
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent className="add-event-modal">
          <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
          <ModalBody className="modal-body">
            <h1 className="title">Add Event</h1>
          </ModalBody>

          <ModalBody className="modal-body">
            <h3 className="body">Date picker</h3>
            <ReactDatePicker
              minDate={new Date().getTime()}
              onChange={v => updateEventInfo(v, "date")}
              selected={eventInfo.date}
              isClearable={true}
              placeholderText="Select event date"
              className="date-picker"
              showTimeSelect
              dateFormat="Pp"
              preventOpenOnFocus
              showMonthYearDropdown={false}
            />
            <div className="field-container">
              Collection name
              <HStack>
                <Input
                  placeholder="name"
                  color={"white"}
                  onChange={e => updateEventInfo(e, "name", true)}
                />
              </HStack>
            </div>
            {section !== "drops" && (
              <div className="field-container">
                Description
                <HStack>
                  <Input
                    placeholder="description"
                    color={"white"}
                    onChange={e => updateEventInfo(e, "eventDescription", true)}
                  />
                </HStack>
              </div>
            )}
            {section === "events" && (
              <div className="field-container">
                Location
                <HStack>
                  <Input
                    placeholder="location"
                    color={"white"}
                    onChange={e => updateEventInfo(e, "eventLocation", true)}
                  />
                </HStack>
              </div>
            )}
            {section === "drops" && (
              <>
                <div className="field-container">
                  Price
                  <NumberInput>
                    <NumberInputField
                      placeholder="price"
                      color={"white"}
                      onChange={e => updateEventInfo(e, "price", true)}
                    />
                  </NumberInput>
                </div>
                <div className="field-container">
                  Supply
                  <NumberInput>
                    <NumberInputField
                      placeholder="supply"
                      color={"white"}
                      onChange={e => updateEventInfo(e, "supply", true)}
                    />
                  </NumberInput>
                </div>
              </>
            )}
            {section === "spaces" && (
              <div className="field-container">
                Host
                <HStack>
                  <Input
                    placeholder="host"
                    color={"white"}
                    onChange={e => updateEventInfo(e, "spaceHost", true)}
                  />
                </HStack>
              </div>
            )}
            <div className="field-container">
              Links
              <HStack>
                <Input
                  placeholder="type1: url1,type2: url2"
                  color={"white"}
                  onChange={e => updateEventInfo(e, "links", true)}
                />
              </HStack>
            </div>
          </ModalBody>

          <ModalBody className="modal-body">
            <Button colorScheme={"blue"} className="button" onClick={addEvent}>
              Save Event
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);
