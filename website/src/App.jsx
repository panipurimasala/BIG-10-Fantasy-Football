import logo from './logo.svg';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DraftPage from './components/DraftPage';
import League from './components/LeaguePage';
function App() {
  return (
  <div>
      
       
      
      <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft_page" element={<DraftPage />} />
        <Route path = "/league_page" element = {<League />} />
      </Routes>
    </BrowserRouter>
  </div>

);
}

export default App;
