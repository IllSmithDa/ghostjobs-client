'use client';
import React, {useEffect, useState} from 'react';
import parse from 'html-react-parser';
import './Admin.scss'
import { useSelector } from 'react-redux';
import { AuthState, UserReport } from '../component/Types';
import { useRouter } from 'next/navigation';
import { axiosFetch } from '../component/Axios/axios';
import ModalAll from '../component/ModalAll/ModalAll';

const fetchUrl:{[key: string]: string} = {
  'reply': '/api/story/reply',
  'story': '/api/story',
  'comment': '/api/story/comment',
}

export default function page() {
  const {replace} = useRouter();
  const { username, isadmin } = useSelector((res:AuthState) => res.userData.user);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [offset, setOffset] = useState(0);
  const [detailOnId, setDetailOnId] = useState<string>();
  const [selectedReport, setselectedReport] = useState<UserReport>();
  const [content, setContent] = useState<string>()
  const [contentTitle, setContentTitle] = useState<string>();
  const [err, setErr] = useState<string>();
  const limit = 10;

  useEffect(() => {
    const abortController = new AbortController();
    const fetchReports = async () => {
      const result = await axiosFetch.get(`/api/get-reports/${offset}/${limit}`);
      if (result.status === 200) {
        setOffset(offset => offset + 10);
        // console.log(result.data.reports);
        setReports(result.data.reports)
      }
    }
    if(isadmin) {
      fetchReports();
      return;
    } else {
      replace('/');
    }
    return () => {
      abortController.abort()
    }
  }, [isadmin])

  const getContent = async (report: UserReport) => {
    const type = report.reporttype;
    const url = report.reporttype === 'reply' ? 
    `${fetchUrl['reply']}/${report.commentid}/${report.contentid}`:
    `${fetchUrl[type]}/${report.contentid}`
    try {
      const result = await axiosFetch(url);
      console.log(result.data);
      console.log(type);
      if (result.status === 200) {
        switch (type) {
          case 'story': 
            setContent(result.data.text)
            setContentTitle(result.data.title)
          case 'reply':
            setContent(result.data.reply.replyText)
          case 'comment':
            setContent(result.data.comment.text)
        }
        setselectedReport(report);
      }
    } catch (err) {
      setErr((err as Error).message)
    }
  }
  const strikeUser = async (report: UserReport) => {
    try {
      const data = {
        type: report.reporttype,
        contentId: report.contentid,
        commentId: report.commentid,
        username: report.username,
        reportId: report.id,
      }
      const result = await axiosFetch.post(`/api/report/strike-user`, data);
      if (result.status === 200) {
        const updatedReports = reports.filter((selReport) => selReport.id !== report.id);
        setReports(...[updatedReports]);
        alert('Strike Successful!')
      }
    } catch (err) {
      setErr((err as Error).message)
    }
  }
  const cancelStrike = async (reportId: string) => {
    try {
      const result = await axiosFetch.delete(`/api/report/delete/${reportId}`);
      if (result.status === 200) {
        alert('Report successfully cleared!');
        const updatedReports = reports.filter((selReport) => selReport.id !== reportId);
        setReports(...[updatedReports]);
      } 
    } catch (err) {
      alert('Report has already been cleared!');
      const updatedReports = reports.filter((selReport) => selReport.id !== reportId);
      setReports(...[updatedReports]);
    }
  }
  const renderReports = reports.map((report) => (
    <article className='item-card'>
      <h3>{report.username}</h3>
      <h4>{report.offense}</h4>
      <h4>{report.reporttype}</h4>
      <section>
        <h4>{report.created_at}</h4>
        <div>
        <button
          className='std-button std-button-dark-grey std-button-right'
          onClick={async () => { 
            await getContent(report)
            setDetailOnId(report.id);
          }}
        >
          See Details
        </button>
        <button 
            className='std-button std-button-right std-button-dark-grey'
            type="button"
            onClick={() => {
              cancelStrike(report.id)
            }}>Clear Report</button>
        </div>
      </section>
      {
        detailOnId === report.id ? 
        <ModalAll
          modalId={`report-${report.id}`}
          sizeClass='default-dimensions'
          closeAllModals={() => setDetailOnId('')}
        >
          <h3>{report.username}</h3>
          <h4>{report.offense}</h4>
          <h4>{report.reporttype}</h4>
          <h4>{report.created_at}</h4>
          {
            report.reporttype === 'story' ?
            <h2>{contentTitle}</h2>:
            <></>
          }
          <p className='story-content'>{(content as string)}</p>
          <button 
            className='std-button std-button-right std-button-dark-grey'
            onClick={() =>  strikeUser(report)}>Send Strike</button>
          <button 
            className='std-button std-button-right std-button-dark-grey'
            type="button"
            onClick={() => {
              cancelStrike(report.id)
            }}>No Strike</button>
        </ModalAll>:
        <></>
      }
    </article>
  ))
  return (
    <section className='admin-container'>
      <h2>Admin</h2>
      {
        reports.length ?
        renderReports:
        <></>
      }
    </section>
  );
}