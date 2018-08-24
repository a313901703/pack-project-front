import React, { PureComponent } from 'react';
import { Select, Icon, InputNumber } from 'antd';

const { Option } = Select;

export default class extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value || [],
    };
  }

  handelTypeChange = (value, index, type) => {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.map(item => ({ ...item }));
    newData[index][type] = value;
    onChange(newData);
  };

  handleAddRule = () => {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      type: '',
      opera: '',
      value: 0,
    });
    this.setState({ data: newData });
    onChange(newData);
  };

  handleDeleteRule(index) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter((item, i) => i !== index);
    this.setState({ data: newData });
    onChange(newData);
  }

  render() {
    const { data } = this.state;
    const items = data.map((k, i) => {
      return (
        <div className="item" key={k}>
          <Select
            style={{ width: 120 }}
            onChange={value => this.handelTypeChange(value, i, 'type')}
          >
            <Option key="distance">距离</Option>
            <Option key="order_nums">接单数</Option>
          </Select>
          <span style={{ marginRight: 15, marginLeft: 15 }}>-</span>
          <Select
            style={{ width: 120 }}
            onChange={value => this.handelTypeChange(value, i, 'opera')}
          >
            <Option key=">=">{'>='}</Option>
            <Option key="<=">{'<='}</Option>
          </Select>
          <span style={{ marginRight: 15, marginLeft: 15 }}>-</span>
          <InputNumber
            defaultValue={100}
            onChange={value => this.handelTypeChange(value, i, 'value')}
          />
          &nbsp;&nbsp;<Icon type="minus-circle-o" onClick={() => this.handleDeleteRule(i)} />
        </div>
      );
    });
    return (
      <div>
        {items}
        <span onClick={this.handleAddRule}>
          <Icon type="plus-circle-o" /> 添加规则
        </span>
      </div>
    );
  }
}
