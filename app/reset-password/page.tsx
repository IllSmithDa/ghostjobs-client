'use client';
import React, { useState } from 'react'
import Loader from '../component/Loader/Loader';
import { axiosFetch } from '../component/Axios/axios';
import './ResetPassword.scss';

export default function page() {
  const [email, setEmail] = useState('');
  const [reqMsg, setReqMsg] = useState('Initializing....')
  const [reqState, setReqState] = useState<'initial' | 'loading' | 'success' | 'failed'>('initial');

  const processEmail = async () => {
    try {
      if (email === '') {
        setReqState('failed')
        return;
      }
      const res = await axiosFetch.post('/api/email/request-reset-password', {
        email
      })
      console.log(res);
      if (res.status === 200) {
        setReqState('success')
      } else {
        setReqState('failed')
      }
    } catch(e) {
      console.log((e as Error).message);
      setReqState('failed')
    }
  }

  const submitRequest = async() => {
    setReqMsg('Processing Request...');
    setReqState('loading');
    setTimeout(() => {
      processEmail();
    }, 1500)

  }
  if (reqState === 'initial') {
    return (
      <form
        className='reset-password-page'
        onSubmit={submitRequest}
      >
        <h2>Request Password Reest</h2>
        <input 
          placeholder='Enter Account Email Here'
          onChange={(e) => {setEmail(e.target.value)}}
        />
        <button
          className='std-button std-button-med'
          type='submit'
        >
          Request Reset
        </button>
      </form>
    )
  } else if (reqState === 'success') {
    return (
      <section
        className='reset-password-page'
      >
        <h2>Password Reset link has been sent to your email</h2>
      </section>
    )
  } else if (reqState === 'failed') {
    return (
      <section
        className='reset-password-page'
      >
        <h2>Error: Password Reset request has failed!</h2>
        <h2>Please make sure you have entered a valid existing account email. If you stil have problems, please contact an administrator for help. 
        </h2>
        <button
          className='std-button std-button-med'
          type='button'
          onClick={() => { 
            setReqMsg('Returning...');
            setReqState('loading')
            setTimeout(() => {
              setReqState('initial')
            }, 1500)
          }}
        >
          Try Again
        </button>
      </section>
    )
  } else {
    return (
      <section
        className='reset-password-page'
      >
        <Loader
          loadingMsg={reqMsg}
        />
      </section>
    )
  }
}
