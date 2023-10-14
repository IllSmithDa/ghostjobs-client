'use client';
import StoryList from './component/StoryList/StoryList'
import Banner from './component/Banner/Banner'
import { useEffect } from 'react'
import './globals.scss'


export default function () {
  // const username = await userFetch();
  // console.log(`username ${username}`);
  useEffect(() => {
  }, [])
  return (
    <main className='main'>
      <Banner />
      {/*
        <ins className="adsbygoogle"
          data-ad-client="ca-pub-2907367619848104"
          data-ad-slot="6276837611"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
      <StoryList />
    </main>
  )
}

