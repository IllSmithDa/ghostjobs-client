import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import React, { useState,useEffect } from 'react'
import './LikeDisLike.scss';
import { axiosFetch } from '../Axios/axios';
import { parseVal } from '@/app/_helper/numbers';

interface FetchData {
  commentId: string,
  username: string,
  score: number
}

export default function LikeDislike({
  score,
  myScore,
  commentId,
  username,
  isReply,
  storyId,
  replyId,
}: {
  score: number,
  myScore: number,
  commentId: string,
  username: string,
  isReply: boolean,
  storyId: string,
  replyId ?: string,
}) {
  const [currentScore, setCurrentScore] = useState(score);
  const [currentUserScore, setCurrentUserScore] = useState(myScore);
  // console.log(username);
  const [err, setErr] = useState('');
  const updateScore = async (value: number) => {
    const data = {
      commentId,
      username,
      score: value,
      storyId, 
      replyId: replyId ?? '',
    }
    try {
      // very ugly will need to refactor at some point
      setCurrentScore((currentScore) => {
        if (value === 0) {
          if (currentUserScore === 1) {
            return currentScore - 1;
          } else if (currentUserScore === -1) {
            return currentScore + 1;
          } else {
            return currentScore 
          }
        } else if (value === -1) {
          if (currentUserScore === 1) {
            return currentScore - 2;
          } else if (currentUserScore === 0) {
            return currentScore - 1;
          } else {
            return currentScore
          }
        } else {
          if (currentUserScore === -1) {
            return currentScore + 2;
          } else if (currentUserScore === 0) {
            return currentScore + 1;
          } else {
            return currentScore;
          }
        }
      });
      // console.log(value);
      // console.log(currentScore);
      if (value === 0) setCurrentUserScore(0);
      if (value === 1) {
        if (currentUserScore === 0) {
          setCurrentUserScore(1)
        } else [
          setCurrentUserScore(currentUserScore === -1 ? 1 : 0)
        ]
      }
      if (value === -1) {
        if (currentUserScore === 0) {
          setCurrentUserScore(-1)
        } else [
          setCurrentUserScore(currentUserScore === 1 ? -1 : 0)
        ]
      }
      if (isReply) {
        const result = await axiosFetch.post('/api/reactions/add-reply-score', data);
        if (result.status === 200) {
          return result
        }
      } else {
        const result = await axiosFetch.post('/api/reactions/add-comment-score', data);
        if (result.status === 200) {
          return result
        }
      }
    } catch (err) {
      setErr((err as Error).message);
    }
  }

  return (
    <section className='like-dislike-container'>
      {
        parseVal(currentScore)
      }
      <FontAwesomeIcon 
        size='lg'
        className='reaction-icon'
        icon={faThumbsUp}
        style={{color: currentUserScore > 0 ? '#3366FF' : '#FFF'}}
        onClick={async () => {
          if (username) {
            setTimeout(async () => {
              await updateScore(currentUserScore > 0 ? 0 : 1);
            }, 100)
          }
        }}
      />
      <FontAwesomeIcon
        size='lg'
        className='reaction-icon thumbs-down'
        icon={faThumbsDown}
        style={{color:  currentUserScore < 0 ? '#3366FF' : '#FFF'}} 
        onClick={async () => {
          if (username) {
            setTimeout(async () => {
              await updateScore(currentUserScore < 0 ? 0 : -1);
            }, 100)
          }
        }}
      />
      {
        err ? 
        <p className='small-text small-text-error'>{err}</p>:
        <></>
      }
    </section>
  )
}
