import React from 'react'

export const ExportModal = ({ showExportModal }) => {
    return (
        <>
            {
                showExportModal && (
                    <div>ExportModal</div>
                )
            }
        </>
    )
}
