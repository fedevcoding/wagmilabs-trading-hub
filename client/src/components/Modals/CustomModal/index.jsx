import React, { useEffect, useRef } from "react";

export const CustomModal = ({ children, isOpen, setIsOpen, closeOnClick, onClick }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && (closeOnClick || !modalRef.current.contains(event.target))) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsOpen, closeOnClick]);

  return (
    isOpen && (
      <div ref={modalRef} className="custom-modal" onClick={onClick}>
        {children}
      </div>
    )
  );
};
