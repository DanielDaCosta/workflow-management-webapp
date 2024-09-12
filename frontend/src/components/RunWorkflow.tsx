import React, { useEffect, useState } from 'react';
import useFetchWorkflows from '../hooks/useFetchWorkflows';
import axios from 'axios';

const RunWorkflow = () => {

    const {data:workflows} = useFetchWorkflows()
    const [id, setId] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [isPending, setIsPending] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>('');
    const [displayedText, setDisplayedText] = useState<string>('');

    useEffect(() => {
        if (workflows && workflows.length > 0) {
            setId(workflows[0].id); // Set the first workflow's id as default
        }
    }, [workflows]);

    // Effect to display the response text character by character
    useEffect(() => {
        if (response !== null) {
            setDisplayedText(''); // Reset the displayed text
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText((prev) => prev + response[index]);
                index++;
                if (index >= response.length) {
                    clearInterval(interval);
                    setDisplayedText(response); 
                }
            }, 2);
            return () => clearInterval(interval); // Cleanup on unmount
        } else {
            setDisplayedText('');
        }

    }, [response]);

    const sendLink = async (id: string, prompt: string) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/workflow/${id}/execute`,
                { id, prompt }
            );
            setResponse(response.data.message);
        } catch (error) {
            console.error(error);
            setResponse('An error occurred while executing the workflow.');
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void=> {
        e.preventDefault();
        setIsPending(true);
        if (!id) {
            console.error('Document ID is undefined');
            return;
        }
        sendLink(id!, prompt)
        .then(() => {
            console.log('Workflow executed successfully');
            setIsPending(false);
        })
        .catch(err => {
            console.error(err);
            setIsPending(false);
        });
    }


    return (
        <div className="create">
            <h2>Run Workflow</h2>
            <form onSubmit={handleSubmit}>

                <label>Workflow:</label>
                <select
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                >

                    {workflows?.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                            {workflow.title} (ID: {workflow.id})
                        </option>
                    ))}
                </select>
                <label>Prompt:</label>
                <textarea
                 required
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                ></textarea> 
                {!isPending && <button>Run Workflow</button>}
                {isPending && <button disabled>Running Workflow...</button>}

                            {/* Textbox to display the response */}
                {response && (
                    <div>
                        <label>Workflow Output:</label>
                        <textarea
                            value={displayedText}
                            readOnly
                            style={{ width: '100%', height: '300px' }}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default RunWorkflow;