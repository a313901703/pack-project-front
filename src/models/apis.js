import { queryApis, addApis, queryApi, editApis, removeApis } from '../services/datasource';

export default {
  namespace: 'apis',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    item: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryApis, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addApis, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editApis, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(queryApi, payload);
      yield put({
        type: 'setItem',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeApis, payload);
      yield put({
        type: 'removeApi',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setItem(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
    removeApi(state) {
      return state;
    },
  },
};
