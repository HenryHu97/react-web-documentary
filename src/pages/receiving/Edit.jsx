import React, { Component, createRef } from 'react'
import { Input, Button, Row, Col, Form, Modal, DatePicker, Cascader, message, Select } from 'antd'


let isEdit
class Edit extends Component {
    state = {
        form: createRef()
    }


    async componentDidMount () {
        console.log(this)
        isEdit = this.props.location.isEdit || false
        let receivingId = this.props.location.receivingId

    }


    
    async editEvt (type) {
        switch (type) {
            case 'save':
                try {
                    await this.state.form.current.validateFields()
                    if (isEdit) {
                        this.updatePurchase()
                    } else {
                        this.addPurchase()
                    }
                } catch (e) {}
            break
                
            case 'return':
                this.props.history.goBack()
                break
            default:
                break
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
                                    <Input  readOnly placeholder='编码系统自动生成' onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="建单人" name='id' rules={[{ required: false }]}                                >
                                    <Input  readOnly  onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item label="建单时间" name='createTime' >
                                    <DatePicker  style={{ width: '100%' }} placeholder='选择日期'  onChange={evt => {
                                            this.setState({ createTime: evt}) 
                                          }} />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="采购单" name='projectName' rules={[{ required: true }]}                                >
                                    <Input.Search placeholder='请选择采购单' enterButton readOnly  onSearch={() => this.setState({modaProject: true}) }/>
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="采购人" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="项目名称" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="供应商" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="材料名称" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="计量单位" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item  label="重量" name='id' rules={[{ required: false }]}                                >
                                    <Input readOnly onChange={e => this.setState({id: e.target.value}) }/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item  label="备注" name='id' rules={[{ required: false }]}                                >
                                    <Input onChange={e => this.setState({id: e.target.value}) }/>
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