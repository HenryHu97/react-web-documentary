import { SET_TOKEN, SET_USER_INFO, SET_USER_MENU } from './types'

export const setTokenAct = token => ({type: SET_TOKEN, token})

export const setUserInfo = userInfo => ({type: SET_USER_INFO, userInfo})

export const setUserMenu = menu => ({type: SET_USER_MENU, menu})