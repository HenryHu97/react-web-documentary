import { SET_TOKEN, SET_USER_INFO, SET_USER_MENU } from '../action/types'

let cache = sessionStorage.getItem('common-reducer-cash') || '{}'
cache = JSON.parse(cache)

const initData = {
  token: cache.token || '',
  userInfo: cache.userInfo || {},
  menu: cache.menu || []
}

export default (state = initData, action) => {

  let obj = null

  // console.log(action)
  switch (action.type) {
    case SET_TOKEN :
      obj = {
        ...state,
        token: action.token
      }
      sessionStorage.setItem('common-reducer-cash', JSON.stringify(obj))
      return obj
    case SET_USER_INFO :
      obj = {
        ...state,
        userInfo: action.userInfo
      }
      sessionStorage.setItem('common-reducer-cash', JSON.stringify(obj))
      return obj
    case SET_USER_MENU :
      obj = {
        ...state,
        menu: action.menu
      }
      sessionStorage.setItem('common-reducer-cash', JSON.stringify(obj))
      return obj
    default :
      return {...state}
  }
}