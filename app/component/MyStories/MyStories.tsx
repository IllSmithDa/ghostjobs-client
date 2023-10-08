import React, { useEffect, useState } from 'react'
import { AuthState, Story } from '../Types'
import Link from 'next/link'
import Tags from '../Tags/Tags'
import './MyStories.scss';
import DropDownAll from '../DropDownAll/DropDownAll';
import { axiosFetch } from '../Axios/axios';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import EditStories from '../EditStories/EditStories';
import ModalAll from '../ModalAll/ModalAll';

export default function MyStories() {
  const [selectStory, setSelectStory] = useState<Story>();
  const [stories, setStories] = useState<Story[]>([]);
  const { username } = useSelector((res:AuthState) => res.userData.user);
  const [mode, setMode] = useState<'edit'|'delete'|'none'>('none');
  const [storyBody, setStoryBody] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const limit = 7;
  const [err, setErr] = useState<string>();


  const closeAllModals = () => {
    setMode('none');
  }
  const deleteStory = async (modalId: string) => {
    try {
      const res = await axiosFetch.delete(`/api/story/delete-story/${selectStory?.id}`);
      if (res.status === 200) {
        const updatedStories = stories.filter((story) => story.id !== selectStory?.id);
        setStories([...updatedStories]);
        closeAllModals();
      }
    } catch  {
      setErr('Error: Sever is not responding. Contact an adminstrator for addtional ')
    }
  }

  const updateStories = (updatedId:string, text:string, title:string, tags: string) => {
    const updatedStories = [...stories];
    const updatedStory = updatedStories.find(story => story.id === updatedId);
    if (updatedStory) {
      updatedStory.text = text ?? '';
      updatedStory.title = title ?? '';
      updatedStory.tags = tags ??  '';
    }
    setStories(updatedStories);
  }

  useEffect(() => {
    // https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
    let controller = new AbortController();
    if (username) {
      const fetchMyStories = async () => {
        try {
          setInitLoading(true);
          const res = await axiosFetch.get(`/api/story/stories/${username}/${offset}/${limit}`);
          setOffset(offset => offset + limit);
          setStories([...res.data.stories]);
        } catch (err) {
          setErr((err as Error).message)
        } finally {
          setInitLoading(false);
        }
      }
      fetchMyStories();
    }
    return () => controller?.abort();
  }, [username, limit])

  const fetchStoryBody = async (storyId: string) => {
    try {
      const res = await axiosFetch.get(`/api/story/get-text/${storyId}`)
      if (res.status === 200) {
        console.log(res.data);
        setStoryBody(res.data.text)
      }
    } catch (err) {
      setErr((err as Error).message);
    }
  }
  
  useEffect(() => {
    // https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosFetch.post(`/api/story/by-date/${offset}/${limit}`)
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


  return (
    <section className='story-my-container'>
      {
        mode === 'delete' ? 
        <ModalAll 
          modalId='delete-actions'
          closeAllModals={closeAllModals}
          sizeClass='small-dimensions'
        >
          <h3>Are you sure you wish to delete you story?</h3>
          <button
            className='std-button std-button-small std-button-right'
            onClick={async() => deleteStory('delete-actions')}
          >
            Yes
          </button>
          <button
            className='std-button std-button-small std-button-right'
            onClick={() => setMode('none')}
            style={{ marginLeft: '1rem' }}
          >
            No
          </button>
        </ModalAll>:
        <></>
      }        
      {
        mode === 'edit' ? 
        <ModalAll 
          modalId='edit-story-modal'
          closeAllModals={closeAllModals}
          sizeClass='default-dimensions'
        >
          <EditStories 
            title={selectStory?.title ?? ''}
            body={storyBody ?? ''}
            tags={(selectStory?.tags as string) ?? ''}
            storyId={selectStory?.id ?? ''}
            closeAllModals={closeAllModals}
            updateStories={updateStories}/>
        </ModalAll>:
        <></>
      }
      {
        !stories.length && !initLoading? 
        <article className='empty-story'>
          <h2>No Stories made yet</h2>
          <Link className='link-btn link-btn-medium link-btn-dark-grey' href='/new-story'>Create Story</Link>
        </article>:
        <>
          {
          stories?.map((story) => {
            return (
              <article key={story.id} className='item-card'>
                <section>
                  <h3>{story.title}</h3>
                  <DropDownAll 
                    dropdownId={`story-${story.id}`}
                    buttonName='Actions &#11167;'
                  >
                    <button
                      type='button'
                      className='action-menu-btn'
                      onClick={async () => {
                        setSelectStory(story);
                        await fetchStoryBody(story.id);
                        setMode('edit');
                      }}                    
                    >
                      Edit
                    </button>
                    <button
                     className='action-menu-btn'
                     onClick={() => {
                      setSelectStory(story);
                      setMode('delete');
                     }}
                     type='button'
                    >
                      Delete
                    </button>
                  </DropDownAll>
                </section>
                { story.tags !== '' ?
                <p className='story-tag'>{(story.tags as string)}</p>:
                <p className='story-tag'>N/A</p>
                }
                <Link 
                  href={`/story/${story.id}`}
                  className='link-btn link-btn-small link-btn-dark-grey'
                  style={{ marginTop: '2rem' }}  
                > 
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
