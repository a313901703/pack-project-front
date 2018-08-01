import React, { PureComponent } from 'react';
import {} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Form from './_packForm';

export default class Pack extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Form />
      </PageHeaderLayout>
    );
  }
}
