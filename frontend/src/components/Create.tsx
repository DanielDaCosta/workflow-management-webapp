import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { Workflow }  from '../types';

const Create = () => {
    const [title, setTitle] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [url, setURL] = useState<string>('');
    const [isPending, setIsPending] = useState<boolean>(false);
    const navigate = useNavigate();

    const sendLink = async (workflow: Omit<Workflow, 'id'>) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/workflows',
                workflow
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void=> {
        e.preventDefault();
        const workflow: Omit<Workflow, 'id'> = {title, body, url};

        setIsPending(true); 

        sendLink(workflow!)
        .then(() => {
            setIsPending(false);
            navigate('/')
        })
        .catch(err => {
            setIsPending(false);
        });
    }

    return (
        <div className="create">
            <h2>Add a New Workflow</h2>
            <form onSubmit={handleSubmit}>
                <label>Workflow title:</label>
                <input type="text" 
                 required
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                />
                <label>Workflow Description:</label>
                <textarea
                 required
                 value={body}
                 onChange={(e) => setBody(e.target.value)}
                ></textarea> 
                <label>URL:</label>
                <textarea
                 required
                 value={url}
                 onChange={(e) => setURL(e.target.value)}
                ></textarea> 
                {!isPending && <button>Add Workflow</button>}
                {isPending && <button disabled>Adding Workflow...</button>}
            </form>
        </div>
    );
}
 
export default Create;