import { Button, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "./index.scss"

export const AddEventModal = React.memo(({
    isOpen,
    onClose,
}) => {
    const [date, setDate] = useState(null);

    const addEvent = () => {
        console.log('Add Event To Calendar', date)
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay
                backdropFilter='blur(5px)'
            />
            <ModalContent className="add-event-modal">

                <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
                <ModalBody className="modal-body">
                    <h1 className="title">Add Event</h1>
                </ModalBody>

                <ModalBody className="modal-body">
                    <h3 className="body">Date picker</h3>
                    <ReactDatePicker
                        minDate={new Date().getTime()}
                        onChange={v => {
                            setDate(v);
                        }}
                        selected={date}
                        isClearable={true}
                        placeholderText="Select event date"
                        className="date-picker"
                        showTimeSelect
                        dateFormat="Pp"
                        />
                </ModalBody>

                <ModalBody className="modal-body">
                    <Button colorScheme={"blue"} className="button" onClick={addEvent}>Save Event</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
})

