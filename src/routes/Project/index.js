import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, Divider, message } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ products, loading }) => ({
  products,
  loading: loading.models.products,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'products/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'products/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'products/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      // let dataRange = values.dataRange
      if (typeof values.dataRange !== 'undefined' && values.dataRange) {
        values.start = values.dataRange[0].format('YYYY-MM-DD');
        values.end = values.dataRange[1].format('YYYY-MM-DD');
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'products/fetch',
        payload: values,
      });
    });
  };

  handleCreate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/project/add'));
  };

  handelEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/project/edit/${id}`));
  };

  handelDelete = id => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'products/remove',
      payload: id,
      callback: () => {
        message.success('删除成功');
        dispatch({
          type: 'products/fetch',
          payload: formValues,
        });
      },
    });
  };

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">{getFieldDecorator('name')(<Input />)}</FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="街道">{getFieldDecorator('street')(<Input />)}</FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      products: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '项目名称',
        dataIndex: 'name',
      },
      {
        title: '项目路径',
        dataIndex: 'path',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        // sorter: true,
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => this.handelEdit(record.id)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handelDelete(record.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreate()}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
