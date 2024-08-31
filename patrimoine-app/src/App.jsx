import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import PatrimoinePage from './components/PatrimoinePage';
import ListPossessionsPage from './components/ListPossessionsPage';
import CreatePossessionPage from './components/CreatePossessionPage';
import UpdatePossessionPage from './components/UpdatePossessionPage';
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
