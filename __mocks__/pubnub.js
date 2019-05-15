let authFailed;
let authForbidden;
let messageCallback;

const pubnub = {
  publish: jest.fn((message, callback) => {
    callback({
      error: authFailed,
      statusCode: authForbidden ? 403 : ''
    });
  }),
  addListener: jest.fn(({ message }) => {
    messageCallback = message;
  }),
  subscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
  setAuthFailed(isFailed) {
    authFailed = isFailed;
  },
  setAuthForbidden(isForbidden) {
    authForbidden = isForbidden;
  },
  sendMessage(message) {
    messageCallback({
      message
    });
  }
};

function PubNub() {
  return pubnub;
}

module.exports = PubNub;
