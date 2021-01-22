import React, { Component, createRef } from 'react'
import { Table, Modal, Input, Button, Pagination, message } from 'antd'
import { getProjectList, deleteProjectApi } from '../../apis/userApi'
import { ExclamationCircleOutlined } from '@ant-design/icons'

let timer = null


class List extends Component {

    state = {
        projectSource: [],
        column:
            [
                {
                    title: '项目名称',
                    dataIndex: 'name',
                },
                {
                    title: '项目负责人',
                    dataIndex: 'liableName'
                },
                {
                    title: '项目签订时间',
                    dataIndex: 'signTime',
                    render: 
                        time => {
                            if (time) {
                                return (<span>{time.slice(0,10)}</span>)
                            }
                        }
                },
                {
                    title: '工程地址',
                    dataIndex: 'address',
                },
                {
                    title: '业主',
                    dataIndex: 'ownerName'
                },
                {
                    title: '备注',
                    dataIndex: 'remark'
                },
                {
                    title: '操作',
                    render: data => {
                        return (
                            <>
                                <span className='editBtn delete' onClick={ this.editEvt.bind(this, data, 'delete') }>删除</span>
                                <span className='editBtn' onClick={ this.editEvt.bind(this, data, 'edit') }>修改</span>
                            </>
                        )
                    }

                }
            ],
        tableHeight: 0,
        tableNode: createRef(),
        name: '',
        page: 1,
        size: 15,
        total: 0

    }


    editEvt (data, type) {
        switch (type) {
            case 'delete':
                console.log(data)
                Modal.confirm({
                    title: '删除确认',
                    icon: <ExclamationCircleOutlined />,
                    content: `确认删除 [${data.name}] 这条数据吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                        let res = await deleteProjectApi(data.id)
                        if(res.code === 200) {
                            message.success('删除项目信息成功！')
                            this.getlist()
                        } else {
                            message.error('删除项目信息失败！')
                        }
                    }
                  });
                break
            case 'edit':
                this.props.history.push({pathname: '/project/edit', isEdit: true, projectId: data.id})
                break
            case 'add':
                this.props.history.push({pathname: '/project/edit', isEdit: false ,route: 'add'})
                break
            default:
                break
        }
    }


    componentDidMount () {
        this.getlist()
        console.log(this.state.tableNode)
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
        let res = await getProjectList(
            {name: this.state.name, page: this.state.page, size: this.state.size}
        )
        if(res.code === 200) {
            this.setState({
                projectSource: res.data.rows.map((item, i) => {
                    item.key = i
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
            </div>
        )
    }
}

export default List