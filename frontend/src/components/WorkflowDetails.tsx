import { useNavigate, useParams } from 'react-router-dom';
import useFetchWorkflow from '../hooks/useFetchWorkflow';
import React from 'react';
import axios from 'axios';

const WorkflowDetails = () => {

    const { id } = useParams<{id: string}>()

    const {data: workflow, error, isPending} = useFetchWorkflow(id!)
    const navigate = useNavigate();

    const sendLink = async (id: string) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/workflow/${id}`
            );
            console.log(response.data.message); // Handle success message
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleClick = () => {
        if (!id) {
            console.error('Document ID is undefined');
            return;
        }
        sendLink(id!)
        .then(() => {
            navigate('/')
        })
        .catch(err => {
            console.error(err.message);
        });
    }

    return (
        <div className="blog-details">
            { isPending && <div>Loading</div>}
            { error && <div> {error} </div>}
            { workflow && (
                <article>
                    <h2> {workflow.title}</h2>
                    <p> URL: {workflow.url}</p>
                    <div>{workflow.body}</div>
                    <button onClick={handleClick}>Delete</button>
                </article>
            )
            }
        </div>
    );
}
 
export default WorkflowDetails;