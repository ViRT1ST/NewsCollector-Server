import { create } from 'zustand';

import { GlobalState, GlobalStateUserData } from '@/types';

const userDataInitialState = {
  uuid: null,
  email: null,
  token: null,
};

export const useGlobalStore = create<GlobalState>((set) => ({
  userData: {
    uuid: userDataInitialState.email,
    email: userDataInitialState.email,
    token: userDataInitialState.token,
  },

  updateUserData: (userData: GlobalStateUserData) => {
    return set(() => ({ userData: userData }));
  },

  removeUserData: () => { 
    return set(() => ({ userData: userDataInitialState }));
  },
}));