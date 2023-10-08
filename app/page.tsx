'use client';
import Image from 'next/image'
import styles from './page.module.scss'
import Poststory from './component/PostStory.scss/PostStory'
import StoryDetail from './component/StoryDetail/StoryDetail'
import StoryList from './component/StoryList/StoryList'
import { sample } from './testdata/testdata'
import Banner from './component/Banner/Banner'
import Box from './component/Box/Box'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginUser } from './component/redux/features/AuthSlice'
import { useEffect } from 'react'


export default function () {
  // const username = await userFetch();
  // console.log(`username ${username}`);
  useEffect(() => {
  }, [])
  return (
    <main className='main'>
      <Banner />
      <StoryList />
    </main>
  )
}

