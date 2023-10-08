'use client';
import React, { use, useEffect, useState} from 'react'
import { comments } from '@/app/testdata/testcomments'
import { axiosFetch } from '../Axios/axios';
import Loader from '../Loader/Loader';
import PostComment from '../PostComment/PostComment';
import Replies from '../Replies/Replies';
import PostReply from '../PostReply/PostReply';
import "./Comments.scss";
import { CommentLike } from '../Types';
import LikeDislike from '../LikeDislike/LikeDisLike';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import DropDownAll from '../DropDownAll/DropDownAll';
import ReportForm from '../ReportForm/ReportForm';

interface Reply {
  id: string,
  commentIdRef: string,
  username: string,
  userImage: string,
  score: number,
  replyText: string,
  storyTitle: string,
  storyId: string,
}

interface Comment {
  id: string,
  username: string,
  text: string, 
  score: string, 
  userImage ?: string,
  replies: Reply[]
}

export default function Comments({
  storyId,
  storyTitle,
  username,
}: {
  storyId: string,
  storyTitle: string,
  username: string,
}) {
  const [err, setErr] = useState<string>();
  const [comments, setComments] = useState<Comment []>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true); 
  const [reachedEnd, setReachedEnd] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [repliesOff, setRepliesOff] = useState(false);
  const [commentReactions, setCommentReactions] = useState<CommentLike []>([])
  const [reportFormOn, setReportFormOn] = useState('');
  const limit = 7;

  useEffect(() => {
    const fetchLikesDislikes = async () => {
      console.log(`username ${username}`)
      try {
        if (username) {
          const res = await axiosFetch.get(`/api/reactions/comment-reactions/${username}`);
          if (res.status === 200) {
            setCommentReactions(res.data.reactions)
            console.log(res.data.reactions);
            setTimeout(() => {
              setInitLoading(false);
            }, 100)
          }
        } else {
          setInitLoading(false);
        } 
      } catch (err) {
        setErr((err as Error).message);
      }
    } 
    const fetchComments = async () => {
      try {
        const res = await axiosFetch.get(`/api/story/comments/${storyId}/${offset}/${limit}`);
        if (res.status === 200) {
          console.log(res.data.comments);
          setComments([...res.data.comments])
          setOffset(val => val + limit);
          setTimeout(() => {
            fetchLikesDislikes();
          }, 1000)
        }
      } catch (err) {
        setErr((err as Error).message);
      }
    }  

    if (storyId) {
      fetchComments();
    }
    // if (username) {
    //   fetchLikesDislikes();
    // }
  }, [storyId, username])

  const updateComments = (comment: Comment) => {
    setIsUpdating(true)
    setComments([comment, ...comments]);
    setTimeout(() => {
      setIsUpdating(false);
    }, 100)
  }
  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      // console.log(offset)
      setIsLoading(true);
      try {
        const res = await axiosFetch.get(`/api/story/comments/${storyId}/${offset}/${limit}`)
        if (res.status === 200) {
          setOffset(offset => offset + limit);
          console.log(comments);
          console.log(res.data.comments)
          if (res.data.comments.length) {
            setComments([...comments, ...res.data.comments])
          } else {
            setReachedEnd(true);
          }
        }
      } catch (err) {
        setErr((err as Error).message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100)
      }
    }
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
        return;
      }
      if (reachedEnd === false) setTimeout(async () => { await fetchData()}, 1000)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);
  const turnOffReplies = () => {
    setRepliesOff(true);
    setTimeout(() => {
      setRepliesOff(false);
    }, 500)
  }

  //https://masteringjs.io/tutorials/fundamentals/foreach-break
  const checkCommentScore = (commentId: string) => {
    let score: number = 0;
    // console.log(commentId);
    // console.log(commentReactions);
    commentReactions.every((reaction) => {
      if (commentId === reaction.commentid) {
        score = Number(reaction.score);
        return false;
      }
      return true;
    })
    return score;
  }

  const renderComments = () => comments.map((comment:Comment) => (
    <>
      <article>
        <section className='ellipsis-section'>
          <p key={comment.id}>{comment.username }: {comment.text}</p>
          {/* <button>...</button> */}
          <DropDownAll
            buttonName='&#65049;'
            dropdownId={`ellipsis-${comment.id}`}
            btnClass='ellipsis-btn'
            positionY='34px'
          >
            <button onClick={() => {
              setReportFormOn(comment.id)
            }}>Report</button>
          </DropDownAll>
        </section>
        <LikeDislike
          storyId={storyId}
          score={Number(comment.score)} 
          myScore={checkCommentScore(comment.id)}
          commentId={comment.id}
          username={username}
          isReply={false}
          />
      </article>
      {
        reportFormOn === comment.id? 
        <ReportForm
          reportType='comment'
          username={comment.username}
          contentId={comment.id}
          clearReport={() => { setReportFormOn(''); }}
        />:
        <></>
      }
      <Replies
        storyId={storyId}
        storyTitle={storyTitle}
        commentId={comment.id}
        replies={comment?.replies?.length ? comment.replies : []}
        username={username}
        setRepliesoff={repliesOff}
        commentReactions={commentReactions}
      />
    </>
  ))

  return (
    <section className='comments-container'>
      <PostComment 
      storyTitle={storyTitle}
      storyId={storyId} 
      updateComments={updateComments} 
      turnOffReplies={turnOffReplies}/>
      <h1>Comments</h1>
      {
        !comments.length && !initLoading?
        <p>
        No Comments Yet
      </p>:
        <>
        {
          isUpdating || initLoading? <></>:
          <>{renderComments()}</>
        }
        </>
      }
      {
        err !== '' && !initLoading ? 
        <h3 
          className='small-text small-text-error'
        >
          {err}
        </h3>:
        <></>
      }
      {
        isLoading ? 
        <Loader />:
        <></>
      }
    </section>
  )
}
