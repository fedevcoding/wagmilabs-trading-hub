import React, { useEffect, useMemo } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    HStack,
    Select
} from '@chakra-ui/react'
import ExcelJS from 'exceljs';
import { MultiSelect } from 'react-multi-select-component';

export const ExportModal = React.memo(({ showExportModal, toggleModal }) => {

    const [type, setType] = React.useState("all");
    const [wallets, setWallets] = React.useState([]);
    const [selectedWallets, setSelectedWallets] = React.useState([]);

    useEffect(() => {
        const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
        const options = wallets.map(row => ({ label: row.name, value: row.id }));

        setWallets(options);

        return () => {
            setType("all");
            setWallets([]);
            setSelectedWallets([]);
        }
    }, [showExportModal]);

    const downloadExcel = async () => {

        if (!isValidExport) return

        let data = JSON.parse(localStorage.getItem('wallets')) || [];

        if (type === "selected") {
            const selectedIds = selectedWallets.map(row => row.value);
            data = data.filter(row => selectedIds.includes(row.id));
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Wallets');
        worksheet.addRow(['Name', 'Address', 'Private Key']);

        data.forEach(row => {
            worksheet.addRow([row.name, row.address, row.privateKey]);
        });

        // auto-expand the address column
        const nameColumn = worksheet.getColumn('A');
        const addressColumn = worksheet.getColumn('B');
        const privateKeyColumn = worksheet.getColumn('C');

        const nameMaxLength = Math.max(...data.map(row => row.name.length));
        const addressMaxLength = Math.max(...data.map(row => row.address.length));
        const privateKeyMaxLength = Math.max(...data.map(row => row.privateKey.length));

        nameColumn.width = nameMaxLength + 5;
        addressColumn.width = addressMaxLength + 5;
        privateKeyColumn.width = privateKeyMaxLength + 5;

        // generate a buffer from the workbook
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx');
        document.body.appendChild(link);
        link.click();
    };


    const isValidExport = useMemo(() => type === "all" || selectedWallets.length > 0 ? true : false, [type, selectedWallets]);

    return (
        <>
            {
                showExportModal && (
                    <Modal isOpen={true} onClose={() => toggleModal("export", false)} isCentered={true}>
                        <ModalOverlay />
                        <ModalContent className='export-wallet-modal'>
                            <ModalHeader textAlign={"center"}>
                                <p>Export wallets</p>
                            </ModalHeader>

                            <ModalCloseButton />

                            <ModalBody>
                                <Select onChange={e => setType(e.target.value)} value={type}>
                                    <option value={"all"}>Export all wallets</option>
                                    <option value={"selected"}>Export custom wallets</option>
                                </Select>

                                {
                                    type === "selected" && (
                                        <MultiSelect options={wallets} hasSelectAll={false} className="multi-select" value={selectedWallets} onChange={setSelectedWallets} />
                                    )
                                }

                                <HStack className='alert low-opacity little-text'>
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    <p>Excel file will contain your wallet private keys.</p>
                                </HStack>
                            </ModalBody>

                            <ModalFooter justifyContent={"center"}>
                                <Button colorScheme="blue" mr={3} onClick={downloadExcel} width="100%" className={`export-btn ${isValidExport && "active"}`}>
                                    Download CSV
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </>
    )
})
