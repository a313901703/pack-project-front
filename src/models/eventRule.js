import { addApis, queryApi, editApis, removeApis } from '../services/datasource';
import { queryAll } from '../services/event_rules';

export default {
  namespace: 'eventRule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    item: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      yield put({
        type: 'saveRules',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addApis, payload);
      yield put({
        type: 'saveRules',
        payload: response,
      });
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editApis, payload);
      yield put({
        type: 'saveRules',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(queryApi, payload);
      yield put({
        type: 'setRule',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeApis, payload);
      yield put({
        type: 'removeRule',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveRules(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setRule(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
    removeRule(state) {
      return state;
    },
  },
};
