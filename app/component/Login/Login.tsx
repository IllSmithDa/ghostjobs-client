'use client';
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import "./Login.scss";
import * as Yup from 'yup';
import Oauth from '../OAuth/Oauth';
import Link from 'next/link';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/features/AuthSlice';
import { axiosFetch } from '../Axios/axios';

export default function Login({setLoader}:{ setLoader:(state: string) => void}) {
  const [requestErr, setRequestErr] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const closeModal = () => {
    const close  = document.getElementById('modal');
    if (close) close.style.display = 'none';
  }
  
  const registerMenu = () => {
    setLoader('loading');
    setTimeout(() => setLoader('register'), 500);
  }

  const renderForm = ({ 
    values,
    errors, 
    handleSubmit,
  }: {
    values: any,
    errors: any,
    handleSubmit: any,
  }) => (
    <Form
      id="login-form"
      className="form-container"
    >
      <button
        type="button"
        className='round-btn round-btn-inherit'
        onClick={closeModal}
      >
        &#10006;
      </button>
      <h1>Login</h1>
      <label>Email:</label>
      <Field
        name="email"
        placeholder="Your email silly"
        className="form-field"
        type="email"
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
      <label>Password:</label>
      <Field
        name="password"
        placeholder="your password"
        className="form-field"
        type="password"
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
      {
        requestErr ?
        <p
          className='small-text small-text-error'
        >
          {requestErr}
        </p>:
        <></>
      }
      <button className='std-button std-button-long std-button-brand' type="submit">Login</button>

      <p>Or</p>
      <Oauth 
        company='Google'
      />
      <button className='inv-button' type='button' onClick={registerMenu}>Register Here</button>
      <Link
        href='/reset-password'
        className='link-btn-inv'
        onClick={closeModal}
      >
        Forgot Password?
      </Link>
    </Form>
  )

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .required('Password is required'),
        email: Yup.string()
          .required('Email is required')
          .matches(
            /^[A-Za-z0-9+_.-]+@(.+)$/,
            'Please use a valid email'
          )
      })}

      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async(values) => {
        // alert('Form Submission activated')
        try {
          const dataToSubmit = {
            email: values.email,
            password: values.password,
          };
          const result = await axiosFetch.post(`/api/users/login-user`,   dataToSubmit, {
            withCredentials: true,  
          });
          if (result.status === 200) {
            closeModal();
            window.location.reload();
          }
        } catch (err) {
          setRequestErr('Error: Email and/or password does not match existing records');
        }
      }}
    >
      {renderForm}
    </Formik>
  )
}
