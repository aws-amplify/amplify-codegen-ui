import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ComponentTests from './ComponentTests';
import GenerateTests from './GenerateTests';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div>home</div>
        </Route>
        <Route path="/component-tests">
          <ComponentTests />
        </Route>
        <Route path="/generate-tests">
          <GenerateTests />
        </Route>
      </Switch>
    </Router>
  );
}
