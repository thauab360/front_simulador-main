import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import SimulationScreen from './components/SimulationScreen';
import SummaryScreen from './components/SummaryScreen';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={LoginScreen} />
          <Route path="/simulation" component={SimulationScreen} />
          <Route path="/summary" component={SummaryScreen} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
