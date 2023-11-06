import React, { useEffect, useState } from 'react'
import './Replies.scss';
import PostReply from '../PostReply/PostReply';
import LikeDislike from '../LikeDislike/LikeDisLike';
import { CommentLike } from '../Types';
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

export default function Replies(
  {
    replies,
    storyId,
    storyTitle,
    commentId,
    username,
    setRepliesoff,
    commentReactions,
  }: 
  {
  replies: Reply[],
  storyId: string,
  storyTitle: string,
  commentId: string,
  username: string,
  setRepliesoff: boolean,
  commentReactions: CommentLike []
}) {
  const [allReplies, setAllReplies] = useState(replies);
  const [replyCount, setReplyCount] = useState(allReplies.length);
  const [hiddenReplies, setHiddenReplies] = useState(true);
  const [shownReplies, setShownReplies] = useState<Reply []>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const [postReply, setPostReply] = useState(false);
  const [reportFormOn, setReportFormOn] = useState('');
  const offset = 10;

  const handleShowReplies = () => {
    const tempArr = allReplies.slice(currentCount, currentCount + offset);
    setShownReplies([...shownReplies, ...tempArr]);
    setCurrentCount(currentCount => currentCount + offset);

    if (currentCount + offset >= replyCount) setEndReached(true);
    if (hiddenReplies) setHiddenReplies(false);
  }
  const updateReplies = (reply: Reply) => {
    // console.log(reply)
    setAllReplies([...allReplies, reply]);
    setShownReplies([...allReplies, reply]);
    setReplyCount(replyCount => replyCount + 1)
    setCurrentCount(allReplies.length + 1);
    setHiddenReplies(false);
  }
  const cancelReply = () => {
    setPostReply(false);
  }
  const hideReplies = () => {
    setShownReplies([]);
    setCurrentCount(0);
    setHiddenReplies(true);
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

  useEffect(() => {
    if (setRepliesoff) {
      setPostReply(false);
    }
  }, [setRepliesoff])

  const renderMode = () => {
    if (hiddenReplies) {
      return <>{
        replyCount == 1 ?
        <button
          className='reply-cont reply-cont-btn'
          onClick={handleShowReplies}
        >
          Show Reply
        </button>:
        <button
          className='reply-cont reply-cont-btn'
          onClick={handleShowReplies}
        >
          {replyCount} replies
        </button>   
      }</>
    } else {
      return (
        <>
          {
            shownReplies.map((reply) => {
              return (
                <article
                  className='reply-cont'
                >
                  <section className='ellipsis-section'>
                    <p key={reply.id}>{reply.username }: {reply.replyText}</p>
                    {/* <button>...</button> */}
                    <DropDownAll
                      buttonName='&#65049;'
                      dropdownId={`ellipsis-${reply.id}`}
                      btnClass='ellipsis-btn'
                      positionY='34px'
                    >
                      <button onClick={() => {
                        setReportFormOn(reply.id)
                      }}>Report</button>
                    </DropDownAll>
                  </section>
                  <LikeDislike
                    score={Number(reply.score)} 
                    myScore={checkCommentScore(reply.id)}
                    commentId={reply.commentIdRef}
                    username={username}
                    isReply={true}
                    replyId={reply.id}
                    storyId={storyId}
                  />
                  {
                    reportFormOn === reply.id? 
                    <ReportForm
                      reportType='story'
                      username={reply.username}
                      contentId={reply.id}
                      commentId={reply.commentIdRef}
                      clearReport={() => { setReportFormOn(''); }}
                    />:
                    <></>
                  }
                </article>
              )
            })
          }{
            endReached === false ? 
            <button
            className='reply-cont reply-cont-btn'
            onClick={handleShowReplies}
          >
            Show More Replies
          </button>:
          <></>
          }
          <button
            className='reply-cont reply-cont-btn'
            onClick={hideReplies}
          >
            Hide replies
          </button>
        </>
      )
    }
  }

  return (
    <>
    {
      username ? 
      <section
        className='post-section'
      >
        {
          postReply ?
          <PostReply
            storyId={storyId} 
            storyTitle={storyTitle}
            commentId={commentId}
            updateReplies={updateReplies}
            cancelReply={cancelReply}
          />:
          <button
            className='reply-button'
            onClick={() => setPostReply(true)}
          >
            Reply &#187;
          </button>
        }
      </section>:
      <></>
      }
      {
        allReplies.length ? 
        renderMode():
        <></>
      }
    </>
  )
}
