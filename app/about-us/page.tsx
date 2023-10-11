import React from 'react'
import './AboutUs.scss'
import { ghostjobs } from '../testdata/testInfo'
export default function page() {
  return (
    <section
      className='about-page'
    >
      <h2>Why GhostedOn?</h2>
      <p>{ghostjobs.info}</p>
      <h2>Purpose of these Ghost Jobs?</h2>
      <p>{ghostjobs.purpose}</p>
      <h2>What are some signs of Ghost Jobs?</h2>
      <>{ghostjobs.expandedInfo.map((info, index) => {
        return (
        <p>{index + 1}. {info}</p>
        )
      })}</>
    </section>
  )
}
