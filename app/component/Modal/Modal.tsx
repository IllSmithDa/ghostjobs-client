import React, { Children } from 'react'
import './Modal.scss';

export default function Modal({
  children,
  modalId,
  width = 400,
  height = 200,
}: {
  children: React.ReactNode,
  modalId: string,
  width ?: number,
  height ?: number,
}) {
  
  const closeModal = () => {
    const close = document.getElementById(modalId);
    if (close) close.style.display = 'none';
    const modal = document.getElementById('generic-modal');
    if (modal) modal.style.display = 'none';
  }
  return (
    <>
      <section
      className='generic-modal-container'
      id={modalId}
      >
        <button
          type="button"
          className='round-btn round-btn-inherit'
          onClick={closeModal}
        >
          &#10006;
        </button>
        {
          children
        }
      </section>
      <div id='generic-modal'></div>
    </>
  )
}
