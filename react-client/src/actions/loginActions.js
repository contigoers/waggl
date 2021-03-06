import axios from 'axios';

const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
const STORE_USER_ID = 'STORE_USER_ID';
const LOGOUT = 'LOGOUT';
const CHECK_MESSAGES = 'CHECK_MESSAGES';

const toggleLoginModal = () => (
  {
    type: TOGGLE_LOGIN_MODAL,
  }
);

const storeUserId = ({ user }) => (
  {
    type: STORE_USER_ID,
    user,
  }
);

const logoutUser = () => (
  {
    type: LOGOUT,
  }
);

const checkForNewMessages = async (userId) => {
  const { data } = await axios.get('/messages/unread', { params: { userId } });
  return {
    type: CHECK_MESSAGES,
    data,
  };
};

export {
  TOGGLE_LOGIN_MODAL,
  toggleLoginModal,
  STORE_USER_ID,
  storeUserId,
  LOGOUT,
  logoutUser,
  CHECK_MESSAGES,
  checkForNewMessages,
};
