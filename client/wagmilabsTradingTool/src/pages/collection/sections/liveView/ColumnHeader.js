import React from 'react'

const ColumnHeader = ({ type }) => {
    return (
        <div className='column-header'>
            <p className='title'>{type === "listings" ? "Listings" : "Sales"}</p>
        </div>
    )
}

export default ColumnHeader