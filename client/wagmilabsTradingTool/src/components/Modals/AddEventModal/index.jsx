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
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { ErrorAlert } from "src/components/Alerts/ErrorAlert";
import "./style.scss";
import { formatEventInfo } from "./utils/formatEventInfo";

export const AddEventModal = React.memo(
  ({ isOpen, onClose, onSave, section, selectedDate, isAdmin }) => {
    const [eventInfo, setEventInfo] = useState({});
    const [inputLinkList, setInputLinkList] = useState([{ type: "", link: "" }]);
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const cancelRef = React.useRef();
    
    const addEvent = () => {
      if (!eventInfo.date
          || !eventInfo.name
          || (section === "drops" && (!eventInfo.price || !eventInfo.supply))
          ) {
        onOpenAlert();
      } else {
        const eventToSave = formatEventInfo(eventInfo, section, inputLinkList);
        onSave(eventToSave);
        setInputLinkList([{ type: "", link: "" }]);
        setEventInfo({});
      }
    };

    const handleInputLinkChange = (e, index, name) => {
      const { value } = e.target;
      const list = [...inputLinkList];
      list[index][name] = value;
      setInputLinkList(list);
    };
    
    const handleRemoveLinkClick = index => {
      const list = [...inputLinkList];
      list.splice(index, 1);
      setInputLinkList(list);
    };
    
    const handleAddLinkClick = () => {
      if(inputLinkList.length < 3)
      setInputLinkList([...inputLinkList, { firstName: "", lastName: "" }]);
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
        case "more":
          setEventInfo(prev => ({ ...prev, more: value }));
          break;
        default:
          break;
      }
    }

    useEffect(()=>{
      if(selectedDate) {
        setEventInfo((prev) => ({...prev, date: selectedDate.date}))
      }
    },[selectedDate])

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
              selected={eventInfo.date || selectedDate?.date}
              isClearable={true}
              placeholderText="Select event date"
              className="date-picker"
              showTimeSelect
              dateFormat="Pp"
              preventOpenOnFocus
              showMonthYearDropdown={false}
            />
            {isAdmin && (section === 'events' || section === 'spaces') && (
              <div className="field-container">
                More
                <NumberInput>
                  <NumberInputField
                    placeholder="More"
                    color={"white"}
                    onChange={e => updateEventInfo(e, "more", true)}
                  />
                </NumberInput>
              </div>
            )}
            <div className="field-container">
              Name *
              <HStack>
                <Input
                  placeholder="Name"
                  color={"white"}
                  onChange={e => updateEventInfo(e, "name", true)}
                />
              </HStack>
            </div>
            {section === "spaces" && (
              <div className="field-container">
                Host
                <HStack>
                  <Input
                    placeholder="Host"
                    color={"white"}
                    onChange={e => updateEventInfo(e, "spaceHost", true)}
                  />
                </HStack>
              </div>
            )}
            <div className="field-container">
              Description
              <HStack>
                <Input
                  placeholder="Description"
                  color={"white"}
                  onChange={e => updateEventInfo(e, "eventDescription", true)}
                />
              </HStack>
            </div>
            {section === "events" && (
              <div className="field-container">
                Location
                <HStack>
                  <Input
                    placeholder="Location"
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
                      placeholder="Price"
                      color={"white"}
                      onChange={e => updateEventInfo(e, "price", true)}
                    />
                  </NumberInput>
                </div>
                <div className="field-container">
                  Supply *
                  <NumberInput>
                    <NumberInputField
                      placeholder="Supply"
                      color={"white"}
                      onChange={e => updateEventInfo(e, "supply", true)}
                    />
                  </NumberInput>
                </div>
              </>
            )}
            <div className="field-container">
            Links
            <HStack>
              <div className="input-links-list">
            {inputLinkList.map((_, i) => (
              <div className="input-link-container">
                <div className="input-link-inner-container">
                <Input
                  placeholder="Type"
                  color={"white"}
                  onChange={e => handleInputLinkChange(e, i, 'type')}
                  className="input-link-type"
                />
                <Input
                  placeholder="Url"
                  color={"white"}
                  onChange={e => handleInputLinkChange(e, i, 'link')}
                  className="input-link-url"
                />
                </div>
                <Stack spacing={2} direction='row' align='center'>
                  {inputLinkList.length-1 === i && (
                    <Button colorScheme={"blue"} className="add-link" onClick={handleAddLinkClick}>
                      +
                    </Button>
                  )}
                  {inputLinkList.length !== 1 && (
                    <Button colorScheme={"blue"} className="remove-link" onClick={() => handleRemoveLinkClick(i)}>
                      -
                    </Button>
                  )}
                </Stack>
              </div>

            ))}
            </div>
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
