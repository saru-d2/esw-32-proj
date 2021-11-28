import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainChartGrid from './components/MainChartGrid'
import TSChartGrid from './components/TSChartGrid'
import Navbar from './components/Navbar';
import Welcome from './components/Welcome'
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Welcome}></Route>
          <Route exact path='/oM2M' component={MainChartGrid}></Route>
          <Route exact path='/TS' component={TSChartGrid}></Route>
        </Switch>
      </div>
    </Router >
  );
}

export default App;
