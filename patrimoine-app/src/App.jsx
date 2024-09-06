import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/dumb/Header';
import HomePage from './components/dumb/HomePage';
import PatrimoinePage from './components/smart/PatrimoinePage';
import ListPossessionsPage from './components/smart/ListPossessionsPage';
import CreatePossessionPage from './components/smart/CreatePossessionPage';
import UpdatePossessionPage from './components/smart/UpdatePossessionPage';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Header />
      <div className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patrimoine" element={<PatrimoinePage />} />
          <Route path="/possessions" element={<ListPossessionsPage />} />
          <Route path="/possessions/create" element={<CreatePossessionPage />} />
          <Route path="/possessions/:libelle/update" element={<UpdatePossessionPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
