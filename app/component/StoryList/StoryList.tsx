'use client';
import React, { useState } from 'react';
import "./StoryList.scss";
import Link from 'next/link';
import { Story } from '../Types';
import Loader from '../Loader/Loader';
import DropDownAll from '../DropDownAll/DropDownAll';
import ReportForm from '../ReportForm/ReportForm';
import useStory from '@/app/hooks/StoryHook';

export default function StoryList() {
  const [reportFormOn, setReportFormOn] = useState('');

  // story custom hook under /hook/StoryHook folder
  const [storyList, isError, isLoading] = useStory();

  const renderList = () => (storyList as Story[])?.map((story: Story) => (
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
