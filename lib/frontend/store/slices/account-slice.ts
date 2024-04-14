import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uuid: null,
  email: null,
  token: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateAccountData(state, action) {
      state.uuid = action.payload.uuid;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    removeAccountData() {
      return initialState;
    }, 
  }
});

const { updateAccountData, removeAccountData } = accountSlice.actions;

export {
  accountSlice,
  updateAccountData,
  removeAccountData
};
