import React, { Component, createRef } from 'react'
import { Input, Button, Row, Col, Form, Modal, DatePicker, Cascader, message, Select } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getPurchaseInfoApi, addPurchaseApi, updatePurchaseApi } from '../../apis/userApi'
import moment from 'moment'
import PurchaseComponent from '../common/purchaseComponent'


let isEdit
class Edit extends Component {

    
    state = {
        contentForm: createRef(),
        id: '', 
        approveInfo: '',  
        createName: '',
        modaProject: false,
        modaMaterial: false,
        modaSupplier: false,
        modaApprove: false
    }

    async componentDidMount () {

        isEdit = this.props.location.isEdit || false

        let purchaseId = this.props.location.purchaseId

        if(isEdit && purchaseId) {
            let purchaseInfo = await getPurchaseInfoApi({id: purchaseId})

            console.log(purchaseInfo.data)

            if(purchaseInfo.code !== 200) {
                message.error('获取项目信息失败！')
                return
            }

            this.setState({
                ...purchaseInfo.data,
                id: purchaseId,
                remark: purchaseInfo.data.remark[0].remark,
                createTime: moment(purchaseInfo.data.createTime, 'YYYY-MM-DD'),
            })
            this.state.contentForm.current.setFieldsValue({
                ...purchaseInfo.data,
                remark: purchaseInfo.data.remark[0].remark,
                createTime: moment(this.state.createTime, 'YYYY-MM-DD'),
                approveInfo: `共${this.state.nextId.length}个审批人`
            })
        } else {
            let userInfo = JSON.parse(sessionStorage.getItem('common-reducer-cash'))
            this.setState({
                createName: userInfo.userInfo.name,
            }, () => {
                this.state.contentForm.current.setFieldsValue({
                    createName: this.state.createName
                })
            })
            
        }
    }

    // 选择项目
    selectItem (obj) {
        console.log(obj)
        switch (obj.type) {
            case 'projectName':
                this.setState({
                    projectName: obj.name,
                    modaProject: obj.showModa
                })
                this.state.contentForm.current.setFieldsValue({
                    projectName: obj.name
                })
                break
            case 'materialName':
                this.setState({
                    materialName: obj.name,
                    modaMaterial: obj.showModa
                })
                this.state.contentForm.current.setFieldsValue({
                    materialName: obj.name
                })
                break
            case 'supplierName':
                this.setState({
                    supplierName: obj.name,
                    modaSupplier: obj.showModa
                })
                this.state.contentForm.current.setFieldsValue({
                    supplierName: obj.name
                })
                break
            case 'approveName':
                console.log(obj.names)
                this.setState({
                    nextId: obj.names,
                    modaApprove: obj.showModa
                }, () => {
                    console.log(this.state.nextId,'---------------')
                    this.state.contentForm.current.setFieldsValue({
                        approveInfo: `共${this.state.nextId.length}个审批人`
                    })
                })
                break
            default:
                break
        }
        
    }

    async editEvt (type) {
        switch (type) {
            case 'save':
                try {
                    await this.state.contentForm.current.validateFields()
                    if (isEdit) {
                        this.updatePurchase()
                    } else {
                        this.addPurchase()
                    }
                } catch (e) {console.log(e)}
            break
                
            case 'return':
                this.props.history.goBack()
                break
            default:
                break
        }
    }


    async addPurchase () {
        let res = await addPurchaseApi(this.state)
        if(res.code === 200) {
            message.success('添加项目成功！')
            this.state.contentForm.current.resetFields()

        } else {
            message.error('添加项目失败！')
            this.state.contentForm.current.resetFields()
        }
    }

