'use client';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { MouseEvent, useEffect, useState } from 'react'
import "./DropdownMenu.scss"
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/features/AuthSlice';
import { axiosFetch } from '../Axios/axios';

interface AuthState {
  userData: {
    user: {
      isAuth: boolean;
      isadmin: boolean;
      username: string;
      email?: string,
      uid?: string,
      userImage?: string;
    }
  }
}
export default function DropdownMenu() {
  const { username, isadmin } = useSelector((res:AuthState) => res.userData.user);
  const [displayNavMenu, setDisplayNavMenu] = useState(false);
  const dispatch = useDispatch();
  const closeModal = () => {
    setDisplayNavMenu(false);
  }

  // https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
  // https://stackoverflow.com/questions/55500547/express-session-does-not-save-the-passport-user-id-when-hosting-on-heroku
  // https://stackoverflow.com/questions/65767024/express-session-not-working-in-production-deployment
  useEffect(() => {
    // handler
    const handleMouseEvent = (event: { target: any }) => {
      const elementId = event.target.id;
      if( elementId === 'dropdown-modal') closeModal();
    }

    // listener 
    document.addEventListener('click', handleMouseEvent);
  
    // clean up
    return () => {
      document.removeEventListener('click', handleMouseEvent)
    }
  }, []);

  const logout = () => {
    axiosFetch.get('/api/users/logout-user', { withCredentials: true})
      .then(() => {
        // harsh but works for now
        dispatch(logoutUser());
        window.location.reload();
      })
  }
  const openModal = () => {
    setDisplayNavMenu(false);
    const login = document.getElementById('modal');
    if(login) login.style.display = 'flex';
  }
  // https://stackoverflow.com/questions/8879400/how-to-set-image-to-be-tabbable 
  return (
    <div className='dropdown-container'>
      <FontAwesomeIcon
        className='standard-icon standard-icon-bars'
        icon={faBars}
        tabIndex={0}
        aria-label='app menu'
        onClick={() => {
          setDisplayNavMenu(true);
        }}  
      />

      {
        displayNavMenu ?
        <nav id="main-nav-menu">
          <Link href='/' onClick={closeModal}>Home</Link>
          {
            username ?
            <Link href='/profile' onClick={closeModal}>Profile</Link>:
            <></>
          }
          {
            isadmin && username ? 
            <Link href='/admin' onClick={closeModal}>Admin</Link>:
            <></>
          }
          {
            username ? 
            <Link href='/new-story' onClick={closeModal}>Share Story</Link>:
            <></>
          }
                  {
            username ? 
            <Link href='/settings' onClick={closeModal}>Settings</Link>:
            <></>
          }
          <Link href='/about-us' onClick={closeModal}>About Us</Link>
          <Link href='/terms' onClick={closeModal}>Terms</Link>
          <Link href='/privacy' onClick={closeModal}>Privacy</Link>
          {
            username ?
            <button onClick={logout}>Logout</button>:
            <button onClick={openModal}>Login</button>
          }
        </nav>:
        <></>
      }
      {
        displayNavMenu ?
        <div id='dropdown-modal' />:
        <></>
      } 
      </div>
  )
}
