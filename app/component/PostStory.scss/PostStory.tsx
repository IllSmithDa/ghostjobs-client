'use client'
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import './Poststory.scss';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Alert/Alert';
import { axiosFetch } from '../Axios/axios';
import { useRouter } from 'next/navigation';
import Loader from '../Loader/Loader';
import StoryTags from '../StoryTags/StoryTags';
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

export default function Poststory() {
  const { username } =  useSelector((res:AuthState) => res.userData.user);
  const [titleErr, setTitleErr] = useState<string>();
  const [storyErr, setStoryErr] = useState<string>();
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const updateTag = (tag: string) => {
    setSelectedTag(tag);
  }

  useEffect(() => {
    if (!username) push('/')
  }, [username])

  const renderForm = ({ 
    values,
    errors, 
    touched,
    handleSubmit,
  }: {
    values: any,
    errors: any,
    touched: any,
    handleSubmit: any,
  }) => (
    <Form
      className='post-container'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }}
    >
       {isLoading ?
        <Loader />:
        <>
      <h1>Share your work story</h1>
      <label>Story Title:</label>
      <Field
        name='title'
        placeholder={
          username === '' ? 
          'Login to Share Story':
          'Story Title (5 characters minimum, 100 maximum)'
        }
        disabled={username === '' ? true : false}
        className='form-field'
      />
      {
        errors.title ? <p className='small-text small-text-error'>
          {errors.title}
        </p>:
        <></>
      }
      <label>Story</label>
      <Field
        name='story'
        as='textarea'
        placeholder={
          username === '' ? 
          'Login to Share Story':
          'Share your story (200 characters minimum, 10000 maximum)'
        }
        disabled={username === '' ? true : false}
        className='form-field'
      />
      {
        errors.story ? <p className='small-text small-text-error'>
          {errors.story}
        </p>:
        <></>
      }
      <StoryTags 
        updateTag={updateTag}
      />
      {
        username === '' ?
        <></>:
        <button className='std-button std-button-dark-grey std-button-right'>Publish</button>
      }
 
        </>
      }
    </Form>
  )

  return (
    <Formik
      initialValues={{
        title: '',
        story: '',
      }}
      // https://github.com/jquense/yup/tree/pre-v1
      // https://stackoverflow.com/questions/49886881/validation-using-yup-to-check-string-or-number-length
      // https://formik.org/docs/guides/validation
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .required('Title is required')
          .min(5, 'Error: title must be from 5 to 100 characters long')
          .max(100, 'Error: title must be from 5 to 100 characters long'),
        story: Yup.string()
          .required('Story is required')
          .min(200, 'Error: story must be from 200 to 10000 characters long')
          .max(10000, 'Error: story must be from 200 to 10000 characters long'),
      })}
      onSubmit={async(values) => {
        let isError = false;
        // alert('Form Submission activated')
        setIsLoading(true);
        const { title, story } = values;
        // console.log(title.length);
        // validation 
        if (title.length < 5 || title.length > 100) {
          setTitleErr('Error: title must be from 5 to 100 characters long');
          isError = true;
        } else {
          setTitleErr('');

          
        }

        if (story.length < 200 || story.length > 10000) {
          setStoryErr('Error: story must be from 200 to 10000 characters long');
          isError = true;
        } else {
          setStoryErr('');
        }

        if (isError) {
          setIsLoading(false);
          return;
        }
        const data = {title, story, username, selectedTag}
        const res = await axiosFetch.post('/api/story/post-story', data);
        if (res.status === 200) {
          push('/profile');
        }
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >

      {renderForm}
    </Formik>
  )
}
