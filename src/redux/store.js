import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import chatReducer from "./features/useChatSlice";
import friendReducer from "./features/friendRequestSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    friend:friendReducer,
  },
});

export default store;
