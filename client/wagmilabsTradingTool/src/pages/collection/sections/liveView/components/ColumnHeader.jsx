import { LivePulsing } from '@Components'
import React from 'react'

const ColumnHeader = ({ type, columnHovered }) => {
    return (
        <div className='column-header'>
            <div className='title'>
                <p>{type === "listings" ? "Listings" : "Sales"}</p>
                <LivePulsing notActive={columnHovered[type]}/>
            </div>
        </div>
    )
}

export default ColumnHeader