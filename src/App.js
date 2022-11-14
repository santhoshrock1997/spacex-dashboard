import { Routes, Route } from 'react-router-dom';
import { Home } from './routes/home/home.component';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="/:id" element={<Home />} /> */}
      </Routes>
    </div>
  );
}

export default App;
