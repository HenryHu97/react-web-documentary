import React, { Component, createRef } from 'react'
import { Table, Modal, Input, Button, Pagination, message, Select, Form, Timeline } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getReceivingListApi, deleteReceivingApi, payReceivingApi, finishReceivingApi } from '../../apis/userApi'

let timer = null


class List extends Component {

    state = {
        purchaseSource: [],
        column:
            [
                {
                    title: '收货人',
                    dataIndex: 'userName',
                    key: 'userName'
                },
                {
                    title: '状态',
                    width: 70,
                    dataIndex: 'state',
                    key: 'state',
                },
                {
                    title: '收货时间',
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
                    title: '采购单号',
                    width: 250,
                    dataIndex: 'materialId',
                    key: 'materialId'
                },
                {
                    title: '供应商',
                    width: 150,
                    dataIndex: 'supplierName',
                    key: 'supplierName'
                },
                {
                    title: '材料名称',
                    dataIndex: 'materialName',
                    key: 'materialName'
                },
                {
                    title: '操作',
                    width: 180,
                    render: data => {
                        return (
                            <>
                                {data.state === '完成' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'pay') }>收款</span>}
                                {data.state === '完成' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'detail') }>详情</span>}
                                {data.state === '新建' && <span className='editBtn' style={{color: 'red'}} onClick={ this.editEvt.bind(this, data, 'delete') }>删除</span>}
                                {data.state === '新建' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'edit') }>编辑</span>}
                                {data.state === '新建' && <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'finish') }>完成</span>}
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
        showDetailModal: false,
        showFinishModal: false,

        payForm: createRef(),
        payId: '',
        payMoney: '',
        payUserId: '',
        payUserName: '',
        payRemark: '',
        
        finishForm: createRef(),
        salePrice: '',
        actualWeight: '',
        finishRemark: '',

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
                        let res = await deleteReceivingApi(data.id)
                        if(res.code === 200) {
                            message.success('删除收货订单成功！')
                            this.getlist()
                        } else {
                            message.error('删除收货订单失败！')
                        }
                    }
                });
                break
            case 'edit':
                this.props.history.push({pathname: '/receiving/edit', isEdit: true, receivingId: data.id})
            break
            case 'add':
                this.props.history.push({pathname: '/receiving/edit', isEdit: false ,route: 'add'})
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
            case 'finish':
                console.log(data,'==========')
                // this.setState({
                //     showFinishModal: true
                // }, () => {
                //     console.log(this.state.showFinishModal)
                // })
                this.setState({
                    showFinishModal: true,
                    payId: data.id,
                    salePrice: data.price,
                    actualWeight: data.materialWeight,
                    remark: this.state.finishRemark
                }, () => {
                    this.state.finishForm.current.setFieldsValue({
                        payUserName: userInfo.userInfo.name,
                        salePrice: data.price,
                        actualWeight: data.materialWeight,
                        remark: this.state.finishRemark
                    })
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

    // 收货订单支付
    async payEvt () {
        await this.state.payForm.current.validateFields().catch(e => console.log(e))
        let res = await payReceivingApi({
            id: this.state.payId,
            amount: this.state.payMoney,
            userid: this.state.payUserId,
            userName: this.state.payUserName,
            remark: this.state.payRemark
        })
        if(res.code === 200) {
            message.success('收款成功！')
        } else {
            message.error('收款失败！')
        }
        this.setState({showPayModal: false})
    }

    // 收货订单完成
    async finishEvt () {
        let res = await finishReceivingApi({
            id: this.state.payId,
            actualWeight: this.state.actualWeight,
            salePrice: this.state.salePrice,
            userId: this.state.payUserId,
            userName: this.state.payUserId,
            remark: this.state.finishRemark
        })
        if(res.code === 200) {
            message.success('收货成功！')
        } else {
            message.error('收货失败！')
        }
        this.setState({showFinishModal: false})
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
        let res = await getReceivingListApi(
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
                        <Select.Option value="新建">新建</Select.Option>
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

                {/* 收款弹出框 */}
                <Modal title="收款"
                    visible={this.state.showPayModal}
                    width={600}
                    onCancel={() => { this.setState({showPayModal: false}) }}
                    onOk={ this.payEvt.bind(this) }
                    maskClosable={false}>
                    <Form ref={this.state.payForm}>
                        <Form.Item name="payUserName" label="收款人">
                            <Input onChange={e => { this.setState({payUserName: e.target.value}) }}/>
                        </Form.Item>
                        <Form.Item name="paymentAmount" rules={[{required: true}]} label="收款金额">
                            <Input onChange={e => { this.setState({payMoney: e.target.value * 1}) }}/>
                        </Form.Item>
                        <Form.Item name="paymentRemark" label="备注">
                            <Input.TextArea  onChange={e => { this.setState({payRemark: e.target.value})}}/>
                        </Form.Item>
                    </Form>
                </Modal>
                
                {/* 完成弹出框 */}
                <Modal title="完成收货"
                    visible={this.state.showFinishModal}
                    width={600}
                    onCancel={() => { this.setState({showFinishModal: false}) }}
                    onOk={ this.finishEvt.bind(this) }
                    maskClosable={false}>
                    <Form ref={this.state.finishForm}>
                        <Form.Item name="payUserName" label="收货人">
                            <Input onChange={e => { this.setState({payUserName: e.target.value}) }}/>
                        </Form.Item>
                        <Form.Item name="salePrice" label="售价" rules={[{required: true}]}>
                            <Input onChange={e => { this.setState({salePrice: e.target.value * 1}) }}/>
                        </Form.Item>
                        <Form.Item name="actualWeight" label="实际数量" rules={[{required: true}]}>
                            <Input onChange={e => { this.setState({actualWeight: e.target.value * 1}) }}/>
                        </Form.Item>
                        <Form.Item name="finishRemark" label="备注">
                            <Input.TextArea  onChange={e => { this.setState({finishRemark: e.target.value})}}/>
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