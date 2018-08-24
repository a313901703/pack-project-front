import React, { PureComponent } from 'react';

import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Card, Select, message, Alert } from 'antd';

const { Option } = Select;

const FormItem = Form.Item;

@connect(({ products, loading }) => ({
  products,
  submitting: loading.effects['products/pack'],
}))
@Form.create()
export default class PackForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      projectSelected: {},
      retPack: {
        status: 0,
        msg: '',
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/fetch',
    });
  }

  getRowByKey(key) {
    const {
      products: { data },
    } = this.props;
    const targets = data.list.filter(item => item.id === key);
    return targets[0];
  }

  handleSubmit = e => {
    // const _this = this
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'products/pack',
          payload: values,
          callback: res => {
            if (res.status === 0) {
              message.success('添加成功');
              dispatch(routerRedux.goBack());
            } else {
              if (res.status === 127) {
                res.msg = 'Can not find command';
              } else if (res.status === 128) {
                res.msg = 'Fatal Signal';
              } else if (res.status === 126) {
                res.msg = 'Can not execute';
              }
              this.setState({
                retPack: res,
              });
            }
          },
        });
      }
    });
  };

  handleChangeProject(id) {
    const proId = Number(id);
    const value = this.getRowByKey(proId);
    this.setState({
      projectSelected: value,
    });
  }

  goback() {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  }

  render() {
    const {
      products: { data },
      submitting,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { projectSelected, retPack } = this.state;

    const projectOptions = data.list.map(project => (
      <Option key={project.id}>{project.name}</Option>
    ));
    // const branchOptions = (projectSelected.branch || []).map(value => (
    //   <Option key={value}>{value}</Option>
    // ));

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 },
      },
    };

    return (
      <Card bordered={false}>
        {retPack.status ? (
          <Alert message="Error" description={retPack.msg} type="error" showIcon />
        ) : (
          <div />
        )}
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="项目">
            {getFieldDecorator('project', {
              // initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: '请选择项目',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="请选择项目"
                optionFilterProp="children"
                onChange={v => this.handleChangeProject(v)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectOptions}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="项目类型">
            {getFieldDecorator('type', {
              initialValue: projectSelected.type,
            })(
              <Select
                showSearch
                placeholder="选择项目类型"
                optionFilterProp="children"
                disabled
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="php">php</Option>
                <Option value="vue">vue</Option>
                <Option value="react">react</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="分支">
            {getFieldDecorator('branch', {
              // initialValue: projectSelected.branch || [],
              rules: [
                {
                  required: true,
                  message: '分支必填',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="版本号">
            {getFieldDecorator('tags', {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: '版本号必填',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="目标路径">
            {getFieldDecorator('target', {
              initialValue: '/home/amos/packages',
              rules: [
                {
                  required: true,
                  message: '目标路径必填',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              打包
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => this.goback()}>
              返回
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
