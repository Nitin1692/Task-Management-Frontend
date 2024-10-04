import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';
import Signup from './components/Signup';

const App = () => {
    const [token, setToken] = useState(null);

    return (

            <Routes>
                <Route path="/" element={<Login setToken={setToken} />} />
                <Route path="/dashboard" element={<TaskDashboard token={token} />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>

    );
};

export default App;
