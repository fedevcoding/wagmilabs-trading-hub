import React from 'react'
import ColumnHeader from './ColumnHeader'

const Column = ({ children, type }) => {
    return (
        <div className='column'>
            <ColumnHeader type={type} />

            <div className='items'>
                {children}
            </div>
        </div>
    )
}

export default Column