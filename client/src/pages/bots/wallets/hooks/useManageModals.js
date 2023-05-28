import { useState } from 'react';

export const useManageModals = () => {

    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);


    const toggleModal = (modal, state) => {

        switch (modal) {
            case "transfer":
                setShowTransferModal(state);
                break;
            case "add":
                setShowAddModal(state);
                break;
            case "export":
                setShowExportModal(state);
                break;
            default:
                break;
        }
    }



    return {showTransferModal, setShowTransferModal, showAddModal, setShowAddModal, showExportModal, setShowExportModal, toggleModal};
}