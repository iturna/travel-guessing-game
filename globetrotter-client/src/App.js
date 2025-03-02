import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Game from './components/Game';
import UserProfile from './components/UserProfile';
import config from './config';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [invitedBy, setInvitedBy] = useState(null);

    useEffect(() => {
        // Clear localStorage for testing - REMOVE THIS IN PRODUCTION
        localStorage.removeItem('globetrotter_user');
        
        // Check for stored user
        const storedUser = localStorage.getItem('globetrotter_user');
        
        // Check for invite code in URL
        const params = new URLSearchParams(window.location.search);
        const inviteCode = params.get('inviteCode');
        
        if (inviteCode) {
            console.log("Found invite code:", inviteCode);
            fetchInvitingUser(inviteCode);
            // If there's an invite code, we want to show the register page
            // even if there's a stored user
            return;
        }
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Validate that the user object has the required fields
                if (parsedUser && parsedUser.username) {
                    setUser(parsedUser);
                } else {
                    // Invalid user data, clear it
                    localStorage.removeItem('globetrotter_user');
                }
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('globetrotter_user');
            }
        }
        
        setLoading(false);
    }, []);

    const fetchInvitingUser = async (inviteCode) => {
        try {
            const response = await axios.get(
                `${config.apiBaseUrl}${config.endpoints.getByInviteCode}/${inviteCode}`
            );
            setInvitedBy(response.data);
            // Force user to be null when using an invite code
            setUser(null);
        } catch (error) {
            console.error('Error fetching inviting user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        try {
            console.log("Registering user:", userData);
            const response = await axios.post(
                `${config.apiBaseUrl}${config.endpoints.register}`,
                userData
            );
            
            const newUser = response.data;
            console.log("Registration successful:", newUser);
            setUser(newUser);
            localStorage.setItem('globetrotter_user', JSON.stringify(newUser));
            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    console.log("Current user state:", user);

    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <h1>Globetrotter</h1>
                </header>
                
                <main>
                    {user ? (
                        <Game user={user} />
                    ) : (
                        <UserProfile 
                            onRegister={handleRegister} 
                            invitedBy={invitedBy} 
                        />
                    )}
                </main>
                
                <footer className="app-footer">
                    <p>© 2023 Globetrotter - Test your geography knowledge!</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
