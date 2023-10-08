import React from 'react'
import './Box.scss';

export default function Box({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='box-container'>
      {children}
    </main>
  )
}