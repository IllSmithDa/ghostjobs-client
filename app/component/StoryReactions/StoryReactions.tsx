import { faAngry, faFaceSadCry, faHeart, faLaugh, faMagnifyingGlass, faSadCry, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import './StoryReactions.scss';
import { axiosFetch } from '../Axios/axios';
import Loader from '../Loader/Loader';


const storyReactions = {'like': 0, 'heart': 0, 'misleading': 0, 'funny':0, 'spam': 0, 'angry': 0, 'confused': 0, 'dislike': 0, 'sad': 0};

export default function StoryReactions(
  {
    reactions,
    storyId,
    username,
    myStoryReaction,
    storyTitle,
    storyAuthor,
  }: {
  reactions: {[key: string]: number},
  storyId: string,
  username: string,
  myStoryReaction: string,
  storyTitle:string,
  storyAuthor:string,
}) {
  const [allReactions, setAllReactions] = useState(reactions);
  const [myReaction, setMyReaction] = useState( myStoryReaction ? myStoryReaction : 'none');
  const [newReaction, setNewReaction] = useState(myStoryReaction === 'none' ? true  : false)
  console.log(myStoryReaction);
  const [err, setErr] = useState<string>();

  const updateReaction = async (reaction:string, oldReaction : string) => {
    const data = {
      username,
      myReaction: reaction,
      storyId,
      newReaction,
      oldReaction,
      storyTitle,
      storyAuthor,
    }
    try {
      console.log(data);
      const result = await axiosFetch.post(`/api/story/reaction/create-reaction`, data)
      if (result.status === 200) {
        if (oldReaction === '') {
          setNewReaction(false);
          setAllReactions({
            ...allReactions,
            [reaction]: allReactions[reaction] + 1,
          })
        } else {
          setAllReactions({
            ...allReactions,
            [reaction]: allReactions[reaction] + 1,
            [oldReaction]: allReactions[oldReaction ?? ''] - 1,
          })

        }
        setMyReaction(reaction);
      }
      // console.log(result.data)
    } catch (err) {
      setErr((err as Error).message);
    }
  }
  
  const deleteReaction = async (reaction:string) => {
    try {
      const result = await axiosFetch.delete(`/api/story/reaction/delete/${username}/${storyId}`)
      if (result.status === 200) {
        setNewReaction(true);
        const newScore = allReactions[reaction] - 1;
        console.log(`score ${newScore}`)
        setAllReactions({
          ...allReactions,
          [reaction]: newScore
        })
      }
    } catch (err) {
      setErr((err as Error).message);
    }
  }

  const handleReaction = async (reaction:string) => {
    if (!username) return;
    const oldReaction = myReaction;
    if (reaction === myReaction) {
      setMyReaction('none');
      deleteReaction(reaction);
    } else {
      setMyReaction(reaction);
      await updateReaction(reaction, oldReaction === 'none' ? '' : oldReaction);
    }
  }

  return (
    <section className='reaction-container'>
      {myReaction ?
      <ul>
        <li>
          <FontAwesomeIcon 
            icon={faThumbsUp} 
            className='std-icon' 
            style={{ color: myReaction === 'like' ? '#3366FF':'#fff'}}
            onClick={() => { handleReaction('like') }}
          />
          <p>{allReactions.like}</p>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faHeart}
            className='std-icon'
            style={{ color: myReaction === 'heart' ? '#ee1111':'#fff'}}
            onClick={() => { handleReaction('heart') }}
          />
          <p>{allReactions.heart}</p>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faLaugh}
            className='std-icon'
            style={{ color: myReaction === 'funny' ? '#eeee11':'#fff'}}
            onClick={() => { handleReaction('funny') }}  
          />
          <p>{allReactions.funny}</p>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faThumbsDown}
            className='std-icon'
            style={{ color: myReaction === 'dislike' ? '#3366FF':'#fff'}}
            onClick={() => { handleReaction('dislike') }}    
          />
          <p>{allReactions.dislike}</p>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faAngry}
            className='std-icon'
            style={{ color: myReaction === 'angry' ? '#DD6666':'#fff'}}
            onClick={() => { handleReaction('angry') }}    
          />
          <p>{allReactions.angry}</p>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faSadCry}
            className='std-icon'
            style={{ color: myReaction === 'sad' ? '#6666FF':'#fff'}}
            onClick={() => { handleReaction('sad') }}  
          />
          <p>{allReactions.sad}</p>
        </li>
      </ul>:
      <Loader />
    }
    </section>
  );
}
