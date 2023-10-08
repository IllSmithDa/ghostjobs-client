'use client';
import React, { useState,useEffect } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { axiosFetch } from '../component/Axios/axios';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Register({setLoader}:{ setLoader: (state: string) => void}) {
  const [requestErr, setRequsetErr] = useState('');
  const closeModal = () => {
    const close  = document.getElementById('modal');
    if (close) close.style.display = 'none';
    setLoader('login');
  }

  useEffect(() => {
    const params = {
      storyId: '895227203235119105'
    }
    axiosFetch.get('/api/story/', {params})
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const loginMenu = () => {
    setLoader('loading');
    setTimeout(() => {
      setLoader('login');
    }, 500);
  }
  const renderForm = ({ errors, touched}: {
    errors: any,
    touched: any,
  }) => {
    return (
      <form
        id='test-form'
        className='form-container'
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
             errors.username ? 
             <p
             className='small-text small-text-error'
           >
             {touched.username && errors.username}
           </p>:
           <></>
          }
        </>
        <>
          <button className='std-button std-button-brand' type='submit'>Register</button>
          {
             errors.email ? 
             <p
             className='small-text small-text-error'
           >
             {touched.email && errors.email}
           </p>:
           <></>
          }
        </>
  
      </form>
    );
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        conPassword: '', 
        email: '', 
      }}
      //https://github.com/jaredpalmer/formik/issues/2505
      validationSchema={Yup.object().shape({
        //cusername: Yup.string()
        //c  .required('Username is required')
        //c  .matches(
        //c    /^[a-zA-Z][a-zA-Z0-9]{5,20}$/,
        //c    'Username is not valid. Username must start with a letter, contain letters and numbers, cannot contain any special characters and must be 5 to 20 characters long.'
        //c  ),
        //cpassword: Yup.string()
        //c  .required('Password is required')
        //c  .matches(
        //c    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/,
        //c    'Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long',
        //c  ),
        //cconPassword: Yup.string()
        //c  .oneOf([Yup.ref('password')], 'Passwords must match')
        //c  .required('Confirm your Password'),
      })}
      onSubmit={async (values, {setSubmitting}) => {
        alert('Form Submission activated')
        console.log('????')
        const data = {
          username: values.username,
          password: values.password,
          email: values.email,
        }
        const res = await axiosFetch.post('http://localhost:5000/api/users/register-user', data);
        if (res.status === 200) {
          redirect('http://localhost:3000/register-success');
        }
      }}
    >
      {renderForm}
    </Formik>
  )
}
