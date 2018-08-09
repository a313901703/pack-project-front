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
export default class PackForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      projectSelected: {},
      // formValue: {},
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
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'products/pack',
          payload: values,
          callback: () => {
            message.success('添加成功');
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
    const { submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { projectSelected } = this.state;
    // const { formValue } = this.state;
    const {
      products: { data },
    } = this.props;

    const projectOptions = data.list.map(project => (
      <Option key={project.id}>{project.name}</Option>
    ));
    const branchOptions = (projectSelected.branch || []).map(value => (
      <Option key={value}>{value}</Option>
    ));

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

          <FormItem {...formItemLayout} label="路径">
            {getFieldDecorator('path', {
              initialValue: projectSelected.path,
              rules: [
                {
                  required: true,
                  message: '请输入项目路径',
                },
              ],
            })(<Input disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label="包名">
            {getFieldDecorator('package_name', {
              initialValue: projectSelected.name || '',
              rules: [
                {
                  required: true,
                  message: '包名',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="分支">
            {getFieldDecorator('branch', {
              // initialValue: projectSelected.branch || [],
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择分支"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {branchOptions}
              </Select>
            )}
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
