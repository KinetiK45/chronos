import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from "./router/AppRoutes";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {
          ReactDOM.render(
              <Router>
                <AppRoutes />
              </Router>,
              document.getElementById('root')
          )
        }
      </header>
    </div>
  );
}

export default App;
