import React, { PureComponent } from 'react';
import {} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ApiForm from './_form';

export default class AddApi extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <ApiForm />
      </PageHeaderLayout>
    );
  }
}
