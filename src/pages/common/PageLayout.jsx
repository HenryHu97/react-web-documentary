import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateUserApi } from '../../apis/userApi'


import { Button, Menu, Dropdown, Modal, Input, Spin, message } from 'antd'
import { 
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  OneToOneOutlined,
  MailOutlined,
  DownOutlined
 } from '@ant-design/icons'

import '../../style/page.less'


// 从Menu引入二级标题
const { SubMenu, Item } = Menu 

const blankPath = ['/', '/login', '/404', '/403']

const mapStateToProps = (state) => {
  return {
    userInfo: state.common.userInfo,
    menu: state.common.menu
  }
}





@connect(mapStateToProps)
@withRouter
class PageLayout extends Component {

  state = {
    expend: true,
    menuList: [],
    menuIcon: {
      home: <MailOutlined />,
      project: <OneToOneOutlined />,
      purchase: <PieChartOutlined />,
      receiving: <DesktopOutlined />,
      menu: <ContainerOutlined />
    },
    selectKey: '',
    openKey: '',
    pageType: 'blank',
    currentPosition: '',
    showUserUpdateModal: false,
    userPassword: '',
    confirmPassword: '',
    userUpdateLoading: false
  }

  componentDidMount() {
    
    this.resetMenu()
    this.setPageType()
  }

  componentDidUpdate (preProps) {
    if(this.props.location.pathname !== preProps.location.pathname) {
      this.resetMenu()
      this.setPageType()
    }
  }


  resetMenu () {
    let list = this.props.menu.filter(item => !item.parentId)
    list.map(item2 => {
      item2.children = this.props.menu.filter(item => item.parentId === item2.id)
      return item2
    })
  
  
    let openKey = '',
        selectKey = '',
        pathName = ''

    for (let item of list) {
      for (let child of item.children) {
        if(child.path === this.props.location.pathname) {
          selectKey = child.id
          pathName = child.name
        }
      }
      if(!!selectKey) {
        openKey = item.id
        pathName = item.name + ' > ' + pathName
        break
      }
    }
  
    console.log(openKey, selectKey)
  
    this.setState({
      menuList: list,
      openKey,
      selectKey,
      currentPosition: pathName
    })
  }

  setPageType () {
    if(blankPath.includes(this.props.location.pathname)) {
      this.setState({pageType: 'blank'})
    } else {
      this.setState({pageType: 'main'})
    }
  }

  selectMenuEvt ({key}) {
    for (let menu of this.state.menuList) {
      let child = menu.children.find(item => item.id === key)
      if(!!child) {
        this.props.history.push(child.path)
        break
      }
    }
  }

  async updateUserPasswordEvt () {
    if(this.state.userUpdateLoading) return
    if(!this.state.userPassword) {
      message.warn('请输入密码！')
      return
    }
    if(!this.state.confirmPassword) {
      message.warn('请输入确认密码！')
      return
    }
    if (this.state.userPassword !== this.state.confirmPassword) {
      message.warn('两次输入的密码不一致！')
      return
    }
    this.setState({userUpdateLoading: true})
    let result = await updateUserApi({id: this.props.userInfo.id, password: this.state.userPassword})
    this.setState( {userUpdateLoading: false} )
    if(result.code === 200) {
      message.success('修改密码成功，请重新登录')
      localStorage.clear()
      sessionStorage.clear()
      this.setState({ showUserUpdateModal: false })
      setTimeout(() => {
       this.props.history.push('/login') 
      });
    } else {
      message.error('修改密码失败，请重试！')
    }
  }

  render() {
    return (
      <Fragment>
        {
          this.state.pageType === 'blank'
          ?
          <div>
            {this.props.children}
          </div>
          :
          (
            <div className={this.state.expend ? "page-container" : "page-container collapse"}>
              <aside className='page-layout-menu'>
                <div className='title'>销售管理系统</div>
                <div className="content">
                  {
                  !!this.state.openKey && <Menu
                    defaultSelectedKeys={[this.state.selectKey]}
                    defaultOpenKeys={[this.state.openKey]}
                    selectedKeys={[this.state.selectKey]}
                    mode="inline"
                    theme="dark"
                    onSelect={this.selectMenuEvt.bind(this)}
                    inlineCollapsed={!this.state.expend}
                  >
                    {
                      this.state.menuList.map(menu => {
                        return (
                          <SubMenu key={ menu.id } icon={ this.state.menuIcon[menu.icon] } title={ menu.name }>
                            {
                              menu.children.map(child => {
                                return (
                                  <Item key={ child.id }>{ child.name }</Item>
                                )
                              })
                            }
                          </SubMenu>
                        )
                      })
                    }
                  </Menu>
                  }
                </div>
              </aside>


              <article>
                <header>
                  <Button onClick={
                    () => {
                      this.setState({expend: !this.state.expend})
                      console.log(this.state.expend)
                    }
                  } icon={<MenuFoldOutlined/>}></Button>
                  <span className="page-layout-position">当前位置：{this.state.currentPosition}</span>

                  <Dropdown overlay={
                    <div className='page-layout-user-drop'>
                      <span onClick={
                        () => {
                          this.setState({
                            showUserUpdateModal: true
                          })
                        }
                      }>修改密码</span>
                      <span onClick={
                        () => {
                          sessionStorage.clear()
                          localStorage.removeItem('auto-login-key')
                          this.props.history.push('/login')
                        }
                      }>退出登录</span>
                    </div>
                  } trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      {this.props.userInfo.name}&nbsp;<DownOutlined />
                    </a>
                  </Dropdown>

                </header>
                <article>
                  {this.props.children}
                </article>
              </article>
            </div>
          )
        }
        <Modal title="用户密码修改"
          visible={this.state.showUserUpdateModal}
          onOk={this.updateUserPasswordEvt.bind(this)}
          onCancel={() => {
            if (!this.state.userUpdateLoading) this.setState({ showUserUpdateModal: false })
          }}>
          <Spin spinning={this.state.userUpdateLoading}>
            <p>
              <Input value={this.state.userPassword}
                onChange={evt => { this.setState({ userPassword: evt.target.value }) }}
                placeholder="请输入新密码" />
            </p>
            <p>
              <Input value={this.state.confirmPassword}
                onChange={evt => { this.setState({ confirmPassword: evt.target.value }) }}
                placeholder="请输入确认密码" />
            </p>
          </Spin>
        </Modal>
      </Fragment>
    )
  }
}

export default PageLayout
