import Canvas from './components/Canvas';
import Body from './components/Body';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="w-full h-full bg-oiroirbeebee-greyllow-1">
      <Navbar />
      <Body />
      <Canvas />
    </div>
  );
}

export default App;