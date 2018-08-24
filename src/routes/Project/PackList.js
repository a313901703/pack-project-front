import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Button, message, Select, DatePicker } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
export default class PackList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/fetchPacks',
    });
    dispatch({
      type: 'products/fetch',
      payload: { pageSize: false },
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
      type: 'products/fetchPacks',
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
      type: 'products/fetchPacks',
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
      if (typeof values.dataRange !== 'undefined' && values.dataRange) {
        values.start = values.dataRange[0].format('YYYY-MM-DD');
        values.end = values.dataRange[1].format('YYYY-MM-DD');
        delete values.dataRange;
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'products/fetchPacks',
        payload: values,
      });
    });
  };

  handleCreate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/project/package/add'));
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
          type: 'products/fetchPacks',
          payload: formValues,
        });
      },
    });
  };

  renderAdvancedForm() {
    const {
      form,
      products: { data },
    } = this.props;
    const { getFieldDecorator } = form;
    const projectsOption = data.list.map(v => <Option key={v.id}>{v.name}</Option>);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目">
              {getFieldDecorator('project')(
                <Select
                  showSearch
                  placeholder="选择项目类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {projectsOption}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="打包时间">{getFieldDecorator('dataRange')(<RangePicker />)}</FormItem>
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
      products: { packData },
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
        dataIndex: 'projects',
      },
      {
        title: '分支',
        dataIndex: 'branch',
      },
      {
        title: '版本号',
        dataIndex: 'tags',
      },
      {
        title: '打包时间',
        dataIndex: 'created_at',
      },
    ];

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreate()}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={packData}
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
