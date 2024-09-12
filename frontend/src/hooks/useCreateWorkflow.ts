import { useState, useEffect } from 'react';
import axios from 'axios';
import { Workflow }  from '../types';

const useCreateWorkflow = (workflowData: Omit<Workflow, 'id'>) => {
    const [response, setResponse] = useState<string | null>('Error');
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const sendLink = async (workflow: Omit<Workflow, 'id'>) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/workflows',
                workflow
            );
            setResponse('Success');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    useEffect(() => {
        if (workflowData) {
            sendLink(workflowData!)
                .then(() => {
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    setIsPending(false);
                    setError(err.message);
                });
        }
    }, [workflowData]); // Run the effect whenever `workflowData` changes

    return { response, isPending, error };
};

export default useCreateWorkflow;
