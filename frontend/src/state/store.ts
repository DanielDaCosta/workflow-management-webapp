import {configureStore} from '@reduxjs/toolkit';
import reactionReducer from './reactions/reactionsSlice';

export const store = configureStore({
    reducer: {
        reactions: reactionReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;