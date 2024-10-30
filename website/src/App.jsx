import logo from './logo.svg';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DraftPage from './components/DraftPage';
function App() {
  return ( // hi checkig dev
  <div>
      
       
      
      <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft_page" element={<DraftPage />} />
      </Routes>
    </BrowserRouter>
  </div>

);
}

export default App;
