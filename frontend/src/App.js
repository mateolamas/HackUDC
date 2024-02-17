import logo from './logo.svg';
import './App.css';
import HouseInfoForm from './components/HouseInfoForm.js';
import Banner from './components/Banner.js'
import  Footer from './components/Footer.js'

function App() {
  return (
    <div className="App">
      <Banner/>
      <HouseInfoForm/>
      <Footer/>
    </div>
  );
}

export default App;


/*
<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/