    async updatePurchase () {
        let res = await updatePurchaseApi(this.state)
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
                    <Form ref={this.state.contentForm}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="采购单号" name='id' rules={[{ required: false }]}                                >
                                    <Input  readOnly placeholder='采购单号由系统自动生成' onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="创建人" name='createName'  rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({createName: e.target.value}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item label="创建时间" name='createTime' rules={[{ required: true }]}>
                                    <DatePicker  style={{ width: '100%' }} placeholder='选择日期'  onChange={evt => {
                                            this.setState({ createTime: evt}) 
                                          }} />
                                </Form.Item>
                            </Col>
                            

                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="项目名称" name='projectName' rules={[{ required: true }]}                                >
                                    <Input.Search placeholder='请选择项目' enterButton readOnly  onSearch={() => this.setState({modaProject: true}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="材料名称" name='materialName' rules={[{ required: true }]}                                >
                                    <Input.Search placeholder='请选择材料' enterButton readOnly  onSearch={() => this.setState({modaMaterial: true}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item label="材料单位" name='materialUnit' rules={[{ required: true }]}>
                                    <Select  style={{ width: '100%' }} onChange={evt => { this.setState({ materialUnit: evt })}}>
                                        <Select.Option value="千克">千克</Select.Option>
                                        <Select.Option value="吨">吨</Select.Option>
                                        <Select.Option value="方">方</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="材料重量" name='materialWeight' rules={[{ required: true }]}                                >
                                    <Input  onChange={e => this.setState({materialWeight: e.target.value}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="材料单价" name='price' rules={[{ required: true }]}                                >
                                    <Input  onChange={e => this.setState({price: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="供应商名称" name='supplierName' rules={[{ required: true }]}                                >
                                    <Input.Search placeholder='请选择供应商' enterButton readOnly  onSearch={() => this.setState({modaSupplier: true}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="供应联系人" name='supplierContact' rules={[{ required: false }]}                                >
                                    <Input  onChange={e => this.setState({createName: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="供应商电话" name='supplierPhone' rules={[{ required: false }]}                                >
                                    <Input  onChange={e => this.setState({supplierPhone: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Form.Item  label="审批人" name='approveInfo' rules={[{ required: true }]}                                >
                                    <Input.Search  placeholder='请选择审批人' enterButton readOnly  onSearch={() => this.setState({modaApprove: true}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item  label="备注"  name='remark'                     >
                                    <Input.TextArea placeholder='请输入备注'  onChange={e => this.setState({remark: e.target.name})  } allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    {/* 项目弹出框 */}
                    <Modal
                        title="请选择项目"
                        width={1200}
                        className='modal-fixed-height'
                        visible={this.state.modaProject}
                        onCancel={() => this.setState({modaProject: false})}
                        okButtonProps={{ style: {display:'none'}  }}
                    >
                        <PurchaseComponent  selectItem={this.selectItem.bind(this)} type='projectName'/>
                    </Modal>

                    {/* 材料弹出框 */}
                    <Modal
                        title="请选择材料"
                        width={1200}
                        className='modal-fixed-height'
                        visible={this.state.modaMaterial}
                        onCancel={() => this.setState({modaMaterial: false})}
                        okButtonProps={{ style: {display:'none'}  }}
                    >
                        <PurchaseComponent  selectItem={this.selectItem.bind(this)} type='materialName'/>
                    </Modal>

                    {/* 供应商弹出框 */}
                    <Modal
                        title="请选择供应商"
                        width={1200}
                        className='modal-fixed-height'
                        visible={this.state.modaSupplier}
                        onCancel={() => this.setState({modaSupplier: false})}
                        okButtonProps={{ style: {display:'none'}  }}
                    >
                        <PurchaseComponent  selectItem={this.selectItem.bind(this)} type='supplierName'/>
                    </Modal>

                    {/* 审批弹出框 */}
                    <Modal
                        title="请选择供应商"
                        width={1200}
                        className='modal-fixed-height'
                        visible={this.state.modaApprove}
                        onCancel={() => this.setState({modaApprove: false})}
                        okButtonProps={{ style: {display:'none'}  }}
                    >
                        <PurchaseComponent  selectItem={this.selectItem.bind(this)} type='approveName'/>
                    </Modal>
                </article>
            </div>
        )
    }
}

export default Edit