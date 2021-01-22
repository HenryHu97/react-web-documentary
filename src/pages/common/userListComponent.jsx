import React, { Component, createRef } from 'react'
import { Table, Modal, Input, Button, Pagination, message } from 'antd'
import { getUserListApi } from '../../apis/userApi'
import { ExclamationCircleOutlined } from '@ant-design/icons'

let timer = null

class userComponent extends Component {

    state = {
        userSource: [],
        column:
            [
                {
                    title: '用户姓名',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '部门',
                    dataIndex: 'dept',
                    key: 'dept'
                },
                {
                    title: '职位',
                    dataIndex: 'duties',
                    key: 'duties'
                },
                {
                    title: '电话',
                    dataIndex: 'phone',
                    key: 'phone'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    width: 400
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
            case 'select':
                console.log(data)
                this.props.selectPrincipal(data.name, false)
                break

            default:
                break
        }
    }


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
        let res = await getUserListApi(
            {name: this.state.name, page: this.state.page, size: this.state.size}
        )
        if(res.code === 200) {
            this.setState({
                userSource: res.data.rows.map((item, i) => {
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
                    <Input value={this.state.name} onChange={ evt => {
                        this.setState({name: evt.target.value})
                    } }></Input>
                    <Button type='primary' onClick={this.getlist.bind(this)}>查询</Button>
                </header>
                <article ref={this.state.tableNode}>
                    <Table 
                        dataSource={this.state.userSource} 
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

export default userComponent