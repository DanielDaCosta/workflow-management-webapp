import Navbar from './components/Navbar';
import Home from './components/Home';
import WorkflowDetails from './components/WorkflowDetails';
import Create from './components/Create';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from 'react';
import RunWorkflow from './components/RunWorkflow';


function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/blogs/:id" element={<WorkflowDetails />} />
            <Route path="/create" element={<Create />} />
            <Route path="/run" element={<RunWorkflow />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
