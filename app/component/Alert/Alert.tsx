import React from 'react'
import './Alert.scss';

export default function Alert({
  alertMsg,
  alertState
}: {
  alertMsg: string
  alertState: boolean,
}) {
  if (alertState) {
  return (
    <h2
      className='alert-msg'
    >
      {alertMsg}
    </h2>
  )
  } else {
    return <></>
  }
}
