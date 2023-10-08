import React, {useState} from 'react'
import './StoryTags.scss';

const tags = [
  'Recruitment', 'HR', 'Bad Bosses', 'Scam Alert', 'Funny', 'Training', 'Marketing', 'Ghost Job', 'Remote Work', 'Sad', 'Angry', 'Feel Good Story', 'Salary'
]

export default function StoryTags({
  updateTag,
  currentTag,
}: {
  updateTag: (tag: string) => void,
  currentTag ?: string,
}) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [selectedTag, setSelectedTag] = useState(currentTag ? currentTag : 'Select a Tag');
  const renderTagList = tags.map((tag) => {
    return (
      <li
        onClick={() => { 
          updateTag(tag)
          setSelectedTag(tag);
          setToggleMenu(!toggleMenu)
        }}
      >{tag}</li>
    )
  })
  
  return (
    <section
      className='story-tags-container'
    >
      <button
        type='button'
        className='drop-down-btn'
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        {selectedTag}
      </button> (optional)
      {
        toggleMenu ? 
        <ul>
          <li
            onClick={() => { 
              updateTag('')
              setSelectedTag('Select a Tag');
              setToggleMenu(!toggleMenu)
            }}
          >Select a Tag</li>
          {renderTagList}
        </ul>:
        <></>
      }
      {
        toggleMenu ?
        <div className='silent-modal' onClick={() => setToggleMenu(!toggleMenu)}></div>:
        <></>
      }
    </section>
  )
}
