import React, { useContext, useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";

import "./index.scss";
// import { useSubscribe } from "../../../custom-hooks/useSubscribe";
// import { useNavigate } from "react-router";
import { EmailInput } from "../../Inputs/EmailInput";
import { pushToServer } from "../../../utils/functions/serverCalls";
import { useAccount } from "wagmi";
import { checkErrors } from "../../../utils/functions/errorHelpers";
import logOut from "../../../utils/functions/logout";
import { UserDataContext } from "../../../context/userContext";

export const PromoModal = React.memo(({ isOpen, onClose }) => {
  const { setConnected } = useContext(UserDataContext);
  const toast = useToast();
  const { address } = useAccount();
  //   const { subscribe } = useSubscribe();
  const [show, setShow] = useState(false);
  // const navigate = useNavigate();

  // function addClicked() {
  //   // let key = "checkplansclicked"
  //   navigate("/plans");
  //   // localStorage.setItem(key, true);
  // }

  useEffect(() => {
    const showed = localStorage.getItem("mainPromo");
    const cliecked = localStorage.getItem("clickedMainPromo");
    if (showed === "false" && !cliecked) {
      localStorage.setItem("mainPromo", true);
      setShow(true);
    }
  }, []);

  const handleSubmit = async email => {
    try {
      await pushToServer("/addEmail", { email, address });
      localStorage.setItem("clickedMainPromo", true);
      await logOut(setConnected);
    } catch (err) {
      console.log(err);
      const error = checkErrors(String(err));

      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

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
                <h1 className="title">Want 1 month FEE PRO plan access?</h1>
              </ModalBody>

              <ModalBody className="modal-body">
                <h3 className="body">
                  Drop your email and get instant access to 1 month of FREE PRO plan (valued at 57$)!
                </h3>
              </ModalBody>

              <ModalBody className="modal-body">
                {/* <Button colorScheme={"blue"} className="button" onClick={addClicked}>
                  Check our plans 🔥
                </Button> */}
                <EmailInput handleSubmit={handleSubmit} />
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
