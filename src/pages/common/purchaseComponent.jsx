import React, { Component, createRef } from 'react'
import { Table, Modal, Input, Button, Pagination, message } from 'antd'
import { getProjectList, getMaterialListApi, getSupplierListApi, getUserListApi } from '../../apis/userApi'
import { ExclamationCircleOutlined } from '@ant-design/icons'


let timer = null

class projectComponent extends Component {

    // 项目名称
    projectList = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '负责人姓名',
            dataIndex: 'liableName',
            key: 'liableName'
        },
        {
            title: '项目启动时间',
            dataIndex: 'signTime',
            key: 'signTime'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            render: data => {
                return (
                    <>
                        <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'select') }>选择</span>
                    </>
                )
            }

        }
    ]
    // 材料名称
    materialList = [
        {
            title: '材料编码',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '材料名称',
            dataIndex: 'name',
            key: 'name',
            width: 800
        },
        {
            title: '操作',
            render: data => {
                return (
                    <>
                        <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'select') }>选择</span>
                    </>
                )
            }

        }
    ]
    // 供应商名称
    supplierList = [
        {
            title: '供应商名字',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '联系人',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            render: data => {
                return (
                    <>
                        <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'select') }>选择</span>
                    </>
                )
            }

        }
    ]
    // 审批人
    approveList = [
        {
            title: '审批人姓名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '部门',
            dataIndex: 'dept',
            key: 'dept',
        },
        {
            title: '职位',
            dataIndex: 'duties',
            key: 'duties',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ]
    state = {
        selectedRowKeys: [],

        source: [],
        column: [],
        tableHeight: 0,
        tableNode: createRef(),
        name: '',
        page: 1,
        size: 15,
        total: 0
    }
    
    editEvt (data, type) {
        switch (type) {
            case 'select':
                this.props.selectItem({name: data.name, shouModa: false, type: this.props.type})
                break
            case 'multiSelect':
                this.props.selectItem({names: data, shouModa: false, type: this.props.type})
            default:
                break
        }
    }



    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };





    componentDidMount () {

        console.log(this,'==============')

        this.getlist()
        if(this.state.tableNode.current) {
            this.setState({
                tableHeight: this.state.tableNode.current.clientHeight - 16 - 39
            })
        }

        window.addEventListener('resize', this.tableResize)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.tableResize)
      clearTimeout(timer)
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
        let res
        switch (this.props.type) {
            case 'projectName':
                res = await getProjectList(
                    {name: this.state.name, page: this.state.page, size: this.state.size}
                )
                if(res.code === 200) {
                    this.setState({
                        source: res.data.rows.map((item, i) => {
                            item.key = i
                            return item
                        }),
                        total: res.data.total,
                        column: this.projectList
                    })
                }
                break
            case 'materialName':
                res = await getMaterialListApi()
                if(res.code === 200) {
                    this.setState({
                        source: res.data.rows.map((item, i) => {
                            item.key = i
                            return item
                        }),
                        total: res.data.total,
                        column: this.materialList
                    })
                }
                break
            case 'supplierName':
                res = await getSupplierListApi({name: this.state.name, page: this.state.page, size: this.state.size})
                if(res.code === 200) {
                    this.setState({
                        source: res.data.rows.map((item, i) => {
                            item.key = i
                            return item
                        }),
                        total: res.data.total,
                        column: this.supplierList
                    })
                }
                break
            case 'approveName':
                res = await getUserListApi({name: this.state.name, page: this.state.page, size: this.state.size})
                if(res.code === 200) {
                    this.setState({
                        source: res.data.rows.map((item, i) => {
                            item.key = item.id
                            return item
                        }),
                        total: res.data.total,
                        column: this.approveList
                    })
                }
                break



            default:
                break
        }
    }




    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
          };
          
        return (
            <div className='page-layout-container'>
                <header>
                    {
                        this.props.type === 'materialName' || 
                        <>
                            <Input value={this.state.name} onChange={evt => {
                                this.setState({ name: evt.target.value })
                            }}></Input>
                            <Button type='primary' onClick={this.getlist.bind(this)}>查询</Button>
                            {
                                this.props.type === 'approveName' &&
                                <Button type='primary' onClick={this.editEvt.bind(this, this.state.selectedRowKeys, 'multiSelect')}>确定</Button>
                            }
                        </>
                    }
                    
                </header>
                <article ref={this.state.tableNode}>
                    {
                        this.props.type === 'approveName' ? 
                            (
                                <Table
                                    rowSelection={rowSelection}
                                    dataSource={this.state.source}
                                    columns={this.state.column}
                                    pagination={false}
                                    size='small'
                                    scroll={{ y: this.state.tableHeight }}
                                />
                            )
                        :
                            (
                                <Table
                                    dataSource={this.state.source}
                                    columns={this.state.column}
                                    pagination={false}
                                    size='small'
                                    scroll={{ y: this.state.tableHeight }}
                                />
                            )
                    }
                    
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
                                this.getlist()
                            })
                        }}
                    />
                </footer>
            </div>
        )
    }
}

export default projectComponent