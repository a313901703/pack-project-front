import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Card, Select, message } from 'antd';

const { Option } = Select;

const FormItem = Form.Item;

@connect(({ products, loading }) => ({
  products,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class AddApi extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      _id: props.id,
      item: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { _id } = this.state;
    const that = this;
    if (_id) {
      dispatch({
        type: 'products/fetchOne',
        payload: _id,
        callback: res => {
          that.setState({
            item: res,
          });
        },
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { _id } = this.state;
        // console.log(values)
        // return false;
        if (_id) {
          dispatch({
            type: 'products/edit',
            payload: {
              id: _id,
              data: values,
            },
            callback: () => {
              message.success('修改成功');
              dispatch(routerRedux.goBack());
            },
          });
        } else {
          dispatch({
            type: 'products/add',
            payload: values,
            callback: () => {
              message.success('添加成功');
              dispatch(routerRedux.goBack());
            },
          });
        }
      }
    });
  };

  goback() {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  }

  render() {
    const { submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { item } = this.state;

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
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="项目名称">
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: '请输入项目名称',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="项目类型">
            {getFieldDecorator('type', {
              initialValue: item.type,
            })(
              <Select
                showSearch
                placeholder="选择项目类型"
                optionFilterProp="children"
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
              initialValue: item.branch,
            })(
              <Select
                mode="tags"
                showSearch
                placeholder="选择分支"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="master">master</Option>
                <Option value="release">release</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="路径">
            {getFieldDecorator('path', {
              initialValue: item.path,
              rules: [
                {
                  required: true,
                  message: '请输入项目路径',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="目标文件">
            {getFieldDecorator('target', {
              initialValue: item.target || '~/packages/',
              rules: [
                {
                  required: true,
                  message: '请输入目标文件路径',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('desc', {
              initialValue: item.desc,
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
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
