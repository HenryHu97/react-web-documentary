import crypto from 'crypto-js'

const KEY = '0123456789abcde'


// MD5加密用户密码
const enMD5Fun = str => {
  return crypto.MD5(str).toString()
}

// AES加密
const enAesFun = str => {
  let token = crypto.AES.encrypt(str, KEY).toString()
  return token
}


// AES解密
const deAesFun = str => {
  let token = crypto.AES.decrypt(str, KEY).toString(crypto.enc.Utf8)
  return token
}

// 显示时间
const dateFormat = (format, date) => {
  let _date = !!date ? new Date(date) : new Date(),
      yyyy = _date.getFullYear(),
      MM = _date.getMonth() + 1,
      dd = _date.getDate(),
      hh = _date.getHours(),
      mm = _date.getMinutes(),
      ss = _date.getSeconds()


      MM = MM > 9 ? MM : `0${MM}`
      dd = dd > 9 ? dd : `0${dd}`
      hh = hh > 9 ? hh : `0${hh}`
      mm = mm > 9 ? mm : `0${mm}`
      ss = ss > 9 ? ss : `0${ss}`
      
  let obj = {yyyy, MM, dd, hh, mm, ss}
  
      return format.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,key => obj[key])   

}



export {
  enMD5Fun,
  enAesFun,
  deAesFun,
  dateFormat
}