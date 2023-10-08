'use client';
import React from 'react'
import parse from 'html-react-parser';
import { sample } from '../../testdata/testdata';
import './SampleStory.scss';
import Tags from '../Tags/Tags';
// interface StoryDetail {
//   [id: string]: {
//     title: string,
//     story: string,
//   }
// }
// 
export default function SampleStory(props: {
  storyId: string
}) {
  const {storyId} = props;
  const storyObj = sample[storyId];
 
  // const storyDetail:StoryDetail = sample[storyId];
  return (
    <section>
      <article className='story-container'>
        <h1>{storyObj.title}</h1>
        <h2>{storyObj.author}</h2>
        <Tags tagList={storyObj.tags} />
        <p>{parse(storyObj.story)}</p>
      </article>
    </section>
  )
}
