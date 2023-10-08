'use client';
import React, { useState, useEffect, useCallback } from 'react'
import './ComponentModal.scss'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Loader from '../Loader/Loader';

export default function ComponentModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<string>('login')
  
  
  const setLoader = (state: string) => {
    setLoadingState(state);
  }

  const checkLoadingState = () => {
    if (loadingState === 'login') {
      return <Login setLoader={setLoader} />
    } else if (loadingState === 'register') {
      return <Register setLoader={setLoader}  /> 
    } else {
      return <Loader />
    }
  }

  

  return (
    <section
      id="modal"
    >
      {
        checkLoadingState()
      }
    </section>
  )
}
