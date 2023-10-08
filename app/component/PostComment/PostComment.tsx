'use client';
import React, { useState } from 'react'
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import "./PostComment.scss";
import { useSelector } from 'react-redux';
import { axiosFetch } from '../Axios/axios';

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
interface Reply {
  id: string,
  commentIdRef: string,
  username: string,
  userImage: string,
  score: number,
  replyText: string,
  storyTitle: string,
  storyId: string,
}
interface Comment {
  id: string,
  username: string,
  text: string, 
  score: string, 
  userImage ?: string,
  replies: Reply [],
}
export default function PostComment({
  storyId,
  storyTitle,
  updateComments,
  turnOffReplies
}: {
  storyId: string,
  storyTitle: string,
  updateComments: (comment: Comment) => void,
  turnOffReplies: () => void
}) {
  const { username } = useSelector((res:AuthState) => res.userData.user);
  const [error, setError] = useState('');

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
  }) => {
    return (
      <Form
        className="comment-form"
      >
        <label>Post Comment</label>
        <Field
          name="comment"
          placeholder={
            username === '' ? 
            'Login to Comment' : 
            'Share your thoughts'
          }
          className="form-field"
          as="textarea"
          disabled={username === '' ? true : false}
          onClick={turnOffReplies}
        />
          {
            errors.comment ? 
            <p
             className='small-text small-text-error'
            >
             {touched.comment && errors.comment}
            </p>:
            <></>
          }
        {
          username === '' ?
          <></>:
          <button className='std-button std-button-night std-button-right' type="submit">Comment</button>
        }
      {
        error !== '' ? 
        <h3 
          className='small-text small-text-error'
        >
          {error}
        </h3>:
        <></>
      }
      </Form>
    );
  };

  return (
    <Formik
      initialValues={{
        comment: '',
      }}
      validationSchema={Yup.object().shape({
        comment: Yup.string()
          .required('Comment is required')
          .min(5, 'Comment must be between 5 and 7500 length')
          .max(7500, 'Comment must be between 5 and 7500 length')
      })}
      // https://stackoverflow.com/questions/56742376/react-formik-trigger-validation-only-on-form-submit
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async(values) => {
        // alert('Form Submission activated')
        const { comment } = values;
        console.log(`${username}: ${comment}`);
        try {
          const data = {
            username,
            storyId,
            text: comment,
            storyTitle,
          }
          const res = await axiosFetch.post('/api/story/comments/post', data)
          if (res.status === 200) {
            values.comment = '';
            const newComment:Comment = res.data.comment;
            updateComments(newComment);
          }
        } catch (err) {
          setError((err as Error).message);
        }
      }}
    >
      {renderForm}
    </Formik>
  )
}
