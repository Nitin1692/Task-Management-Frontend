import React, { useState } from 'react';
import { login } from '../authService';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            const { accessToken } = response.result; // Extract accessToken from response
            setToken(accessToken); // Pass the access token up to the parent
            navigate('/dashboard');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Login failed');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                {`Don't have an account? `}
                <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;
