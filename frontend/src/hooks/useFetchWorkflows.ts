import { useState, useEffect } from 'react'
import axios from 'axios'
import { Workflow }  from '../types';

const useFetchWorkflows = (): { data: Workflow[] | null, isPending: boolean, error: any } => {

  const [data, setData] = useState<Workflow[] | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const sendLink = async (): Promise<Workflow[]> => {
    try {
      const response = await axios.get(
        'http://localhost:8000/workflows');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
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
  }, []);

  return { data, isPending, error }
}
 
export default useFetchWorkflows;
