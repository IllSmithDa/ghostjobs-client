import React from 'react'
import "./Loader.scss";

export default function Loader({
  loadingMsg,
  width,
}: {
  loadingMsg ?: string,
  width ?: number
}) {
  return (
    <section
      className='loading-container'
      style={{ width }}
    >
      <h2>{loadingMsg}</h2>
      <div className='loader'></div>
    </section>
  )
}
