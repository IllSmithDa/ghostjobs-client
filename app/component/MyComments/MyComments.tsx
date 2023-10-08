'use client';
import React, { useEffect, useState} from 'react'
import './MyComments.scss';
import { axiosFetch } from '../Axios/axios';
import { Comment, Reply } from '../Types';
import Modal from '../Modal/Modal';
import DropDownAll from '../DropDownAll/DropDownAll';
import Link from 'next/link';
import Loader from '../Loader/Loader';
import ModalAll from '../ModalAll/ModalAll';

//change to server side later maybe
export default function MyComments({ username } : {
  username: string
}) {
  const [offset, setOffset] = useState(0);
  const [initloading, setInitLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [comments, setComments] = useState<(Comment) []>([]);
  const [commentId, setCommentId] = useState<string>('');
  const [commentDelOn, setCommentDelOn] = useState(false);
  const [commentRefId, setCommentRefId] = useState<string>();
  const [isReply, setIsReply] = useState(false);
  const [err, setErr] = useState<string>('');

  const limit = 10;
  useEffect(() => {
    // https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
    let controller = new AbortController();
    const fetchMyStories = async () => {
      try {
        console.log(username)
        const res = await axiosFetch.get(`/api/story/my-comments/${username}/${offset}/${limit}`);
        setOffset(offset => offset + limit);
        console.log(res.data.comments);
        setComments([...res.data.comments]);
      } catch (err) {
        setErr((err as Error).message)
      } finally {
        setInitLoading(false);
      }
    }
    if(username) {
      fetchMyStories();
    }
    return () => controller?.abort();
  }, [username]);
  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.get(`/api/story/my-comments/${username}/${offset}/${limit}`)
        if (res.status === 200) {
          console.log(res.data.comments);
          setOffset(offset => offset + 7);
          if (res.data.comments.length) {
            setComments([...comments, ...res.data.comments])
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

  const deleteComment = async (modalId: string) => {
    try {
      const data = {
        commentId,
        isReply,
      }
      const res = await axiosFetch.post(`/api/story/delete-comment/`, data);
      if (res.status === 200) {
        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments([...updatedComments]);
        setCommentDelOn(false);
      }
    } catch  {
      setErr('Error: Sever is not responding. Contact an adminstrator for addtional ')
    }

  }
  const closeDropdown = (dropdownId: string) => {
    const position = document.getElementById(`dropdown-comment-${commentId}`);
    if(position) position.style.position = 'static';
    const dropdownContent = document.getElementById(dropdownId);
    if (dropdownContent) dropdownContent.style.display = 'none';
    const content = document.getElementById('generic-dropdown-modal');
    if (content) content.style.display = 'none';
  }
  return (
    <section className='my-comments-cont'>
      {
        commentDelOn ? 
        <ModalAll 
          modalId='delete-comments'
          closeAllModals={() => {
            setCommentDelOn(false);
          }}
          sizeClass='small-dimensions'
        >
          <h3>Are you sure you wish to delete your comment?</h3>
          <button
            className='std-button std-button-small std-button-right'
            onClick={async() => deleteComment('delete-comments')}
          >
            Yes
          </button>
          <button
            className='std-button std-button-small std-button-right'
            onClick={() => setCommentDelOn(false)}
          >
            No
          </button>
        </ModalAll>:
        <></>
      }
      {
        !comments.length && !initloading? 
        <article className='empty-story'>
          <h2>No Comments made yet</h2>
        </article>:
        <>
          {
          comments?.map((comment) => {
            return (
              <article key={comment.id} className='item-card'>
                <section>
                  <h3 style={{ margin: 0 }}>{comment.storytitle}</h3>
                  <DropDownAll 
                    dropdownId={`comment-${comment.id}`}
                    buttonName='Actions &#11167;'
                  >
                    <button
                     className='action-menu-btn'
                     onClick={() => {
                      // console.log('asdfdsa')
                      setCommentId(comment.id);
                      setIsReply(comment.isreply)
                      setCommentDelOn(true);
                     }}
                    >
                      Delete
                    </button>
                  </DropDownAll>
                </section>
                <h4 style={{ marginTop: 0 }}>{comment.text}</h4>
                <Link href={`/story/${comment.storyid}`} className='link-btn link-btn-small link-btn-dark-grey'> 
                  Read 	&#8594;
                </Link>
            </article>
            )
          })
        }
        </>
      }
      {
        err !== ''  ? 
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
