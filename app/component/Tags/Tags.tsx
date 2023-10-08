import React from 'react'
import "./Tags.scss";

export default function Tags(props: {
  tagList: string []
}) {
  const {tagList} = props;
  const renderTags = () => tagList.map((tag:string) => (
    <p className="tags" key={tag}>{tag}</p>
  )) 
  return (
    <div
      className="tag-container"
    >
      <p className='tag-header'>tags: </p>
      {renderTags()}
    </div>
  )
}
