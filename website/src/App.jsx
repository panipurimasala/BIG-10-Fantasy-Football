import logo from './logo.svg';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DraftPage from './components/DraftPage';
import League from './components/LeaguePage';
import TeamPage from './components/Team'
import { Auth0Provider } from '@auth0/auth0-react';
import FreeAgencyPage from './components/FreeAgencyPage';
import PlayerSummaryPage from './components/PlayerSummaryPage';
import LoginPage from './components/LoginPage';
import Profile from "./components/Profile"
function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENTID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <div>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/draft_page" element={<DraftPage />} />
            <Route path="/league_page" element={<League />} />
            <Route path="/team_page" element={<TeamPage />} />
            <Route path="/FreeAgency" element={<FreeAgencyPage />} />
            <Route path="/free_agency/player/:playerId" element={<PlayerSummaryPage />} />
            <Route path="/LoginPage" element={<LoginPage />}></Route>
            <Route path="/Profile" element={<Profile />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Auth0Provider>

  );
}

export default App;
