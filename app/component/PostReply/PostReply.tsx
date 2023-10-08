'use client';
import React, { useState } from 'react'
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import "./PostReply.scss";
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
export default function PostReply({
  storyId,
  storyTitle,
  commentId,
  updateReplies,
  cancelReply,
}: {
  storyId: string,
  storyTitle: string,
  commentId: string,
  updateReplies: (reply: Reply) => void,
  cancelReply: () => void
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
        className="reply-form"
      >
        <label>Post Reply</label>
        <Field
          name="comment"
          placeholder={
            username === '' ? 
            'Login to Reply' : 
            'Share your Reply'
          }
          className="form-field"
          as="textarea"
          disabled={username === '' ? true : false}
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
          <section className='reply-btn-group'>
            <button
              className='std-button std-button-night std-button-right'
              type="button"
              onClick={cancelReply}  
            >
                Cancel
              </button>
            <button
              className='std-button std-button-night std-button-right'
              type="submit"
            >
              Reply
            </button>
          </section>
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
            commentId,
            replyUsername: username,
            replyText: comment,
            userImage: '',
            storyTitle,
            storyId,
            score:0,
          }
          const res = await axiosFetch.put('/api/story/comment/add-reply', data)
          if (res.status === 200) {
            values.comment = '';
            const newReply:Reply = res.data.updatedReply;
            // console.log(newReply);
            updateReplies(newReply);
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
