'use client'
import React, { useState } from 'react'
import parse from 'html-react-parser';
import './StoryDetail.scss';
import { Story } from '../Types';
import StoryReactions from '../StoryReactions/StoryReactions';
import DropDownAll from '../DropDownAll/DropDownAll';
import ReportForm from '../ReportForm/ReportForm';
// interface StoryDetail {
//   [id: string]: {
//     title: string,
//     story: string,
//   }
// }
// 
export default function StoryDetail(
  { 
    storyData,
    setReportFormOn
   }: {
  storyData: Story,
  setReportFormOn: (reportState: boolean) =>  void,
}) {
  // const storyDetail:StoryDetail = sample[storyId];
  console.log(storyData);
  return (
    <article className='story-container'>
      <section className='ellipsis-section'>
      <h1>{storyData.title}</h1>
      { storyData.tags !== '' ?
        <p className='story-tag'>{(storyData.tags as string)}</p>:
        <p className='story-tag'>N/A</p>
        }
      </section>
      <section>
        <h2>{storyData.username}</h2>
        {/* <button>...</button> */}
        <DropDownAll
          buttonName='&#65049;'
          dropdownId={`ellipsis-${storyData.id}`}
          btnClass='ellipsis-btn'
          positionY='34px'
        >
          <button onClick={() => { setReportFormOn(true); }}>Report</button>
        </DropDownAll>
      </section>
      <p className='story-content'>{parse(storyData.text)}</p>
    </article>
  )
}
