import React from 'react'

export const TransferModal = ({ showTransferModal }) => {
    return (
        <>
            {
                showTransferModal && (
                    <div>TransferModal</div>
                )
            }
        </>
    )
}