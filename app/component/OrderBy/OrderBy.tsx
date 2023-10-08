import React, { useState, useEffect } from 'react'
import './OrderBy.scss';

export default function OrderBy() {
  const [buttonVal, setButtonval] = useState
  <'Order By'|'Date'|'Alphabetical'>('Order By')

  const openFilterOptions = () => {
    const filter = document.getElementById('filter-list');
    if(filter) filter.style.display = 'block';
    const modal = document.getElementById('filter-modal');
    if(modal) modal.style.display = 'block';
  }
  const closeModal = () => {
    const filter = document.getElementById('filter-list');
    if(filter) filter.style.display = 'none';
    const modal = document.getElementById('filter-modal');
    if(modal) modal.style.display = 'none';
  }

  //https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
  useEffect(() => {
    // handler
    const handleMouseEvent = (event: { target: any }) => {
      const elementId = event.target.id;
      if( elementId === 'filter-modal') closeModal();
    }

    // listener 
    document.addEventListener('click', handleMouseEvent);
  
    // clean up
    return () => {
      document.removeEventListener('click', handleMouseEvent)
    }
  }, []);
  return (
    <div
      className='filter-container'
    >
      <button
        className='std-button'
        onClick={openFilterOptions}
      >
        {buttonVal}
      </button>
      <ul className='filter-list' id='filter-list'>
        <li>Most Recent</li>
        <li>Oldest</li>
        <li>A-Z</li>
        <li>Z-A</li>
      </ul>
      <div id='filter-modal' />
    </div>
  )
}
