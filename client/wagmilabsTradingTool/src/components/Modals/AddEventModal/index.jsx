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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { ErrorAlert } from "src/components/Alerts/ErrorAlert";
import "./style.scss";
import { formatEventInfo } from "./utils/formatEventInfo";

export const AddEventModal = React.memo(
  ({ isOpen, onClose, onSave, section }) => {
    const [eventInfo, setEventInfo] = useState({});
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const cancelRef = React.useRef();

    const addEvent = () => {
      if (!eventInfo.date
          || !eventInfo.name
          || (section === "drops" && (!eventInfo.price || !eventInfo.supply))
          ) {
        onOpenAlert();
      } else {
        const eventToSave = formatEventInfo(eventInfo, section);
        onSave(eventToSave);
      }
    };

    const updateEventInfo = (e, type, isEvent) => {
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
            <div className="body">Date *</div>
            <ErrorAlert
              title="Missing required fields *"
              description="Attention! Fill required fields to add event.  "
              btnRightLabel="OK"
              isOpen={isOpenAlert}
              onClose={onCloseAlert}
              cancelRef={cancelRef}
            />
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
              Name *
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
                  Price *
                  <NumberInput>
                    <NumberInputField
                      placeholder="price"
                      color={"white"}
                      onChange={e => updateEventInfo(e, "price", true)}
                    />
                  </NumberInput>
                </div>
                <div className="field-container">
                  Supply *
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
