import React, { Component, createRef } from 'react'
import { Table, Modal, Input, Button, Pagination, message, Select, Form, Steps, Timeline } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getPurchaseListApi, deletePurchaseApi, payPurchaseApi, approvePurchaseApi } from '../../apis/userApi'

let timer = null


class List extends Component {

    state = {
        purchaseSource: [],
        
        column:
            [
                {
                    title: '创建人',
                    dataIndex: 'createName',
                    key: 'createName'
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    render: 
                    time => {
                        if (time) {
                            return (<span>{time.slice(0,10)}</span>)
                        }
                    }
                },
                {
                    title: '单据状态',
                    dataIndex: 'state',
                    key: 'state',
                },
                {
                    title: '项目名称',
                    dataIndex: 'projectName',
                    key: 'projectName'
                },
                {
                    title: '材料名称',
                    dataIndex: 'materialName',
                    key: 'materialName'
                },
                {
                    title: '供应商名称',
                    dataIndex: 'supplierName',
                    key: 'supplierName'
                },
                {
                    title: '操作',
                    width: 180,
                    render: data => {
                        return (
                            <>
                                {data.state === '完成' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'pay') }>付款</span>}
                                {<span className='editBtn' onClick={ this.editEvt.bind(this, data, 'detail') }>详情</span>}
                                {(data.state === '新建' || data.state === '确认' || data.state === '在途') && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'approve') }>审批</span>}
                                {data.state === '新建' && <span className='editBtn' style={{color: 'red'}} onClick={ this.editEvt.bind(this, data, 'delete') }>删除</span>}
                                {data.state === '新建' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'edit') }>编辑</span>}
                            </>
                        )  
                    }
                }
            ],
        tableHeight: 0,
        tableNode: createRef(),
        projectName: '',
        page: 1,
        state: '',
        size: 15,
        total: 0,

        detailInfo: {},

        showPayModal: false,
        showApproveModal: false,
        showDetailModal: false,

        payForm: createRef(),
        payId: '',
        payMoney: '',
        payUserId: '',
        payUserName: '',
        payRemark: '',
        
        approveForm: createRef(),
        isReject: false,
        approveRemark: '',
        purcharseState: 0,

        detailForm: createRef(),


    }


    editEvt (data, type) {
        let userInfo = JSON.parse(sessionStorage.getItem('common-reducer-cash'))
        this.setState({
            payUserId: userInfo.userInfo.id,
            payUserName: userInfo.userInfo.name,
        })
        switch (type) {
            case 'delete':
                console.log(data)
                Modal.confirm({
                    title: '删除确认',
                    icon: <ExclamationCircleOutlined />,
                    content: `确认删除 [${data.projectName}] 这条数据吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                        let res = await deletePurchaseApi(data.id)
                        if(res.code === 200) {
                            message.success('删除采购订单成功！')
                            this.getlist()
                        } else {
                            message.error('删除采购订单失败！')
                        }
                    }
                });
                break
                case 'edit':
                    this.props.history.push({pathname: '/purchase/edit', isEdit: true, purchaseId: data.id})
                break
            case 'add':
                this.props.history.push({pathname: '/purchase/edit', isEdit: false ,route: 'add'})
                break
            case 'pay':
                console.log(data)
                this.setState({
                    showPayModal: true,
                    payId: data.id,
                    payMoney: 0,
                    payRemark: ''

                }, () => {
                    console.log(this.state.payForm.current)
                    this.state.payForm.current.setFieldsValue({payUserName: userInfo.userInfo.name})
                })
                break
            case 'approve':
                this.setState({
                    showApproveModal: true,
                    purcharseState: data.state,
                    payId: data.id,
                }, () => {
                    console.log(this.state.payForm.current)
                    this.state.approveForm.current.setFieldsValue({payUserName: userInfo.userInfo.name})
                })
                break
            case 'detail':
                console.log(data)
                this.setState({
                    detailInfo: data,
                    showDetailModal: true
                })
                break
            default:
                break
        }
    }

    // 采购订单支付
    async payEvt () {
        let res = await payPurchaseApi({
            id: this.state.payId,
            amount: this.state.payMoney,
            userid: this.state.payUserId,
            userName: this.state.payUserName,
            remark: this.state.payRemark
        })
        if(res.code === 200) {
            message.success('付款成功！')
        } else {
            message.error('付款失败！')
        }
        this.setState({showPayModal: false})
    }

    // 采购订单审批
    async approveEvt () {
        let res = await approvePurchaseApi({
            id: this.state.payId,
            isReject: this.state.isReject,
            userId: this.state.payUserId,
            userName: this.state.payUserName,
            remark: this.state.approveRemark
        })
        if(res.code === 200) {
            message.success('审批成功！')
        } else {
            message.error('审批失败！')
        }
        this.setState({showApproveModal: false})
    }


    componentDidMount () {
        this.getlist()
        if(this.state.tableNode.current) {
            this.setState({
                tableHeight: this.state.tableNode.current.clientHeight - 16 - 39
            })
        }


        window.addEventListener('resize', this.tableResize)
    }

    tableResize = () => {
        
        if(timer) {
            clearTimeout(timer)
            timer = null
        }
        
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
            
            if(this.state.tableNode.current) {
                this.setState({
                    tableHeight: this.state.tableNode.current.clientHeight - 16 - 39
                })
            }
        }, 500);
    }

    async getlist () {
        let res = await getPurchaseListApi(
            {projectName: this.state.name, page: this.state.page, size: this.state.size, state: this.state.state}
        )

        if(res.code === 200) {
            this.setState({
                projectSource: res.data.rows.map(item => {
                    item.key = item.id
                    return item
                }),
                total: res.data.total
            })
        }
    }



    render() {
        return (
            <div className='page-layout-container'>
                <header>
                    <Input value={this.state.name} placeholder='请输入项目名称' onChange={ evt => {
                        this.setState({name: evt.target.value})
                    } }></Input>

                    <Select defaultValue="全部" style={{ width: 120 }} onChange={e => {this.setState({state: e})}} >
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="在途">在途</Select.Option>
                        <Select.Option value="确认">确认</Select.Option>
                        <Select.Option value="作废">作废</Select.Option>
                        <Select.Option value="完成">完成</Select.Option>
                    </Select>


                    <Button type='primary' onClick={this.getlist.bind(this)}>查询</Button>
                    <Button onClick={this.editEvt.bind(this, {}, 'add')}>新增</Button>
                </header>
                <article ref={this.state.tableNode}>
                    <Table 
                        dataSource={this.state.projectSource} 
                        columns={this.state.column} 
                        pagination={false}
                        size='small'
                        scroll={{y: this.state.tableHeight}}
                    />
                </article>
                <footer>
                    <Pagination
                        size='small'
                        total={this.state.total}
                        pageSize={this.state.size}
                        showTotal={total =>  `合计 ${total} 条`}
                        pageSizeOptions={[15,30,50,100]}
                        current={this.state.page}
                        showQuickJumper={true}
                        onChange={(page, size) => {
                            this.setState({
                                page,
                                size
                            }, () => {
                                console.log('change')
                                this.getlist()
                            })
                        }}
                    />
                </footer>

                {/* 付款弹出框 */}
                <Modal title="付款"
                    visible={this.state.showPayModal}
                    width={600}
                    onCancel={() => { this.setState({showPayModal: false}) }}
                    onOk={ this.payEvt.bind(this) }
                    maskClosable={false}>
                    <Form ref={this.state.payForm}>
                        <Form.Item name="payUserName" label="付款人">
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item name="paymentAmount" label="付款金额">
                            <Input onChange={e => { this.setState({payMoney: e.target.value * 1}) }}/>
                        </Form.Item>
                        <Form.Item name="paymentRemark" label="备注">
                            <Input.TextArea  onChange={e => { this.setState({payRemark: e.target.value})}}/>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 审批弹出框 */}
                <Modal title="审批信息"
                    visible={this.state.showApproveModal}
                    width={600}
                    onCancel={() => {
                        this.state.approveForm.current.resetFields()
                        this.setState({showApproveModal: false})
                    }}
                    onOk={ this.approveEvt.bind(this) }
                    maskClosable={false}>
                    <Steps size="small" style={{marginBottom: '18px'}} current={['新建', '确认', '在途', '完成'].indexOf(this.state.purcharseState) + 1}>
                        <Steps.Step title="新建"></Steps.Step>
                        <Steps.Step title="确认"></Steps.Step>
                        <Steps.Step title="在途"></Steps.Step>
                        <Steps.Step title="完成"></Steps.Step>
                    </Steps>
                    <Form ref={this.state.approveForm}>
                        <Form.Item name="isReject" label="是否通过">
                            <Select value={this.state.isReject} onChange={e => { this.setState({isReject: e}) }}>
                                <Select.Option value={false}>通过</Select.Option>
                                <Select.Option value={true}>驳回</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="payUserName" label="审批人">
                            <Input readOnly/>
                        </Form.Item>
                        <Form.Item name="approveRemark" label="备注">
                            <Input.TextArea onChange={e => { this.setState({approveRemark: e.target.value}) }}/>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 详情弹出框 */}
                <Modal title="采购单详情"
                    visible={this.state.showDetailModal}
                    width={600}
                    footer={null}
                    onCancel={() => { this.setState({showDetailModal: false}) }}>
                    <div>
                        <p>
                            <span>创建人：</span>
                            <span>{this.state.detailInfo.createName}</span>
                        </p>
                        <p>
                            <span>创建时间：</span>
                            <span>{this.state.detailInfo.createTime}</span>
                        </p>
                        <p>
                            <span>项目名称：</span>
                            <span>{this.state.detailInfo.projectName}</span>
                        </p>
                        <p>
                            <span>材料名称：</span>
                            <span>{this.state.detailInfo.materialName}</span>
                        </p>
                        <p>
                            <span>材料重量：</span>
                            <span>{this.state.detailInfo.materialWeight} {this.state.detailInfo.materialUnit}</span>
                        </p>
                        <p>
                            <span>供应商名字：</span>
                            <span>{this.state.detailInfo.supplierName}</span>
                        </p>
                        <p>
                            <span>备注：</span>
                        </p>
                        <Timeline mode="left">
                            {
                                !!this.state.detailInfo.remark
                                &&
                                !!this.state.detailInfo.remark.length
                                &&
                                this.state.detailInfo.remark.map((it, index) => {
                                    return (
                                        <Timeline.Item key={index} label={it.time}>
                                            <p>{it.userName}</p>
                                            <p>{it.remark}</p>
                                        </Timeline.Item>
                                    )
                                })
                            }
                        </Timeline>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default List