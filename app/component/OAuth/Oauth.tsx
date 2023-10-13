
import Image from 'next/image';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGoogleLogin } from '@react-oauth/google'
import { faGoogle, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Oauth.scss';
import axios from 'axios';

// const BASE_URL = 'http://localhost:3000'
// const BASE_URL = 'https://ghost-jobs-e674172156d1.herokuapp.com'; 
const BASE_URL = 'https://server.ghostedon.com';
export default function Oauth({
  company,
}: {
  company: 'Google'|'Twitter'|'Linkedin',
}) {

  const iconBrand = () => {
    switch (company) {
      case 'Google': 
        return faGoogle;
      case 'Twitter':
        return faTwitter;
      case 'Linkedin':
        return faLinkedin;
      default:
        return faGoogle;
    }
  }
  const brand = iconBrand();

  const googleAuth =() => {
		window.open(
			`${BASE_URL}/auth/google`,
			"_self"
		);
  }
  const twitterAuth = () => {
    console.log('Twitter Time!')
  }
  const linkedinAuth = () => {
    console.log('Linkedin Time')
  }
  const oauthCheck = () => {
    switch (company) {
      case 'Google': 
        googleAuth();
        break;
      case 'Twitter':
        twitterAuth();
        break;
      case 'Linkedin':
        linkedinAuth();
        break;
      default:
        break;
    }
  }

  return (
    <button
      onClick={oauthCheck}
      className='std-button std-button-long std-button-brand'
      type='button'
    >
      <FontAwesomeIcon icon={brand}/>
      Continue With {company}
    </button>
  )
};

