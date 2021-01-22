import React, { Component, createRef, Fragment } from 'react'
import { Input, Button, Row, Col, Form, Modal, DatePicker, Cascader, message, Pagination } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getCityApi, projectInfoApi, addProjectApi, updateProjectApi } from '../../apis/userApi'
import UserComponent from '../common/userListComponent'
import moment from 'moment'

let isEdit
class Edit extends Component {

    state = {
        modaVisible: false,
        form: createRef(),
        cityList: [],

        id: "",
        name: '',
        liableName: '',
        signTime: '',
        province: '',
        city: '',
        county: '',
        address: '',
        ownerName: '',
        ownerPhone: '',
        ownerAddress: '',
        remark: '',

        defaultCity: []

    }

    async componentDidMount () {
        let cities = await getCityApi()
        if(cities.code === 200) {
            this.setState({
                cityList: cities.data
            })
        }

        isEdit = this.props.location.isEdit || false

        let projectId = this.props.location.projectId

        if(isEdit && projectId) {
            let projectInfo = await projectInfoApi(projectId)

            console.log(projectInfo.data)
            if(projectInfo.code !== 200) {
                message.error('获取项目信息失败！')
                return
            }

            this.setState({
                defaultCity: [projectInfo.data.province,projectInfo.data.city,projectInfo.data.county]
            })

            this.state.form.current.setFieldsValue({
                ...projectInfo.data,
                signTime: moment(projectInfo.data.signTime, 'YYYY-MM-DD'),
            })

            this.setState({
                ...projectInfo.data,
                signTime: moment(projectInfo.data.signTime, 'YYYY-MM-DD'),
            })

        }
    }

    // 选择负责人
    selectPrincipal (name, modaVisible) {
        console.log(name, modaVisible,'父组件')
        this.setState({
            liableName: name,
            modaVisible
        })
        this.state.form.current.setFieldsValue({
            liableName: name
        })
    }

    async editEvt (type) {
        switch (type) {
            case 'save':
                await this.state.form.current.validateFields().catch(e => e)
                if(isEdit) {
                    this.updateProject()
                } else {
                    this.addProject()
                }
                break
            case 'return':
                this.props.history.goBack()
                break
            default:
                break
        }
    }


    async addProject () {
        let res = await addProjectApi(this.state)
        if(res.code === 200) {
            message.success('添加项目成功！')
            this.state.form.current.resetFields()

        } else {
            message.error('添加项目失败！')
            this.state.form.current.resetFields()
        }
    }

    async updateProject () {
        let res = await updateProjectApi(this.state)
        if(res.code === 200) {
            message.success('更新项目成功！')
        } else {
            message.error('更新项目失败！')
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
                                <Form.Item  label="项目编码" name='id' rules={[{ required: false }]}                                >
                                    <Input  onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="项目名称" name='name' rules={[{ required: false }]}                                >
                                    <Input  onChange={e => this.setState({name: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="负责姓名" name='liableName' rules={[{ required: true }]}                                >
                                    <Input.Search placeholder='请选择负责人' enterButton readOnly  onSearch={() => this.setState({modaVisible: true}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item label="创建时间" name='signTime'>
                                    <DatePicker  style={{ width: '100%' }} placeholder='选择日期'  onChange={evt => {
                                            this.setState({ signTime: evt}) 
                                          }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Form.Item  label="省市区"  rules={[{ required: true }]}                                >
                                    <Cascader value={this.state.defaultCity} options={this.state.cityList} onChange={e => 
                                    this.setState({
                                        province: e[0],
                                        city: e[1],
                                        county: e[2],
                                        defaultCity: e
                                    })} placeholder="请选择地址" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Form.Item  label="详细地址" name='address' rules={[{ required: true }]}                                >
                                    <Input placeholder='请输入详细地址'  onChange={e => this.setState({address: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="业主姓名" name='ownerName' rules={[{ required: false }]}                                >
                                    <Input placeholder='请输入业主姓名'  onChange={e => this.setState({ownerName: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="业主手机" name='ownerPhone' rules={[{ required: false }]}                                >
                                    <Input placeholder='请输入业主手机'  onChange={e => this.setState({ownerPhone: e.target.name}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Form.Item  label="联系地址" name='ownerAddress' rules={[{ required: false }]}                                >
                                    <Input placeholder='请输入联系地址' onChange={e => this.setState({ownerAddress: e.target.name}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item  label="备注" name='remark'                               >
                                    <Input.TextArea placeholder='请输入备注'  onChange={e => this.setState({remark: e.target.name})  } allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Modal
                        title="请选择项目负责人"
                        width={1000}
                        className='modal-fixed-height'
                        visible={this.state.modaVisible}
                        onCancel={() => this.setState({modaVisible: false})}
                        okButtonProps={{ style: {display:'none'}  }}
                    >
                        <UserComponent  selectPrincipal={this.selectPrincipal.bind(this)} />
                    </Modal>
                </article>
            </div>
        )
    }
}

export default Edit