import React, { Component } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

// 引入页面组件
import NotFound from '../pages/common/NotFound'
import NotRight from '../pages/common/NotRight'
import Login from './login'
import Home from './home'

import ProjectList from './project/List'
import ProjectEdit from './project/Edit'
import PurchaseList from './purchase/List'
import PurchaseEdit from './purchase/Edit'
import ReceivingList from './receiving/List'
import ReceivingEdit from './receiving/Edit'
import UserList from './user/List'
import UserEdit from './user/Edit'
import BaseRole from './base/RoleList'
import BaseMaterial from './base/MaterialList'
import BaseSupplier from './base/SupplierList'
import PageLayout from './common/PageLayout'



const mapStateToProps = state => {
  return {
    menuList: state.common.menu
  }
}


@connect(mapStateToProps)
class App extends Component {

  hasRole = (path, role, commponent) => {
    let menu = this.props.menuList.find(item => item.path === path)
    let hasRole = menu.role.includes(role)
    if(hasRole) {
      return commponent
    } else {
      return <NotRight />
    }
  }

  render() {

    return (
      <HashRouter>
        <PageLayout>
          <Switch>
            <Route path='/404' component={NotFound}></Route>
            <Route path='403' component={NotRight}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path="/project/list" component={ProjectList}/>
            <Route path="/project/edit" render={
              props => this.hasRole('/project/edit', 'C', <ProjectEdit {...props}/>)
            } />
            <Route path="/purchase/list" component={PurchaseList}/>
            <Route path="/purchase/edit"  render={
              props => this.hasRole('/purchase/edit', 'C', <PurchaseEdit {...props}/>)
            } />
            <Route path="/receiving/list" component={ReceivingList}/>
            <Route path="/receiving/edit"  render={
              props => this.hasRole('/receiving/edit', 'C', <ReceivingEdit {...props}/>)
            } />
            <Route path="/user/list" component={UserList}/>
            <Route path="/user/edit"  render={
              props => this.hasRole('/user/edit', 'C', <UserEdit {...props}/>)
            } />
            <Route path="/role"  render={
              props => this.hasRole('/role', 'C', <BaseRole {...props}/>)
            } />
            <Route path="/material"  render={
              props => this.hasRole('/material', 'C', <BaseMaterial {...props}/>)
            } />
            <Route path="/supplier"  render={
              props => this.hasRole('/supplier', 'C', <BaseSupplier {...props}/>)
            } />
            <Route path='/home' render={
              props => this.hasRole('/home', 'R', <Home {...props}/>)
            } />

            <Redirect from='/' to='/login' exact></Redirect>
            <Redirect to='/404'></Redirect>
          </Switch>
        </PageLayout>
      </HashRouter>
    )
  }
}


export default App