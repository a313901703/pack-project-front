import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Card, Radio, message } from 'antd';
import TableForm from '../TableForm';

const FormItem = Form.Item;

@connect(({ apis, loading }) => ({
  apis,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class AddApi extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      apiId: props.id,
      formValue: {},
    };
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    if (id) {
      dispatch({
        type: 'apis/fetchOne',
        payload: id,
        callback: res => {
          this.setState({
            formValue: res,
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
        const { apiId } = this.state;
        if (apiId) {
          dispatch({
            type: 'apis/edit',
            payload: {
              id: apiId,
              data: values,
            },
            callback: () => {
              message.success('修改成功');
              dispatch(routerRedux.goBack());
            },
          });
        } else {
          dispatch({
            type: 'apis/add',
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

  render() {
    const { submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { formValue } = this.state;
    // console.log(formValue.params)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 18 },
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
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              initialValue: formValue.name,
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="API地址">
            {getFieldDecorator('apiUrl', {
              initialValue: formValue.apiUrl,
              rules: [
                {
                  required: true,
                  message: '请输入API地址',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="请求方式">
            {getFieldDecorator('method', {
              initialValue: formValue.method || 'GET',
            })(
              <Radio.Group>
                <Radio value="GET">GET</Radio>
                <Radio value="POST">POST</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数">
            {getFieldDecorator('params', {
              initialValue: formValue.params || [],
            })(<TableForm />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
            <Button style={{ marginLeft: 8 }}>保存</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
