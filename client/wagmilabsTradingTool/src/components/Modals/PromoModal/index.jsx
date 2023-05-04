import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";

import "./index.scss";
// import { useSubscribe } from "../../../custom-hooks/useSubscribe";
import { useNavigate } from "react-router";

export const PromoModal = React.memo(({ isOpen, onClose }) => {
  //   const { subscribe } = useSubscribe();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function addClicked() {
    // let key = "checkplansclicked"
    navigate("/plans");
    // localStorage.setItem(key, true);
  }

  useEffect(() => {
    const showed = localStorage.getItem("mainPromo");
    if (showed === "false") {
      localStorage.setItem("mainPromo", true);
      setShow(true);
    }
  }, []);

  return (
    <>
      {show && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <div className="promo-modal-container">
            <ModalOverlay backdropFilter="blur(5px)" />

            {/* 1 is for home, 2 is for collection */}
            {/* {type === 1 ? ( */}
            <ModalContent className="promo-modal">
              <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
              <ModalBody className="modal-body">
                <h1 className="title">Liking the platform?</h1>
              </ModalBody>

              <ModalBody className="modal-body">
                <h3 className="body">Upgrade to PRO 📈👑</h3>
              </ModalBody>

              <ModalBody className="modal-body">
                <Button colorScheme={"blue"} className="button" onClick={addClicked}>
                  Check our plans 🔥
                </Button>
              </ModalBody>
            </ModalContent>
            {/* // ) : (
        //   type === 2 && (
        //     <ModalContent className="promo-modal-2">
        //       <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
        //       <ModalBody className="modal-body">
        //         <h1 className="title">FREE BETA CLOSING 😰</h1>
        //       </ModalBody>

        //       <ModalBody className="modal-body">
        //         <h3 className="body">Keep using our platform by minting our NFT pass END OF MARCH!</h3>
        //       </ModalBody>
        //     </ModalContent>
        //   )
        // )} */}
          </div>
        </Modal>
      )}
    </>
  );
});
