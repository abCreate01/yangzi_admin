import React, { Component } from 'react';
import { Table, Button, Row, Col, Card } from 'antd';
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import axios from '../../utils/axios';

export default class ToDo extends Component {

    constructor() {
        super()
        this.state = {
            dataSource: [],
            columns: []
        }
    }

    handleCheck = (record) => {
        console.log('record', record)
        this.props.check(record.taskId)
    }

    componentDidMount() {
        axios.post(this.props.selectUrl, {
            userId: 'cda8d33a-0ba0-4210-9348-884e6f4852c2'
        }).then(({ data }) => {
            // console.log('jsyb', data)
            let showData = data.data.map((v, i) => ({ ...v, key: i + '' }))
            // console.log('showData', showData, Object.keys(data.data[0]))
            let keys = showData.length > 0 ? Object.keys(data.data[0]) : [];
            this.setState({
                dataSource: showData,
                columns: keys.map(
                    key => ({
                        title: key,
                        dataIndex: key,
                    })
                )
            }, () => {
                this.setState({
                    columns: [...this.state.columns,
                    {
                        title: '操作',
                        key: '查阅',
                        render: (text, record) => (
                            <span>
                                <Button icon="search" onClick={() => this.handleCheck(record)}>查阅</Button>
                            </span>
                        ),
                    }
                    ]
                })
            })
        })
    }

    beautifyCard = component => {
        return (
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            {component}
                        </Card>
                    </div>
                </Col>
            </Row>
        )
    }


    render() {
        const { dataSource, columns } = this.state;
        console.log(dataSource)

        return (
            <div className="gutter-example">
                <BreadcrumbCustom />
                {this.beautifyCard(<div>
                    <Table dataSource={dataSource} columns={columns} />
                </div>)}
            </div>
        );
    }
}