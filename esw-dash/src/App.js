import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import './App.css';

import MainChartGrid from './components/MainChartGrid'
import TSChartGrid from './components/TSChartGrid'
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      {/* <h1>DashBoard</h1> */}
      <Navbar />
      <TSChartGrid />
    </div>
  );
}

export default App;
