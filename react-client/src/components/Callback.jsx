import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Input, Select, Radio, Button, message } from 'antd';
import { PhoneNumberUtil } from 'google-libphonenumber';
import axios from 'axios';

import states from '../assets/states';

import { storeUserId } from '../actions/loginActions';
import { getFavorites } from '../actions/searchActions';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const phoneUtil = PhoneNumberUtil.getInstance();

const Callback = Form.create()(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      phoneDirty: false,
      numberIsValid: false,
      first: false,
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.storeUser = this.props.storeUserId.bind(this);
    this.validateNumber = this.validateNumber.bind(this);
    this.getFavorites = this.props.getFavorites.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      this.setState({ phoneDirty: true });
      if (!err && this.state.numberIsValid) {
        axios.patch('/auth/facebook', { ...values, id: this.props.user.id })
          .then(({ data }) => {
            this.setState({ first: true });
            this.storeUser({ user: data.user });
            this.getFavorites(data.user.adopterId);
            form.resetFields();
          })
          .catch((error) => {
            const { status } = error.response;
            const info = error.response.data;

            if (status === 500) {
              message.error('Sorry, an unknown error occurred.', 5);
            } else if (status === 418 && info === 'email taken') {
              message.error('Sorry, this email is already in use.', 5);
            } else if (status === 418 && info === 'username taken') {
              message.error('Sorry, this username is already in use.', 5);
            } else if (status === 418 && info === 'username and email taken') {
              message.error('Sorry, this username and email are already in use.', 5);
            } else if (status === 418 && info === 'org name taken') {
              message.error('Sorry, this organization name already in use.', 5);
            }
          });
      }
    });
  }

  handleBlur({ target: { id, value } }) {
    const key = `${id}Dirty`;
    this.setState({ [key]: this.state[key] || !!value });
  }

  validateNumber(rule, value, callback) {
    if (!value) {
      callback('phone is required');
      return;
    }
    const number = phoneUtil.parseAndKeepRawInput(value, 'US');
    const numberIsValid = phoneUtil.isValidNumber(number);
    this.setState({
      numberIsValid,
    });
    callback();
  }

  render() {
    if (this.props.user && this.props.user.email) return <Redirect to="/" />;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '1',
    })(<Select style={{ width: 70 }}>
      <Option value="1">+1</Option>
    </Select>); // eslint-disable-line

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please enter your E-mail!',
              }],
            })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Username"
        >
          {getFieldDecorator('username', {
              rules: [{
                required: true, message: 'Please enter a username!',
              }],
            })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
          validateStatus={!this.state.numberIsValid && this.state.phoneDirty ? 'error' : null}
          help={!this.state.numberIsValid && this.state.phoneDirty ? 'Please enter a valid phone number' : null}
        >
          {getFieldDecorator('phone', {
            rules: [{
              required: true, validator: this.validateNumber,
            }],
          })(<Input
            onChange={this.handleChange}
            addonBefore={prefixSelector}
            style={{ width: '100%' }}
            onBlur={this.handleBlur}
          />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Street Address"
        >
          {getFieldDecorator('address', {
              rules: [{
                required: true,
                message: 'Please enter your street address!',
              }],
            })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="City"
        >
          {getFieldDecorator('city', {
              rules: [{
                required: true,
                message: 'Please enter your city!',
              }],
              })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="State"
        >
          {getFieldDecorator('state', {
              rules: [{
                required: true,
                message: 'Please enter your state!',
              }],
              })(<Select
                style={{ width: 120 }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                optionFilterProp="children"
                showSearch
              >
                {states.map(state => <Option key={state} value={state}>{state}</Option>)}
              </Select>) /* eslint-disable-line */}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="ZIP Code"
        >
          {getFieldDecorator('zipcode', {
              rules: [{
                required: true,
                message: 'Please enter your city!',
              }, {
                pattern: '[0-9]{5}',
                message: 'Please enter a five-digit ZIP!',
              }],
            })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Do you have other pets?"
        >
          {getFieldDecorator('pets', {
              rules: [{
                required: true,
                message: 'Please choose an option!',
              }],
            })(<RadioGroup style={{ width: '100%' }}>
              <Radio value="yes">yes</Radio>
              <Radio value="no">no</Radio>
            </RadioGroup>) /* eslint-disable-line */}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Living arrangement:"
        >
          {getFieldDecorator('house', {
              rules: [{
                required: true,
                message: 'Please choose an option!',
              }],
            })(<RadioGroup style={{ width: '100%' }}>
              <Radio value="house">house</Radio>
              <Radio value="apartment">apartment</Radio>
              <Radio value="other">other</Radio>
            </RadioGroup>) /* eslint-disable-line */}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Update info</Button>
        </FormItem>
      </Form>
    );
  }
});

const mapStateToProps = state => ({ user: state.storeUser.user });

export default withRouter(connect(mapStateToProps, { storeUserId, getFavorites })(Callback));
