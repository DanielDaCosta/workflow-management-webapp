import { useState, useEffect } from 'react'
import axios from 'axios'

import { Workflow }  from '../types';

const useFetchWorkflow = (id: string): { data: Workflow | null, isPending: boolean, error: any } => {

    const [data, setData] = useState<Workflow | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    
    const sendLink = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/workflows/' + id);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        sendLink()
            .then((data) => {
                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch(err => {
                setIsPending(false);
                setError(err.message);
            })
    }, [id]);

    return { data, isPending, error }
}
 
export default useFetchWorkflow;
