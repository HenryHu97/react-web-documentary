import React, { Component } from 'react'
import { userInfoApi, userLoginApi, userMenuApi, autoLoginApi, getUserRoleApi } from '../../apis/userApi' 
import { setTokenAct, setUserInfo, setUserMenu } from '../../store/action/commonAction'
import { connect } from 'react-redux'

// 引入样式文件
import '../../style/login.less'
// 引入icon图标
import { UserOutlined, LockOutlined } from '@ant-design/icons'

// 引入ant-design组件
import { Button, Input, Checkbox, Spin, message } from 'antd'

// 引入crypto加密解密方法
import { deAesFun, enAesFun, enMD5Fun } from '../../util'




@connect(state => state)
class Login extends Component {

  state = {
    userId : '',
    userPwd : '',
    rememberPwd: false,
    noLogin: false,
    loading: true
  }

  async componentDidMount () {
    let token = localStorage.getItem('auto-login-key')
    if(!!token) {
      token = deAesFun(token)
      this.props.dispatch(setTokenAct(token))

      let result = await autoLoginApi()
      if (result.code !== 200) {
        localStorage.removeItem('auto-login-key')
        this.handleRememberEvt()
      } else {
        this.setState({noLogin: true, rememberPwd: !!localStorage.getItem('remember-user-key')})
        this.handleUserRole(result.data, token)
      }
    } else {
      this.handleRememberEvt()
    }
  }

  //勾选记住密码后，进入页面初始化密码和ID
  handleRememberEvt () {
    let remember = localStorage.getItem('remember-user-key')
    if(!!remember) {
      remember = deAesFun(remember)
      remember = remember.split('&&&')
      console.log(remember)
      this.setState({
        userId: remember[0],
        userPwd: remember[1],
        rememberPwd: true
      })
    }
    this.setState({loading: false})
  }




  // 登录方法
  async loginEvt () {
    let obj = {
      id: this.state.userId,
      password: enMD5Fun(this.state.userPwd)
    }

    this.setState({loading: true})
    const res = await userLoginApi(obj)
    if(res.code === 200 && res.data === null) {
      message.error('用户登录失败，请重试！')
      this.setState({loading:false})
      return
    }

    // 如果没有勾选7天免登陆则把token存到store中，否则把token存入localStorage中
    this.props.dispatch(setTokenAct(res.data.token))

 
    //请求用户信息
    let userInfo = await userInfoApi(res.data.id)
    if(userInfo.code === 200 && res.data === null) {
      message.error('登录失败')
      this.setState({loading: false})
      return
    }

    this.handleUserRole(userInfo.data, res.data.token)

  }

  // 处理用户权限
  makeUserRole (_role, _newRole, index, callback) {
    

    for (let roleItem of _role[index].menu) {
      let _hasIndex = _newRole.findIndex(item => item.id === roleItem.id)
      if (_hasIndex < 0) {
        _newRole.push(roleItem)
      } else {
        let _set = new Set(_newRole[_hasIndex].role.concat(roleItem.role))
        _newRole[_hasIndex].role = Array.from(_set)
      }
    }

    ++index
    if(_role.length <= index) {
      callback(_newRole)
    } else {
      this.makeUserRole(_role, _newRole, index, callback)
    }
    
  }

  async handleUserRole(userInfo, token) {

    //储存用户信息
    this.props.dispatch(setUserInfo(userInfo))

    // 获取用户权限
    let userRole = await getUserRoleApi(userInfo.role)
    if(userRole.code !== 200) {
      message.error('获取用户权限失败，请重试！')
      return
    }
    let _role = userRole.data.rows
    
    this.makeUserRole(_role, [], 0, async data => {

      //获取并储存首页菜单数据
      let userMenu = await userMenuApi()

      userMenu.data.map(item => {
        let obj = data.find( oo => oo.id === item.id)
        if(!obj) {
          item.role = ''
        } else {
          item.role = obj.role.join('')
        }
        return item
      })

      this.props.dispatch(setUserMenu(userMenu.data))


      this.setState({loading: false})

      //判断是否勾选7天免登陆，有则重置token，没有则清除token
      if (this.state.noLogin) {
        localStorage.setItem('auto-login-key', enAesFun(token))
      } else {
        localStorage.removeItem('auto-login-key')
      }

      //判断是否勾选记住密码
      if (this.state.rememberPwd) {
        localStorage.setItem('remember-user-key', enAesFun(this.state.userId + '&&&' + this.state.userPwd))
      } else {
        localStorage.removeItem('remember-user-key')
      }

      this.props.history.push('/home')
    })




    

  }

  render() {
    return (
      <div className='login-container'>
        <Spin spinning={this.state.loading}>
          <p>贸易跟单系统</p>
          <Input placeholder='请输入用户名' prefix={<UserOutlined/>} value={this.state.userId} onChange={
            e => {
              this.setState({userId : e.target.value})
            }
          } />
          <Input placeholder='请输入密码' prefix={<LockOutlined/>} value={this.state.userPwd} onChange={
            e => {
              this.setState({userPwd : e.target.value})
            }
          } />
          <Checkbox checked={this.state.rememberPwd} onChange={
            e => 
            {
              this.setState({rememberPwd: e.target.checked})
            }
          }>记住密码</Checkbox>
          <Checkbox checked={this.state.noLogin} onChange={
            e => {
              this.setState({noLogin: e.target.checked})
            }
          }>七天免登陆</Checkbox>
          <Button type='primary' block onClick={this.loginEvt.bind(this)}>登录</Button>
        </Spin>
      </div>
      
    )
  }
}

export default Login
// export default connect(state => state)(Login)
