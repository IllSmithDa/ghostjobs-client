'use client'
import Comments from '@/app/component/Comments/Comments'
import PostComment from '@/app/component/PostComment/PostComment'
import StoryDetail from '@/app/component/StoryDetail/StoryDetail'
import React, {useState, useEffect} from 'react'
import "./page.scss"
import userFetch from '@/app/component/Auth/UserFetch'
import { axiosFetch } from '@/app/component/Axios/axios'
import { AuthState, Story } from '@/app/component/Types'
import Loader from '@/app/component/Loader/Loader'
import { useSelector } from 'react-redux'
import StoryReactions from '@/app/component/StoryReactions/StoryReactions'
import ReportForm from '@/app/component/ReportForm/ReportForm'

type Props = {
  params: {
    storyId: string,
  }
}


export default function Story({ params: {storyId}}: Props) {
  const { username } = useSelector((res:AuthState) => res.userData.user);
  // const username = await userFetch();
  console.log(`story Id ${storyId}`);
  const [storyData, setStoryData] = useState<Story>();
  const [myStoryReaction, setMyStoryReaction] = useState('none');
  const [err, setError] = useState<string>();
  const [fetchedReactions, setFetchedReactions] = useState(false);
  const [reportFormOn, setReportFormOn] = useState(false);

  const setReport = (reportState: boolean) => {
    setReportFormOn(reportState)
  }

  useEffect(() => {
    const getStory = async () => {
      try {
        const res = await axiosFetch.get(`api/story/${storyId}`)
        if (res.status === 200) setStoryData(res.data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    const checkExistingReaction = async () => {
      try {
        const res = await axiosFetch.get(`api/story/reaction/${storyId}/${username}`);
        if (res.data.reaction) {
          setMyStoryReaction(res.data.reaction.reaction)
        }
        setFetchedReactions(true);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    if (storyId) {
      getStory();
      if (username) {
        checkExistingReaction();
      } else [
        setTimeout(() => {
          setFetchedReactions(true);
        }, 2000)
      ]
    }
  }, [storyId, username])
  
  return (
  
    <>
    {
      storyData ?
      <>
        {
          reportFormOn? 
          <ReportForm
            reportType='story'
            username={storyData.username}
            contentId={storyData.id}
            clearReport={() => { setReportFormOn(false); }}
          />:
          <></>
        }
        <StoryDetail
          storyData={storyData as Story}
          setReportFormOn={setReport}
        />
        {
        fetchedReactions ?
          <StoryReactions
            reactions={storyData.reactions}
            storyId={storyData.id}
            storyAuthor={storyData.username}
            storyTitle={storyData.title}
            username={username}
            myStoryReaction={myStoryReaction}
          />:
          <></>
        }
        <Comments
          storyTitle={storyData.title}
          storyId={storyId}
          username={username} 
        />
      </>
      :
      <section
        className='large-loader'
      >
        <Loader />
      </section>
    }
      { err ? 
        <p className='small-text small-text-error'>{err}</p>:
        <></>
      }
    </>
  )
}
