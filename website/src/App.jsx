import logo from './logo.svg';
import Navbar from './components/Homepage/HomePageFunctionality/Navbar';
import Home from './components/Homepage/HomePageFunctionality/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MockDraft from './components/Homepage/MockDraft';
import League from './components/Homepage/Leagues/LeaguePage';
import TeamPage from './components/Homepage/Leagues/Team';
import { Auth0Provider } from '@auth0/auth0-react';
import FreeAgencyPage from './components/Homepage/FreeAgencyPage';
import PlayerSummaryPage from './components/PlayerSummaryPage';
import LoginPage from './components/Homepage/HomePageFunctionality/LoginPage';
import Profile from './components/Homepage/HomePageFunctionality/Profile';
import LeagueDraft from './components/Homepage/Leagues/Draft/LeagueDraft';
import LeagueFreeAgency from './components/Homepage/Leagues/FreeAgency/LeagueFreeAgency';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
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
              <Route path="/mock_draft" element={<MockDraft />} />
              <Route path="/league_page" element={<League />} />
              <Route path="/team_page" element={<TeamPage />} />
              <Route path="/FreeAgency" element={<FreeAgencyPage />} />
              <Route path="/free_agency/player/:playerId" element={<PlayerSummaryPage />} />
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/draft_page/:leagueName" element={<LeagueDraft />} />
              <Route path="/free_agency/:name" element={<LeagueFreeAgency />} />
            </Routes>
          </BrowserRouter>
        </div>
      </Auth0Provider>
    </AuthProvider>
  );
}

export default App;
