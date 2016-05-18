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
} from 'constants/settings';

const initialState = {
  member: {
    data: [],
    error: null,
    fetching: false,
    modal: {
      isOpened: false,
      error: null,
      fetching: false,
      type: '',
    },
  },
  notification: {
    data: null,
    fetching: false,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // MEMBER
    case SETTINGS_MEMBER_FETCH_ERROR:
      return {
        ...state,
        member: {
          ...state.member,
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
    default:
      return state;
  }
}
