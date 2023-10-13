'use client';
import { axiosFetch } from '@/app/component/Axios/axios';
import { Field, Formik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import './PasswordReset.scss';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    resetToken: string,
    userId: string;
  }
}


export default function page({ params: { userId, resetToken}}: Props) {
  const [requestErr, setRequestErr] = useState<string>();
  const {push} = useRouter();
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
        className='form-container resetpw-container'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(values);
        }}
      >
        <h1>To Change Password</h1>
        <>
          <label style={{ marginTop: '3rem'}}>Enter a new Password:</label>
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
          <button style={{marginTop: '3rem'}}className='std-button std-button-long std-button-brand' type='submit'>Submit</button>
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
      </form>
    );
  }

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        userId,
        resetToken,
        password: '',
        conPassword: '', 
      }}
      // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .required('Password is required')
          .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/,
            'Password must have a minimum of 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number and in total be at least 8 characters long and maximum of 24 characters long',
          ),
        conPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Confirm your Password'),

      })}
      //https://github.com/jaredpalmer/formik/issues/2505
      onSubmit={async (values) => {
        console.log(values.password)
        try {
          // dsetLoader('loading');
          const data = {
            userId: values.userId,
            newPassword: values.password,
            resetToken: values.resetToken
          }
          const res = await axiosFetch.put('/api/reset-password/change-password', data);

          if (res?.status === 200) {
            alert('Password successfully changed!');
            push('/');
          } 
        } catch {
          setRequestErr('Error: current password does not match existing records')
        }
      }}
    >
      {renderForm}
    </Formik>
  );
}
