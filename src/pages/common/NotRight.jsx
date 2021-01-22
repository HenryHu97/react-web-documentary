import React from 'react'
import { withRouter } from 'react-router-dom'


function NotRight(props) {
  console.log(props,'----------------')
  return (
    <div>
      没有访问权限
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

export default withRouter(NotRight)