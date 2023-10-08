'use client';
import React, { FormEvent, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation';

import './Searchbar.scss'

export default function Searchbar({
  inputType
}:{
  inputType: string
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current === undefined || inputRef.current === null || inputRef.current.value === '') return;
    // console.log(inputRef.current?.value);
    push(`/search/${inputRef.current?.value}`)
  }
  return (
    <form
      className={`search-jobs search-jobs-${inputType}`}
      onSubmit={onSubmit}
    >
      <input
        ref={inputRef}
        placeholder='Search stories'
        className={`search-input search-input-${inputType}`}
      />
      <button>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon' />
      </button>
    </form>
  )
}
