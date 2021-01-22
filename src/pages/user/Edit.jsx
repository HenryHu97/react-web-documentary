import React, { Component, createRef, Fragment } from 'react'
import { Input, Button, Row, Col, Form, Select, DatePicker, Checkbox, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getDeptApi, userInfoApi, roleListApi, uploadPhotoApi, updateUserApi, addUserApi } from '../../apis/userApi'
import moment from 'moment'


class Edit extends Component {

    state = {
        // id: '',
        sexList: ['男', '女', '未知'],
        deptList: [],
        dutiesList: [],
        roleList: [],
        role: [],
        form: createRef(),
        
        id: '',
        name: '',
        photo: '',
        sex: '未知',
        birthday:  '',
        dept: '',
        duties: '',
        phone: '',
        email: '',
        address:'',
        remark: '',
        password: '',


        isEdit: true
    }

    async componentDidMount () {
        // let cache = sessionStorage.getItem('user-editInfo')

        let isEdit = this.props.location.isEdit || false,
        userId = this.props.location.userId
        
        let res = await getDeptApi()
        this.setState({
            deptList: res.data,
            isEdit
        })

        let role = await roleListApi()
        if(role.code === 200) {
            this.setState({
                roleList: role.data.rows.map(item => {
                    item.label = item.name
                    item.value = item.id
                    return item
                })
            })
        }


        if(isEdit && userId) {
            let user = await userInfoApi(userId)
            console.log(user)
            if(user.code !== 200) {
                message.error('获取用户信息失败！')
                return
            }
            this.state.form.current.setFieldsValue({
                id: user.data.id,
                name: user.data.name,
                photo: user.data.photo,
                sex: user.data.sex,
                birthday:  moment(user.data.birthday, 'YYYY-MM-DD'),
                dept: user.data.dept,
                duties: user.data.duties,
                phone: user.data.phone,
                email: user.data.email,
                role: user.data.role,
                address: user.data.address,
                remark: user.data.remark
            })

            this.setState({
                id: user.data.id,
                name: user.data.name,
                photo: user.data.photo,
                sex: user.data.sex,
                birthday:  moment(user.data.birthday, 'YYYY-MM-DD'),
                dept: user.data.dept,
                duties: user.data.duties,
                phone: user.data.phone,
                email: user.data.email,
                role: user.data.role,
                address: user.data.address,
                remark: user.data.remark
            })

        }

    }

    componentWillUnmount () {
        
    }

    async editEvt (type) {
        switch (type) {
            case 'save':
                // await this.state.form.current.validateFields()

                if(this.state.isEdit) {
                    this.updateUser()
                } else {
                    this.addUser()
                }
                break
            case 'return':
                this.props.history.goBack()
                break
            default:
                break
        }
    }

    async addUser () {
        let res = await addUserApi(this.state)
        if(res.code === 200) {
            message.success('添加用户成功！')
            this.state.form.current.resetFields()

        } else {
            message.error('添加用户失败！')
            this.state.form.current.resetFields()
        }
    }

    async updateUser () {
        let res = await updateUserApi(this.state)
        if(res.code === 200) {
            message.success('更新用户成功！')
        } else {
            message.error('更新用户失败！')
        }
    }

    openFile () {
        console.log('============')
        let input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.click()
        input.onchange = async () => {
            let files = input.files,
                fd = new FormData()
            fd.append('fileName', files[0])
            let result = await uploadPhotoApi(fd, 'photo')
            if(result.code === 200) {
                this.state.form.current.setFieldsValue({photo: result.data[0].path})
                this.setState({photo: result.data[0].path})
            }

        }
    }



    render() {
        return (
            <div className='page-layout-container'>
                <header>
                    <Button type='primary' onClick={this.editEvt.bind(this, 'save')}>保存</Button>
                    <Button onClick={this.editEvt.bind(this, 'return')}>返回</Button>
                </header>
                <article>
                    <Form ref={this.state.form}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="用户编码" name='id' rules={[{ required: true }]}                                >
                                    <Input value={this.state.id} onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户姓名" name="name" rules={[{ required: true }]}>
                                    <Input value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
                                </Form.Item>
                            </Col>
                            {
                                !this.state.isEdit ? 
                                    <Col className="gutter-row" span={6}>
                                        <Form.Item label="用户密码" name="用户密码" rules={[{ required: true }]}>
                                            <Input value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                                        </Form.Item>
                                    </Col>
                                    :
                                <Fragment/>
                            }
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户头像" name='photo'>
                                    <Input.Search placeholder="photo" readOnly onSearch={this.openFile.bind(this)} enterButton={<DownloadOutlined/>} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户性别" name='sex'>
                                    <Select defaultValue={this.state.sex} style={{ width: '100%' }} onChange={evt => { this.setState({ sex: evt })}}>
                                        {
                                            this.state.sexList.map(item => {
                                                return (<Select.Option key={item} value={item}>{item}</Select.Option>)
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户生日" name='birthday'>
                                    <DatePicker value={this.state.birthday} style={{ width: '100%' }} placeholder='选择日期'  onChange={evt => {
                                            this.setState({ birthday: evt}) 
                                          }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户部门" name='dept'>
                                    <Select value={this.state.dept} style={{ width: '100%' }} onChange={evt => {
                                        let dutiesList = this.state.deptList.find(oo => oo.name === evt).children
                                        this.setState({dept: evt , dutiesList, duties: '' })
                                    }}>
                                        {
                                            this.state.deptList.map(item => {
                                                return (<Select.Option key={item} value={item.name}>{item.name}</Select.Option>)
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="用户职位" name='duties'>
                                    <Select value={this.state.duties} style={{ width: '100%' }} onChange={evt => { this.setState({ duties: evt })}}>
                                        {
                                            this.state.dutiesList.map(item => {
                                                return (<Select.Option key={item} value={item}>{item}</Select.Option>)
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="电话号码" name="phone" rules={[{ required: true }]}>
                                    <Input value={this.state.phone} onChange={e => this.setState({phone: e.target.value})} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="电子邮箱" name="email">
                                    <Input value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col className="gutter-row" span={12}>
                                <Form.Item label="用户权限" name="role">
                                    <Checkbox.Group options={this.state.roleList} onChange={e => this.setState({role: e}) } />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={24}>
                                <Form.Item label="用户地址" name="address">
                                    <Input value={this.state.address} onChange={e => this.setState({address: e.target.value})}/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item label="备注" name="remark">
                                    <Input value={this.state.remark} onChange={e => this.setState({remark: e.target.value})}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </article>
            </div>
        )
    }
}

export default Edit