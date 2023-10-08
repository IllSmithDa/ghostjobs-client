'use client';
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './Register.scss';
import Oauth from '../OAuth/Oauth';
import { axiosFetch } from '../Axios/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Register({setLoader}:{ setLoader: (state: 'login'|'register'|'loading') => void}) {
  const [requestErr, setRequsetErr] = useState<string>();
  const { push } = useRouter();
  const closeModal = () => {
    const close  = document.getElementById('modal');
    if (close) close.style.display = 'none';
    setLoader('login');
  }

  const loginMenu = () => {
    setLoader('loading');
    setTimeout(() => {
      setLoader('login');
    }, 500);
  }
  const renderForm = ({ 
    values,
    errors, 
    handleSubmit,
  }: {
    values: any,
    errors: any,
    handleSubmit: any,
  }) => {
    return (
      <form
        // https://github.com/jaredpalmer/formik/issues/2505
        id='register-form'
        className='form-container'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(values);
        }}
      >
        <button
          type='button'
          className='round-btn round-btn-inherit'
          onClick={closeModal}
        >
          &#10006;
        </button>
        <h1>Register</h1>
        <>
          <label>Username:</label>
          <Field
            name='username'
            placeholder='Your username silly'
            className='form-field'
          />
          {
             errors.username? 
             <p
             className='small-text small-text-error'
           >
             {errors.username}
           </p>:
           <></>
          }
        </>
        <>
          <label>Password:</label>
          <Field
            name='password'
            placeholder='Your password'
            className='form-field'
            type='password'
          />
          {
             errors.password ? 
             <p
             className='small-text small-text-error'
           >
             {errors.password}
           </p>:
           <></>
          }
        </>
        <>
          <label>Confirm Password:</label>
          <Field
            name='conPassword'
            placeholder='Confirm Your password'
            className='form-field'
            type='password'
          />
          {
             errors.conPassword ? 
             <p
             className='small-text small-text-error'
           >
             {errors.conPassword}
           </p>:
           <></>
          }
        </>
        <>
          <label>Email:</label>
          <Field
            name='email'
            placeholder='Enter a valid Email'
            className='form-field'
            type='email'
          />
          {
            errors.email ? 
             <p
             className='small-text small-text-error'
           >
             {errors.email}
           </p>:
           <></>
          }
          <button className='std-button std-button-long std-button-brand' type='submit'>Register</button>
        </>
          {
            requestErr ?
            <p
            className='small-text small-text-error'
          >
            {requestErr}
          </p>:
          <></>
          }

        <p
          className='small-text'
        >
          By clicking Register, you agree to Ghost Job's <Link target='_blank' href='/terms'>Terms of Service</Link> and <Link target='_blank' href='/privacy'>Privacy Policy</Link>
        </p>
        <h2>Or</h2>
        <button className='inv-button' type='button' onClick={loginMenu}>Login Here</button>
      </form>
    );
  }

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        username: '',
        password: '',
        conPassword: '', 
        email: '', 
      }}
      // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required('Username is required')
          .matches(
            /^[a-zA-Z][a-zA-Z0-9]{5,20}$/,
            'Username is not valid. Username must start with a letter, contain letters and numbers, cannot contain any special characters and must be 5 to 20 characters long.'
          ),
        password: Yup.string()
          .required('Password is required')
          .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/,
            'Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long',
          ),
        conPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Confirm your Password'),
        email: Yup.string()
          .required('Email is required')
          .matches(
            /^[A-Za-z0-9+_.-]+@(.+)$/,
            'Please use a valid email'
          )

      })}
      //https://github.com/jaredpalmer/formik/issues/2505
      onSubmit={async (values) => {
        try {
          setLoader('loading');
          const data = {
            username: values.username,
            password: values.password,
            email: values.email,
          }
          const res = await axiosFetch.post('http://localhost:5000/api/users/register-user', data);

          if (res?.status === 200) {
            closeModal();
            push('/register-success');
          } 
        } catch {
          setLoader('register')
          closeModal();
          push('/register-fail');
        }
      }}
    >
      {renderForm}
    </Formik>
  )
}
