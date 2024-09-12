import { createSlice } from "@reduxjs/toolkit";

type Reactions = {
    thumbsUp: number,
    rocket: number,
    [key: string]: number // Add index signature
}

interface ReactionsState {
    id: string,
    reactions: Reactions
}

const reactionsInitialState: ReactionsState[] = [];

const reactionsSlice = createSlice({
    name: "reactions",
    initialState: reactionsInitialState,
    reducers: {
        addReaction: (state, action) => {
            const { id, reactionType } = action.payload as {id: string, reactionType: string};
            const existingReaction = state.find(reaction => reaction.id === id);
            
            if (existingReaction) {
                existingReaction.reactions[reactionType] += 1;
            } else {
                let tmpReaction: Reactions = {
                    thumbsUp: 0,
                    rocket: 0
                };
                tmpReaction[reactionType] += 1;
                state.push({
                    id,
                    reactions: tmpReaction
            })}
        }
    }
});

export type ReactionsStateType = ReactionsState;
export const { addReaction } = reactionsSlice.actions;
export default reactionsSlice.reducer;