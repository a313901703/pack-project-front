import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Card, Select, message } from 'antd';
import AddRule from './_add_rule';

const { Option } = Select;

const FormItem = Form.Item;

@connect(({ eventRule, loading }) => ({
  eventRule,
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
        type: 'eventRule/fetchOne',
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
            type: 'eventRule/edit',
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
            type: 'eventRule/add',
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
          <FormItem {...formItemLayout} label="事件类型">
            {getFieldDecorator('event_type', {
              initialValue: formValue.event_type,
            })(
              <Select
                showSearch
                placeholder="选择事件类型"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="所属街道">
            {getFieldDecorator('street', {
              initialValue: formValue.street,
            })(
              <Select
                showSearch
                placeholder="选择街道"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="网格中心">
            {getFieldDecorator('grid_center', {
              initialValue: formValue.street,
            })(
              <Select
                showSearch
                placeholder="选择网格中心"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="规则">
            {getFieldDecorator('filter', {
              // initialValue: formValue.street,
            })(<AddRule />)}
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
