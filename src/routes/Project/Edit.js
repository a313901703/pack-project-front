import React, { PureComponent } from 'react';
import {} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ApiForm from './_form';

export default class Edit extends PureComponent {
  render() {
    const { match } = this.props;
    const { id } = match.params;
    return (
      <PageHeaderLayout>
        <ApiForm id={id} />
      </PageHeaderLayout>
    );
  }
}
