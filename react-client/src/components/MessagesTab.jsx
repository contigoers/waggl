import React from 'react';
import { connect } from 'react-redux';
import { Row, List, Icon, Button, Spin, Avatar, message, Form, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { getMessages, deleteMessage, sendMessage, updateReadStatus } from '../actions/messagingActions';
import { checkForNewMessages } from '../actions/loginActions';

const userStyle = {
  margin: '10px',
  border: '1px #872320 solid',
  backgroundColor: '#ffeded',
  width: '500px',
  float: 'right',
  padding: '5px',
  paddingLeft: '7px',
  borderRadius: '8px',
};
const contactStyle = {
  margin: '10px',
  border: '1px #1a4672 solid',
  backgroundColor: '#edf6ff',
  width: '500px',
  float: 'left',
  padding: '5px',
  paddingLeft: '7px',
  borderRadius: '8px',
};
const infiniteStyle = {
  backgroundColor: 'white',
  border: '1px solid black',
  overflow: 'auto',
  padding: '8px 24px',
  height: '500px',
  width: '80%',
  margin: 'auto',
  marginTop: '15px',
  marginBottom: '15px',
};

class MessagesTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentContact: null,
      visibleContacts: this.props.contacts === null ? null : this.props.contacts.slice(0, 10),
      visibleMessages: [],
      loading: false,
      hasMore: true,
      messageInput: '',
    };
    this.handleInfiniteContactsOnLoad = this.handleInfiniteContactsOnLoad.bind(this);
    this.handleInfiniteMessagesOnLoad = this.handleInfiniteMessagesOnLoad.bind(this);
    this.onInput = this.onInput.bind(this);
    this.sendMessageAndRender = this.sendMessageAndRender.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.renderContactsList = this.renderContactsList.bind(this);
    this.renderMessageFeed = this.renderMessageFeed.bind(this);
    this.getMessages = this.props.getMessages.bind(this);
    this.updateReadStatus = this.props.updateReadStatus.bind(this);
    this.checkForNewMessages = this.props.checkForNewMessages.bind(this);
  }

  onInput(e) {
    this.setState({ messageInput: e.target.value });
  }

  handleInfiniteContactsOnLoad() {
    this.setState({ loading: true });
    if (this.state.visibleContacts.length >= this.props.contacts.length) {
      message.warning('Loaded all contacts');
      this.setState({
        hasMore: false,
        loading: false,
      });
    } else {
      this.setState({
        visibleContacts: this.props.contacts.slice(0, this.state.visibleContacts.length + 5),
        loading: false,
      });
    }
  }

  handleInfiniteMessagesOnLoad() {
    this.setState({ loading: true });
    if (this.state.visibleMessages.length >= this.props.messages.length) {
      message.warning('Loaded all messages');
      this.setState({
        hasMore: false,
        loading: false,
      });
    } else {
      this.setState({
        visibleMessages: this.props.messages.slice(0, this.state.visibleMessages.length + 5),
        loading: false,
      });
    }
  }

  async sendMessageAndRender(e) {
    e.preventDefault();
    if (this.state.messageInput.length > 0) {
      const { id } = this.props.user;
      await this.props.sendMessage(id, this.state.currentContact.id, this.state.messageInput);
      if (this.props.messages.length > this.state.visibleMessages.length) {
        message.success('Message sent!');
      }
      this.setState({
        visibleMessages: this.props.messages.slice(0, this.props.messages.length + 1),
        messageInput: '',
      });
    } else {
      message.warning('Cant send an empty message');
    }
  }

  async deleteMessage(e) {
    await this.props.deleteMessage(e.target.id, this.props.user.id, this.state.currentContact.id);
    this.setState({
      visibleMessages: this.props.messages.slice(0, 10),
    });
  }

  renderContactsList() {
    this.setState({
      currentContact: null,
      visibleContacts: this.props.contacts.slice(0, 10),
      loading: false,
      hasMore: true,
    });
  }

  async renderMessageFeed(e) {
    this.checkForNewMessages(this.props.user.id);
    const { id } = e.target;
    const { name } = e.target.dataset;
    const { unreads } = e.target.dataset;
    await this.getMessages(this.props.user.id, id);
    this.setState({
      currentContact: { id, name },
      visibleMessages: this.props.messages.slice(0, 5),
      loading: false,
      hasMore: true,
    });
    if (unreads) {
      const type = this.props.user.org_id === 1 ? 'adopter' : 'org';
      this.updateReadStatus(this.props.user.id, id, type);
    }
  }

  render() {
    if (this.state.currentContact) {
      if (this.props.messages) {
        return (
          <div>
            <Row>
              <Button className="hoverable" onClick={this.renderContactsList} style={{ margin: '10px' }}> <Icon type="left" /> Return to contacts list </Button>
            </Row>
            <Row>
              <div style={{
                width: '80%',
                margin: 'auto',
                marginTop: '10px',
                marginBottom:
                '0px',
              }}
              >
                <Form onSubmit={this.sendMessageAndRender}>
                  <Form.Item>
                    <Input.TextArea
                      rows={2}
                      value={this.state.messageInput}
                      onChange={this.onInput}
                      placeholder="write message..."
                    />
                  </Form.Item>
                  <div style={{ width: '80%', margin: 'auto', marginTop: '0px' }}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" style={{ float: 'right', marginRight: '0px' }}> Send </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </Row>
            <Row>
              <div
                style={{
                      margin: 'auto',
                      width: '80%',
                      padding: '10px',
                    }}
              >
                    Messages with {this.state.currentContact.name}
              </div>
            </Row>
            <Row>
              <div style={infiniteStyle}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteMessagesOnLoad}
                  hasMore={!this.state.loading && this.state.hasMore}
                  useWindow={false}
                >
                  {
                    this.state.visibleMessages.map((msg) => {
                      const isMine = msg.sender_id === this.props.user.id;
                      const datetime = new Date(msg.sent);
                      const nameColor = isMine ? '#872320' : '#1a4672';
                      return (

                        <div key={msg.id} style={isMine ? userStyle : contactStyle}>
                          <div>
                            <span style={{ fontWeight: '700', color: nameColor }}> {isMine ? this.props.user.name : this.state.currentContact.name} </span>
                            <span
                              className="hoverable"
                              id={msg.id}
                              style={{ fontSize: 'x-small', float: 'right' }}
                              tabIndex={msg.id}
                              role="button"
                              onClick={this.deleteMessage}
                            >
                              {(msg.deleted || !isMine) ? '' : 'delete message'}
                            </span>
                          </div>
                          <div style={{ fontSize: 'smaller' }}>
                            {msg.deleted ? 'This message has been deleted.' : msg.message}
                          </div>
                          <div style={{ fontSize: 'x-small', marginTop: '3px', color: nameColor }}> sent at {datetime.toUTCString()} </div>
                        </div>
                      );
                    })
                  }
                </InfiniteScroll>
              </div>
            </Row>
            <Row>
              <Button className="hoverable" onClick={this.renderContactsList} style={{ margin: '10px' }}> <Icon type="left" /> Return to contacts list </Button>
            </Row>
          </div>
        );
      }
      return (<div style={{ margin: '15px' }}> Loading... </div>);
    }
    if (this.props.contacts) {
      if (!this.props.contacts.length) {
        return (<div> you have no messages </div>);
      }
      return (
        <div style={infiniteStyle}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteContactsOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.state.visibleContacts}
              renderItem={contact => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={contact.hasUnreads ? 'folder' : 'folder-open'} />}
                    title={
                      <div
                        className="hoverable"
                        id={contact.userId}
                        data-name={contact.name}
                        data-unreads={contact.hasUnreads}
                        tabIndex={contact.id}
                        role="link"
                        style={{ color: 'green' }}
                        onClick={this.renderMessageFeed}
                      >
                        {contact.name}
                      </div>}
                    description={contact.dogs.join(', ')}
                  />
                </List.Item>)
              }
            >
              {this.state.loading && this.statehasMore && <Spin />}
            </List>
          </InfiniteScroll>
        </div>
      );
    }
    return (<div style={{ margin: '15px' }}> Loading... </div>);
  }
}

const mapStateToProps = ({ fetchContacts, fetchMessages, storeUser }) => ({
  user: storeUser.user,
  contacts: fetchContacts.contacts,
  messages: fetchMessages.messages,
});

const mapDispatchToProps = {
  getMessages,
  sendMessage,
  deleteMessage,
  updateReadStatus,
  checkForNewMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesTab);
