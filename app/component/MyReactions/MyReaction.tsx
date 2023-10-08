import React, {useEffect, useState} from 'react';
import { IconDefinition, faAngry, faFaceSadCry, faHeart, faLaugh, faMagnifyingGlass, faSadCry, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { axiosFetch } from '../Axios/axios';
import { StoryReaction } from '../Types';
import './MyReactions.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const storyReactions:{[key: string]: IconDefinition} = {like: faThumbsUp, heart: faHeart, funny:faLaugh, angry: faAngry, dislike: faThumbsDown, sad: faFaceSadCry};

const reactionColor:{[key: string]: string} = {'like': '#3366FF', 'heart': '#ee1111', 'funny':'#eeee11', 'angry': '#DD6666', 'dislike': '#3366FF', 'sad': '#6666FF'};

export default function MyReactions({
  username,
}: {
  username: string,
}) {
  const [offset, setOffset] = useState(0);
  const [reactions, setReactions] = useState<StoryReaction[]>([]);
  const [err, setErr] = useState('');
  const [initLoading, setInitLoading] = useState(true);

  const limit = 10;
  useEffect(() => {
        // https://hackernoon.com/cleanup-functions-in-reacts-useeffect-hook-explained
        let controller = new AbortController();
        const fetchMyStories = async () => {
          try {
            console.log(username)
            const res = await axiosFetch.get(`/api/story/story-reactions/${username}/${offset}/${limit}`);
            setOffset(offset => offset + limit);
            console.log(res.data.reactions);
            setReactions([...res.data.reactions]);
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
  }, [username])

  const renderReactions = reactions.map((reaction:StoryReaction) => (
      <article key={reaction.id} className='item-card'>
        <h3>{reaction.storytitle}</h3>
        <h4>{reaction.storyauthor}</h4>
        <section>
          <FontAwesomeIcon 
            icon={storyReactions[reaction.reaction]} 
            className='std-icon' 
            style={{ color: reactionColor[reaction.reaction]}}
          />
          <Link href={`/story/${reaction.storyid}`} className='link-btn link-btn-small link-btn-dark-grey'> 
            Read 	&#8594;
          </Link>
        </section>
      </article>
    ))
 
  return (
    <section className='my-reactions-cont'>
      {
        !reactions.length && !initLoading? 
        <article className='empty-reaction'>
        <h2>No Reactions made yet</h2>
      </article>:
        <>
          {renderReactions}
        </>
      }
    </section>
  )
}
