import { createSlice } from '@reduxjs/toolkit';

const accountInitialState = {
  uuid: null,
  email: null,
  token: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState: accountInitialState,
  reducers: {
    updateData(state, action) {
      state.uuid = action.payload.uuid;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    removeData() {
      return accountInitialState;
    }, 
  }
});

const accountActions = accountSlice.actions;

export {
  accountSlice,
  accountActions
};
