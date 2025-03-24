import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const walletSlice = createSlice({
  name: "wallet",
  initialState: { balance: 0 },
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      AsyncStorage.setItem("walletBalance", JSON.stringify(action.payload));
    },
  },
});

export const { setBalance } = walletSlice.actions;
export default walletSlice.reducer;
