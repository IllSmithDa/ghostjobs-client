'use client';
import React, { useState, useEffect } from 'react';
import "./StoryList.scss";
import Link from 'next/link';
import Tags from '../Tags/Tags';
import { Story } from '../Types';
import { axiosFetch } from '../Axios/axios';
import Loader from '../Loader/Loader';
import DropDownAll from '../DropDownAll/DropDownAll';
import ReportForm from '../ReportForm/ReportForm';

export default function StoryList() {
  const [storyList, setStoryList] = useState<Story[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [reportFormOn, setReportFormOn] = useState('');
  const limit = 7;

  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.post(`/api/story/by-date/${offset}/${limit}`)
        if (res.status === 200) {
          console.log(res.data);
          setOffset(offset => offset + 7);
          if (res.data.stories.length) {
            setStoryList([...storyList, ...res.data.stories])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
        return;
      }
      if (reachedEnd === false) fetchData();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.post(`/api/story/by-date/${offset}/${limit}`)
        if (res.status === 200) {
          console.log(res.data);
          setOffset(offset => offset + 7);
          if (res.data.stories.length) {
            setStoryList([...storyList, ...res.data.stories])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const openModal = () => {
    const login = document.getElementById('report-form');
    if(login) login.style.display = 'flex';
  }
  //       <Tags tagList={story.tags} />
  const renderList = () => storyList?.map((story) => (
    <article key={story.id} className='item-card'>
      <section>
      <h3>{story.title}</h3>
        {/* <button>...</button> */}
        <DropDownAll
          buttonName='&#65049;'
          dropdownId={`ellipsis-${story.id}`}
          btnClass='ellipsis-btn'
          positionY='34px'
        >
          <button onClick={() => {
            setReportFormOn(story.id);
          }}>Report</button>
        </DropDownAll>
      </section>
      <h4>{story.username}</h4>
      <section>
        { story.tags !== '' ?
        <p className='story-tag'>{(story.tags as string)}</p>:
        <p className='story-tag'>N/A</p>
        }
        <Link href={`/story/${story.id}`} className='link-btn link-btn-dark-grey link-btn-small'> 
          Read 	&#8594;
        </Link>
      </section>
      {
        reportFormOn === story.id? 
        <ReportForm
          reportType='story'
          username={story.username}
          contentId={story.id}
          clearReport={() => { setReportFormOn(''); }}
        />:
        <></>
      }
    </article>
  ));

  return (
    <section
      className='story-list-container'
    >
      <section className='head-story-list'>
        <h2>Featured Stories</h2>
      </section>
      {renderList()}
      {
        isLoading ? 
        <Loader />:
        <></>
      }
      {
        isError ? <h1>Warning: Error has occurred</h1>:<div/>
      }
    </section>
  );
}
