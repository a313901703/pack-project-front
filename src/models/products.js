import {
  queryAll,
  queryOne,
  addProjects,
  editProject,
  deleteProject,
  addPack,
} from '../services/project';

export default {
  namespace: 'products',

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
      if (response) {
        yield put({
          type: 'saveProducts',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProjects, payload);
      if (response) {
        yield put({
          type: 'saveProducts',
          payload: response,
        });
      }
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editProject, payload);
      if (response) {
        yield put({
          type: 'saveProducts',
          payload: response,
        });
      }
      if (callback) callback();
    },
    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(queryOne, payload);
      if (response) {
        yield put({
          type: 'setProduct',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteProject, payload);
      if (response) {
        yield put({
          type: 'removeRule',
          payload: response,
        });
      }
      if (callback) callback();
    },
    *pack({ payload, callback }, { call, put }) {
      const response = yield call(addPack, payload);
      if (response) {
        yield put({
          type: 'addPack',
          payload: response,
        });
      }
      if (callback) callback();
    },
    *clearItem({ callback }, { put }) {
      yield put({
        type: 'setProduct',
        payload: {},
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveProducts(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setProduct(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
    removeRule(state) {
      return state;
    },
    addPack(state) {
      return state;
    },
  },
};
