import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import './styles/Game.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Globetrotter</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Game />} />
                        <Route path="/play" element={<Game />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
