import {
  BrowserRouter, Routes, Route, Outlet, Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './components/LoginPage.jsx';
import Navbar from './components/Navbar';
import NotFoundPage from './components/NotFoundPage';
import ChatPage from './components/ChatPage';
import routes from './routes.js';

const PrivateOutlet = () => {
  const auth = useSelector((state) => state.auth);

  return auth.token ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Navbar />
      <Routes>
        <Route path={routes.chatPagePath()} element={<PrivateOutlet />}>
          <Route path="" element={<ChatPage />} />
        </Route>
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
