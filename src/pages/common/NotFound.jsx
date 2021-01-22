import React from 'react'

export default function NotFound(props) {
  return (
    <div>
      404 Not Found
      <p>
        <button onClick={
          () => {
            props.history.goBack()
          }
        }>返回</button>
      </p>
    </div>
  )
}

