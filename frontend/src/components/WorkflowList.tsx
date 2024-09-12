import {Link} from 'react-router-dom'
import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { addReaction, ReactionsStateType } from '../state/reactions/reactionsSlice';
import { Workflow }  from '../types';

type Props = {
    workflows: Workflow[],
    title: string
}

const reactionEmoji = {
    thumbsUp: '👍',
    rocket: '🚀',
}

const WorkflowList = ({workflows, title}: Props) => {

    const reactionsState = useSelector((state: { reactions:  ReactionsStateType[] }) => state.reactions);
    const dispatch = useDispatch();

    return (  
        <div className="blog-list">
            <h2>{title}</h2>
            {workflows.map((workflow) => (
            <div className="blog-preview" key={workflow.id}>
                <Link to={`/blogs/${workflow.id}`}>
                    <div className="blog-header">
                        <h2>{workflow.title}</h2>
                        <p> URL: {workflow.url}</p>
                    </div>
                </Link>
                    <button className="right-button" onClick={() => dispatch(addReaction({id: workflow.id, reactionType: "thumbsUp"}))}>
                        {reactionEmoji.thumbsUp}
                        {reactionsState !== undefined ? reactionsState.find(reaction => reaction.id === workflow.id)?.reactions.thumbsUp || 0 : 0}
                    </button>
            </div>
          ))}
        </div>
    );
}
 
export default WorkflowList;