'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import "./Navbar.scss";
import Searchbar from '../Searchbar/Searchbar';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import axios from 'axios';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { loginUser } from '../redux/features/AuthSlice';
import { axiosFetch } from '../Axios/axios';
import { useRouter } from 'next/navigation';

interface AuthState {
  userData: {
    user: {
      isAuth: boolean;
      isAdmin: boolean;
      username: string;
      email?: string,
      uid?: string,
      userImage?: string;
    }
  }
}

export default function Navbar() {
  // const username = undefined;
  const { username } = useSelector((res:AuthState) => res.userData.user);
  const [err, setErr] = useState<string>(); 
  const [currentStoryId, setCurrentStoryId] = useState<string>();
  const { push } = useRouter(); 
  // const username =  await getUserData();
  // if (username) {
  //   dispatch(loginUser({username}))
  // }
  // useEffect(() => {
  //   dispatch(loginUser({username}))
  // }, [username])
//   useEffect(() => {
//     const abortController = new AbortController();
//     axios.get('http://localhost:5000/api/users/get-user-session', {
//       withCredentials: true
//     })
//       .then((res) => {
//         const {username:user} = res.data.userData;
//         console.log(user);
//         dispatch(loginUser({username: user}))
//         setUsername(user)
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//       return () => {
//         abortController.abort()
//       }
//       
//   }, [])
// 
  const openModal = () => {
    const login = document.getElementById('modal');
    if(login) login.style.display = 'flex';
  }
  const goRandomStory = async () => {
    try {
      const result = await axiosFetch.post('/api/story/random');
      if (result.status === 200) {
        const storyId = result.data.story.id;
        if (storyId === currentStoryId) {
          goRandomStory();
        } else {
          setCurrentStoryId(storyId);
          push(`/story/${storyId}`)
        }
      }
    } catch (err) {
      setErr((err as Error).message);
    }
  }


  return (
    <section
      className='tab-menu'
    >
      <nav>
        <Link href="/" >
          <Image
            src="/assets/ghosted_on_2.png"
            alt="ghost-jobs"
            className='ghost-logo'
            width={125}
            height={22}
          />
        </Link>
        <button
          className='hidden-btn'
          onClick={() => {
            const login = document.getElementsByClassName('mobile-searchbar')[0] as HTMLElement;
            if(login) login.style.display = 'flex';
          }}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-label='search button desktop'
            className='search-icon-mobile'
          />  
        </button>
        <div className='desktop-searchbar' id='desktop-searchbar'>
          <Searchbar inputType='desktop'/>
        </div>
      </nav>
      <div className='mobile-searchbar' id="mobile-searchbar">
        <button
          className='hidden-btn'
          onClick={() => {
            const login = document.getElementById('mobile-searchbar');
            if(login) login.style.display = 'none';
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className='arrow-icon'
            tabIndex={0}
            aria-label='search button mmobile'
          />
        </button>
        <Searchbar inputType='mobile' />
      </div>
      {
        <section className='desktop-links'>
          <Link href='/'>
            <p>Home</p>
          </Link>
          <Link href='/browse'>
            <p>Browse</p>
          </Link>
          {
            username ? 
            <Link href='/profile'>
              <p>Profile</p>
            </Link>:
            <></>
          }
          {
            username ? 
            <Link href='/new-story'>
              <p>Share</p>
            </Link>:
            <></>
          }
          {
          <button className='silent-btn' 
            onClick={goRandomStory}
          >
            Random
          </button>
          }
          {/*
            <Link href='/about-us'>
              <p>AI</p>
            </Link>
          */}
          {!username ? 
          <Link href='/about-us'>
            <p>About</p>
          </Link>:
          <></>
          }
        </section>
      }
      <nav>
        {
          username ? 
          <></>:
          <button
            id='login-btn-desktop'
            className='std-button std-button-dark-grey'
            onClick={openModal}
          >
            Login
          </button>
        }
        <DropdownMenu />
      </nav>
    </section>
  )
}

