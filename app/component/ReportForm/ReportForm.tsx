import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { axiosFetch } from '../Axios/axios';
import './ReportForm.scss';
import ModalAll from '../ModalAll/ModalAll';

export default function ReportForm({
  reportType,
  username,
  contentId,
  clearReport,
  commentId,
}: {
  reportType: 'reply' | 'story' | 'comment',
  username: string,
  contentId: string,
  clearReport: () =>  void,
  commentId ?: string,
}) {
  const [offense, setOffense] = useState<string>();
  const renderForm = () => (
    <ModalAll
      modalId='report-form'
      closeAllModals={clearReport}
      sizeClass='small-dimensions'

    >
    <Form className='report-form'>
      <h3>Report User For</h3>
      <ul>
        <li>
          <input id='hate-speech' name='offense' type='radio' onClick={() => {setOffense ('hate-speech'); }} />
          <label htmlFor='hate-speech'>Hate Speech</label>
        </li>
        <li>
          <input id='abuse-speech' name='offense' type='radio' onClick={() => {setOffense ('abuse-speech'); }} />
          <label htmlFor='abuse-speech'>Abuse and Harrassment</label>
        </li>
        <li>
          <input id='voilent-speech' name='offense' type='radio' onClick={() => {setOffense ('voilent-speech'); }} />
          <label htmlFor='voilent-speech'>Voilent Speech</label>
        </li>
        <li>
          <input id='spam-speech' name='offense' type='radio' onClick={() => {setOffense ('spam-speech'); }} />
          <label htmlFor='spam-speech'>Spam</label>
        </li>
        <li>
          <input id='deceptive-speech' name='offense' type='radio' onClick={() => {setOffense ('deceptive-speech'); }} />
          <label htmlFor='deceptive-speech'>Deceptive identities </label>
        </li>
      </ul>
      <button className='std-button std-button-brand' type="submit">submit</button>

    </Form>
    </ModalAll>
  )
  return (
    <Formik
      initialValues={{
        contentId: '',
      }}
      onSubmit={async() => {
        // alert('Form Submission activated')
        try {
          if (!offense) {
            alert('offense not given');
            return;
          }
          const dataToSubmit = {
            offense,
            reportType,
            username,
            contentId,
            commentId: commentId ?? '',
          };
          const result = await axiosFetch.post(`/api/report/post-report`, dataToSubmit, {
            withCredentials: true,
          });
          if (result.status === 200) {
            clearReport();
            alert('Report successfully submitted!');
          } 
        } catch (err) {
          clearReport();
          alert('Report has already been made!');
        }
      }}
    >
      {renderForm}
    </Formik>
  )
}
