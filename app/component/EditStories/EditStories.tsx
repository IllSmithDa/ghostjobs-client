'use client'
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import './EditStories.scss';
import { useDispatch, useSelector } from 'react-redux';
import { axiosFetch } from '../Axios/axios';
import { useRouter } from 'next/navigation';
import Loader from '../Loader/Loader';
import { Story } from '../Types';
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
export default function EditStories({
  storyId,
  title,
  body,
  tags,
  closeAllModals,
  updateStories
}: {
  storyId: string,
  title: string,
  body: string,
  tags: string,
  closeAllModals: () => void,
  updateStories: (StoryId: string,text: string,  title: string, tags: string ) => void
}) {
  const { username } =  useSelector((res:AuthState) => res.userData.user);
  const [titleErr, setTitleErr] = useState<string>();
  const [storyErr, setStoryErr] = useState<string>();
  const [selectedTag, setSelectedTag] = useState<string>()
  const [isLoading, setIsLoading] = useState(false);
  const [genErr, setGenErr] = useState('');

  const updateTag = (tag: string) => {
    setSelectedTag(tag);
  }


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
      className='edit-container'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }}
    >
      {isLoading ?
        <Loader />:
        <>
          <h1>Edit Story</h1>
          <label>Story Title:</label>
          <Field
            name='title'
            id='edit-title-input'
            type='text'
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
            id='edit-story-input'
            placeholder={
              username === '' ? 
              'Login to Share Story':
              'Share your story (200 characters minimum, 10000 maximum)'
            }
            disabled={username === '' ? true : false}
            className='form-field'
          />
          <StoryTags 
            updateTag={updateTag}
            currentTag={(tags as string ?? '')}
          />
          {
            errors.story ? <p className='small-text small-text-error'>
              {errors.story}
            </p>:
            <></>
          }
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
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={{
        title: title ?? '',
        story: body ?? '',
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
        const data = {title, text: story, storyId, selectedTag}
        const res = await axiosFetch.put('/api/story/update-story', data);
        if (res.status === 200) {
          updateStories(storyId, story, title, selectedTag ?? '');
          closeAllModals();
        }
      }}
    >

      {renderForm}
    </Formik>
  )
}
