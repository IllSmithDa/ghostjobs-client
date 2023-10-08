'use client'
import React, {useEffect, useState} from 'react'
import './SearchPage.scss'
import { axiosFetch } from '../../component/Axios/axios'
import { Story } from '../../component/Types'
import Link from 'next/link'
import Loader from '../../component/Loader/Loader'

type Props = {
  params: {
    searchQuery: string,
  }
}

export default function SearchPage({ params: {searchQuery}}: Props) {
  const [initLoading, setInitLoading] = useState(true);
  const searchTerm = searchQuery.replaceAll('%20', ' ');
  const [isLoading, setIsLoading] = useState(true);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [offset, setOffset] = useState(0);
  const [stories, setStories] = useState<Story []>([]);
  const [err, setErr] = useState('');
  const limit = 10;

  useEffect(() => {
    // https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
    let controller = new AbortController();
    if (searchQuery) {
      const fetchMyStories = async () => {
        try {
          setIsLoading(true);
          const data ={
            searchQuery: searchTerm,
            offset,
            limit
          }
          const res = await axiosFetch.post('/api/story/search', data);
          setOffset(offset => offset + limit);
          setStories([...res.data.stories]);
        } catch (err) {
          setErr((err as Error).message)
        } finally {
          setIsLoading(false);
        }
      }
      fetchMyStories();
    }
    return () => controller?.abort();
  }, [searchTerm, limit])

  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data ={
          searchQuery,
          offset,
          limit
        }
        const res = await axiosFetch.post('/api/story/search', data);
        if (res.status === 200) {
          console.log(res.data);
          setOffset(offset => offset + 7);
          if (res.data.stories.length) {
            setStories([...stories, ...res.data.stories])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setErr((err as Error).message);
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

  const renderList = () => stories?.map((story) => (
    <article key={story.id} className='story-card'>
      <h2>{story.title}</h2>
      <h3>{story.username}</h3>
      <section>
        { story.tags !== '' ?
          <p className='story-tag'>{(story.tags as string)}</p>:
          <p className='story-tag'>N/A</p>
        }
        <Link href={`/story/${story.id}`} className='link-btn link-btn-small  link-btn-white'> 
        Read 	&#8594;
        </Link>
      </section>
    </article>
  ));

  return (
    <section
      className='story-list-container'
    >
      <section className='head-story-list'>
        <h2>Results for &apos;{searchTerm}&apos;</h2>
      </section>

      {renderList()}
      {
        isLoading ? 
        <Loader />:
        <></>
      }
      {
        err !== '' ? <h1>Warning: Error has occurred</h1>:<div/>
      }
    </section>
  )
}
