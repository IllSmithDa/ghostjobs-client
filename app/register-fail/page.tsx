import React from 'react'
import './RegisterFail.scss';
import Link from 'next/link';

export default function RegisterSuccess() {
  return (
    <section
      className='register-fail'
    >
      <article>
        <p
          className='medium-text medium-text-error'
        > Error: Server could not created account. Please try registering again or contact an adminstrator for assistance.</p>
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
