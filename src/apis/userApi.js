import Ajax from './ajax'

// 获取地市数据
export const getCityApi = () => {
  return Ajax({
    url: '/city/list/info'
  })
}


// 用户登录接口
export const userLoginApi = data => {
  return Ajax({
    url: '/user/login',
    method: 'POST',
    data
  })
}

// 获取用户信息接口
export const userInfoApi = id => {
  return Ajax({
    url: '/user/info',
    params: { id }
  })
}

// 获取项目信息
export const projectInfoApi = id => {
  return Ajax({
    url: '/project/info',
    params: { id }
  })
}


// 获取home页菜单
export const userMenuApi = () => {
  return Ajax({
    url: '/menu/list'
  })
}

// 自动登录
export const autoLoginApi = () => {
  return Ajax({
    url: '/user/auto/login',
    method: 'POST'
  })
}

// 更新用户信息
export const updateUserApi = data => {
  return Ajax({
    url: '/user/update',
    method: 'POST',
    data
  })
}

// 新增用户
export const addUserApi = data => {
  return Ajax({
    url: '/user/save',
    method: 'POST',
    data
  })
}


// 更新项目信息
export const updateProjectApi = data => {
  return Ajax({
    url: '/project/update',
    method: 'POST',
    data
  })
}


// 新增项目
export const addProjectApi = data => {
  return Ajax({
    url: '/project/save',
    method: 'POST',
    data
  })
}




// 获取角色权限信息
export const getUserRoleApi = ids => {
  return Ajax({
    url: '/role/list',
    params: { ids }
  })
}


// 大屏显示回款统计
export const getPaidApi = () => {
  return Ajax({
    url: '/analysis/collection'
  })
}


// 删除用户
export const deleteUserApi = id => {
  return Ajax({
    url: '/user/delete/' + id,
    method: 'POST',
  })
}

// 删除项目
export const deleteProjectApi = id => {
  return Ajax({
    url: '/project/delete/' + id,
    method: 'POST'
  })
}

// 删除采购项目
export const deletePurchaseApi = id => {
  return Ajax({
    url: '/purchase/delete/' + id,
    method: 'POST'
  })
}

// 删除收货订单
export const deleteReceivingApi = id => {
  return Ajax({
    url: '/receiving/delete/' + id,
    method: 'POST'
  })
}

// 获取部门列表信息
export const getDeptApi = () => {
  return Ajax({
    url: '/dept/list'
  })
}


// 获取角色信息
export const roleListApi = () => {
  return Ajax({
    url: '/role/list'
  })
}

// 上传用户头像
export const uploadPhotoApi = (data, type) => {
  return Ajax({
    url: '/file/upload/' + type,
    method: 'POST',
    data
  })
}

// 获取用户列表信息

export const getUserListApi = params => {
  return Ajax({
    url: '/user/list',
    params
  })
}


// 获取项目列表信息
export const getProjectList = params => {
  return Ajax({
    url: '/project/list',
    params
  })
}


// 获取采购列表信息
export const getPurchaseListApi = params => {
  return Ajax({
    url: '/purchase/list',
    params
  })
}

// 采购订单支付
export const payPurchaseApi = data => {
  return Ajax({
    url: '/purchase/payment',
    method: 'POST',
    data
  })
}

// 收货订单支付
export const payReceivingApi = data => {
  return Ajax({
    url: '/receiving/collection',
    method: 'POST',
    data
  })
}

// 更新采购订单状态
export const approvePurchaseApi = data => {
  return Ajax({
    url: '/purchase/flow',
    method: 'POST',
    data
  })
}

// 获取单个采购订单信息
export const getPurchaseInfoApi = params => {
  return Ajax({
    url: '/purchase/info',
    params
  })
}


// 获取材料列表信息
export const getMaterialListApi = () => {
  return Ajax({
    url: '/material/list',
  })
}


// 获取供应商列表信息
export const getSupplierListApi = params => {
  return Ajax({
    url: '/supplier/list',
    params
  })
}


// 更新采购信息
export const updatePurchaseApi = data => {
  return Ajax({
    url: '/purchase/update',
    method: 'POST',
    data
  })
}


// 新增项目
export const addPurchaseApi = data => {
  return Ajax({
    url: '/purchase/save',
    method: 'POST',
    data
  })
}


// 获取收货列表信息
export const getReceivingListApi = params => {
  return Ajax({
    url: '/receiving/list',
    params
  })
}

export const finishReceivingApi = data => {
  return Ajax({
    url: '/receiving/finish',
    method: 'POST',
    data
  })
}