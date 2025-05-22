import './App.css';
import duckImage from './assets/duck.jpg';

function App() {
  return (
    <div className="app-container">
      <img 
        src={duckImage}
        alt="A duck"
        className="main-image"
      />
    </div>
  );
}

export default App;
