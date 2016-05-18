import {
  SETTINGS_MEMBER_FETCH_ERROR,
  SETTINGS_MEMBER_FETCHED,
  SETTINGS_MEMBER_FETCHING,
  SETTINGS_MEMBER_INIT,
  SETTINGS_MEMBER_MODAL_CLOSE,
  SETTINGS_MEMBER_MODAL_FETCH_ERROR,
  SETTINGS_MEMBER_MODAL_FETCHED,
  SETTINGS_MEMBER_MODAL_FETCHING,
  SETTINGS_MEMBER_MODAL_OPEN,
  SETTINGS_NOTIFICATION_FETCH_ERROR,
  SETTINGS_NOTIFICATION_FETCHED,
  SETTINGS_NOTIFICATION_FETCHING,
  SETTINGS_NOTIFICATION_INIT,
  SETTINGS_NOTIFICATION_MODAL_CLOSE,
  SETTINGS_NOTIFICATION_MODAL_FETCH_ERROR,
  SETTINGS_NOTIFICATION_MODAL_FETCHED,
  SETTINGS_NOTIFICATION_MODAL_FETCHING,
  SETTINGS_NOTIFICATION_MODAL_OPEN,
} from 'constants/settings';

const initialState = {
  member: {
    data: [],
    error: null,
    fetching: false,
    modal: {
      data: null,
      error: null,
      fetching: false,
      isOpened: false,
      type: '',
    },
  },
  notification: {
    data: null,
    error: null,
    fetching: false,
    modal: {
      isOpened: false,
      error: null,
      fetching: false,
    },
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // Member
    case SETTINGS_MEMBER_FETCH_ERROR:
      return {
        ...state,
        member: {
          ...state.member,
          data: [],
          error: action.error,
          fetching: false,
        },
      };
    case SETTINGS_MEMBER_FETCHED:
      return {
        ...state,
        member: {
          ...state.member,
          data: action.data,
          fetching: false,
        },
      };
    case SETTINGS_MEMBER_FETCHING:
      return {
        ...state,
        member: {
          ...state.member,
          data: [],
          fetching: true,
        },
      };
    case SETTINGS_MEMBER_INIT:
      return {
        ...state,
        member: initialState.member,
      };
    case SETTINGS_MEMBER_MODAL_CLOSE:
      return {
        ...state,
        member: {
          ...state.member,
          modal: initialState.member.modal,
        },
      };
    case SETTINGS_MEMBER_MODAL_FETCH_ERROR:
      return {
        ...state,
        member: {
          ...state.member,
          modal: {
            ...state.member.modal,
            error: action.error,
            fetching: false,
          },
        },
      };
    case SETTINGS_MEMBER_MODAL_FETCHED:
      return {
        ...state,
        member: {
          ...state.member,
          data: action.data,
          modal: {
            ...state.member.modal,
            fetching: false,
          },
        },
      };
    case SETTINGS_MEMBER_MODAL_FETCHING:
      return {
        ...state,
        member: {
          ...state.member,
          modal: {
            ...state.member.modal,
            fetching: true,
          },
        },
      };
    case SETTINGS_MEMBER_MODAL_OPEN:
      return {
        ...state,
        member: {
          ...state.member,
          modal: {
            ...state.member.modal,
            data: action.data,
            isOpened: true,
            type: action.modal,
          },
        },
      };
      // Notification
    case SETTINGS_NOTIFICATION_FETCH_ERROR:
      return {
        ...state,
        notification: {
          ...state.notification,
          error: action.error,
          fetching: false,
        },
      };
    case SETTINGS_NOTIFICATION_FETCHED:
      return {
        ...state,
        notification: {
          ...state.notification,
          data: action.data,
          fetching: false,
        },
      };
    case SETTINGS_NOTIFICATION_FETCHING:
      return {
        ...state,
        notification: {
          ...state.notification,
          fetching: true,
        },
      };
    case SETTINGS_NOTIFICATION_INIT:
      return {
        ...state,
        notification: initialState.notification,
      };
    case SETTINGS_NOTIFICATION_MODAL_CLOSE:
      return {
        ...state,
        notification: {
          ...state.notification,
          modal: initialState.notification.modal,
        },
      };
    case SETTINGS_NOTIFICATION_MODAL_FETCH_ERROR:
      return {
        ...state,
        notification: {
          ...state.notification,
          modal: {
            ...state.notification.modal,
            error: action.error,
            fetching: false,
          },
        },
      };
    case SETTINGS_NOTIFICATION_MODAL_FETCHED:
      return {
        ...state,
        notification: {
          ...state.notification,
          data: action.data,
          modal: {
            ...state.notification.modal,
            fetching: false,
          },
        },
      };
    case SETTINGS_NOTIFICATION_MODAL_FETCHING:
      return {
        ...state,
        notification: {
          ...state.notification,
          modal: {
            ...state.notification.modal,
            fetching: true,
          },
        },
      };
    case SETTINGS_NOTIFICATION_MODAL_OPEN:
      return {
        ...state,
        notification: {
          ...state.notification,
          modal: {
            ...state.notification.modal,
            data: action.data,
            isOpened: true,
          },
        },
      };
    default:
      return state;
  }
}
