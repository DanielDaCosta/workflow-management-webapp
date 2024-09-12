import WorkflowList from './WorkflowList';
import React from 'react';
import useFetchWorkflows from '../hooks/useFetchWorkflows';


const Home = () => {

    const {data:workflows, isPending, error} = useFetchWorkflows()

    return (
        <div className="home">
            {error && <div>{ error }</div>}
            {isPending && <div>Loading</div>}
            {workflows && <WorkflowList workflows={workflows} title="All Workflows"/>}
        </div>
    );
}
 
export default Home;