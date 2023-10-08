import React from 'react'
import './RegisterSuccess.scss';
import Link from 'next/link';

export default function RegisterSuccess() {
  return (
    <section
      className='register-success'
    >
      <article>
        <p
          className='medium-text'
        > Congrats on a successful registration. You can now login to your account</p>
        <Link
          href='/'
          className='link-btn link-btn-medium link-btn-white'
        >
          Redirect to Home
        </Link>
      </article>
      <div className='general-modal'></div>
    </section>
  )
}
