import React from 'react'
import ColumnHeader from './ColumnHeader.jsx'

const Column = ({ children, type, columnHovered, changeHover }) => {

  return (
    <div className='column' onMouseEnter={() => changeHover(type, true)} onMouseLeave={() => changeHover(type, false)}>
      <ColumnHeader type={type} columnHovered={columnHovered}/>

      <div className={"items"}>
        {children}
      </div>
    </div>
  )
}

export default Column