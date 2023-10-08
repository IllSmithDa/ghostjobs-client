import React from 'react'
import './LoginHelp.scss';
import Link from 'next/link';

export default function LoginHelp() {
  return (
    <section
      className='login-help'
    >
      <article>
        <p
          className='medium-text medium-text-error'
        > Error: Account with the email does not exist. Please Register before attempting to login with this email</p>
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
