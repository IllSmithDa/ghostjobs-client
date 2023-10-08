import React, { useState, useEffect } from 'react'
import './ModalAll.scss';

export default function ModalAll({
  children,
  modalId,
  closeAllModals,
  sizeClass = ''

}: {
  children: React.ReactNode,
  modalId: string,
  sizeClass ?: string,

  closeAllModals: () => void
}) {

  const closeModal = () => {
    closeAllModals();
  }


  return (
      <>
      <article
        className={`generic-modal-container-all ${sizeClass}`}
        id={modalId}
      >
        <button
          type="button"
          className='round-btn round-btn-inherit round-btn-right'
          onClick={closeModal}
        >
          &#10006;
        </button>
        {
          children
        }
      </article>
      <div id='generic-modal-all' onClick={closeModal}></div>
      </>
  );
}
