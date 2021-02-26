import React from 'react';
import { BrowserRouter as Router,
  Switch,
  Route } from 'react-router-dom';
import Scoreticker from "./components/scoreticker";

function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Scoreticker />
          </Route>
        </Switch>
      </div>
    </Router>
);
}

export default App;
