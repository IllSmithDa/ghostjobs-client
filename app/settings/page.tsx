'use client';
import React, {useState, useEffect} from 'react'
import './Settings.scss'
import { AuthState } from '../component/Types';
import { useSelector, useStore } from 'react-redux';
import ModalAll from '../component/ModalAll/ModalAll';
import ResetPWForm from './ResetPWForm';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { username, strikes } = useSelector((res:AuthState) => res.userData.user);
  const [pwModalOn, setPWModalOn] = useState(false);

  const {push} = useRouter();
  useEffect(() => {
    if (!username) {
      push('/')
    }
  }, [username])

  return (
    <section className='settings-container'>
      <h2>Settings</h2>
      <article className='item-card'>
        <h3>My Acccount</h3>
        <h4>username: {username}</h4>
        <h4>strikes: {strikes}</h4>
        <button
          className='std-button std-button-medium std-button-dark-grey'
          onClick={() => setPWModalOn(true)}
        >
          Change Password
        </button>
      </article>
      {
        pwModalOn ? 
        <ModalAll
          modalId='pw-modal-on'
          sizeClass='small-dimensions'
          closeAllModals={() => { setPWModalOn(false) }}
        >
          <ResetPWForm 
            username={username}
            closeModal={() => { setPWModalOn(false); }}
          />
        </ModalAll>:
        <></>
      }
    </section>
  )
}
