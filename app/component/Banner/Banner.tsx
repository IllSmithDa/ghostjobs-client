'use client';
import React from 'react'
import './Banner.scss';
import { useSelector } from 'react-redux';
import Link from 'next/link';

interface AuthState {
  userData: {
    user: {
      isAuth: boolean;
      isAdmin: boolean;
      username: string;
      email?: string,
      uid?: string,
      userImage?: string;
    }
  }
}

export default function Banner() {
  const { username } =  useSelector((res:AuthState) => res.userData.user);
  const openModal = () => {
    const login = document.getElementById('modal');
    if(login) login.style.display = 'flex';
  }
  return (
    <section className='banner'>
      <h1>Share Your Work Stories</h1>
      <p>We want to hear about your professional journey. Share your experiences, challenges, and successes with us.</p>
      {
        username === '' ?    <button onClick={openModal} className='std-button'>Get Started</button>:
        <Link href='/new-story' className='link-btn link-btn-medium link-btn-white'>Share Story</Link>
      }
    </section>
  )
}
