'use client'
import React, {useEffect, useState} from 'react'
import { axiosFetch } from '../component/Axios/axios'
import { useSelector } from 'react-redux'
import { AuthState, Story } from '../component/Types'
import Loader from '../component/Loader/Loader'
import './Profile.scss'
import MyStories from '../component/MyStories/MyStories'
import MyComments from '../component/MyComments/MyComments'
import MyReactions from '../component/MyReactions/MyReaction'
import { useRouter } from 'next/navigation';

// https://stackoverflow.com/questions/75679649/cant-use-getstaticprop-in-next-js-13
export default function Profile() {
  const { push } = useRouter();
  const { username } = useSelector((res:AuthState) => res.userData.user);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectTab, setSelectTab] = useState<'story'|'comments'|'reactions'|'loading'>('loading')

  
  const fetchMyStories = (username: string) => {
    axiosFetch.get(`/api/story/stories/${username}`)
      .then((res) => {
        console.log(res.data.stories);
        setStories(res.data.stories);
        setSelectTab('story');
      })
      .catch((err) => {
        return {err: (err as Error).message, success: false };
      })
  }

  const updateStories = (stories: Story[]) => {
    setStories([...stories]);
  }

  const renderTab = () => {
    if (selectTab === 'story') {
      return (
        <MyStories />
      )
    } else if (selectTab === 'comments') {
      return (
        <MyComments username={username} />
      );
    } else  if (selectTab === 'reactions'){
      return (
        <MyReactions username={username} />
      )
    } else {
      return (
        <section className='loader-container'>
          <Loader />
        </section>
      );
    }
  }
  const handleTabChange = (tabVal: 'story'|'comments'|'reactions'|'loading') => {
    if (tabVal !== selectTab) {
      // updated tab selection
      const oldSelected = document.getElementsByClassName(`selected-tab`);
      if (oldSelected) {
        for (let i = 0; i < oldSelected.length; i++) {
          oldSelected[i].classList.remove('selected-tab');
        }
      }
      const newSelected = document.getElementById(`${tabVal}-tab`);
      if (newSelected) newSelected.classList.add('selected-tab');

      setSelectTab('loading');

      setTimeout(() => {
        setSelectTab(tabVal);
      }, 1000)
    }
  }
  useEffect(() => {
    if (username) {
      setSelectTab('story');
    } else [
      push('/')
    ]
  }, [username])
  return (
    <>
    <h1
      className='profile-header'
    >
      {username}
    </h1>
    <section
      className='profile-page'
    >
      <button 
        onClick={() => handleTabChange('story') }
        id='story-tab'
        className='selected-tab menu-tabs'
      >
          My Stories
      </button>
      <button
        id='comments-tab'
        className='menu-tabs'
        onClick={() => handleTabChange('comments') }>My Comments</button>
      <button
        className='menu-tabs'
        id='reactions-tab'
        onClick={() => handleTabChange('reactions') }>My Reactions</button>
      {renderTab()}
    </section>
    </>
  )
}
