'use client'
import React, {useEffect, useState} from 'react'
import './DropDownAll.scss';
export default function DropDownAll({
  buttonName,
  dropdownId,
  btnClass,
  positionY,
  children,
}:{
  buttonName: string,
  dropdownId: string,
  btnClass ?: string,
  positionY ?: string,
  children: React.ReactNode
}) {
  const [isDropdownOn, setIsDropdownOn] = useState(false);
  const openModal = () => {
    const position = document.getElementById(`dropdown-${dropdownId}`);
    if(position) position.style.position = 'relative';
    const dropdownContents = document.getElementById(dropdownId);
    if(dropdownContents) dropdownContents.style.display = 'flex';
    const modal = document.getElementById('generic-dropdown-modal');
    if(modal) modal.style.display = 'block';
  }
  const closeModal = () => {
   setIsDropdownOn(false);
  }
  useEffect(() => {
    // handler
    const handleMouseEvent = (event: { target: any }) => {
      const elementId = event.target.id;
      if(elementId === 'generic-dropdown-modal') closeModal();
    }

    // listener 
    document.addEventListener('click', handleMouseEvent);
  
    // clean up
    return () => {
      document.removeEventListener('click', handleMouseEvent)
    }
  }, []);
  return (
    <section
      className='drop-down-all'
    >
      <button
        onClick={() => { setIsDropdownOn(true);  }}
        className={`${btnClass ?? 'drop-down-btn'} `}
      >
        {buttonName}
      </button>
      {
        isDropdownOn ?
        <div
          id={dropdownId}
          className='drop-down-menu'
          style={{ top: positionY ?? '52px'}}
        >
          {children}
        </div>:
        <></>
      }
      {
        isDropdownOn ?
        <div id='generic-dropdown-modal'></div>:
        <></>
      }
    </section>
  )
}
