import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './css/captionGenerator.css'
import'./css/footer.css'
import { Button, Container } from 'react-bootstrap';
import Hero from './components/Hero';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AiToolsPage from './pages/tools';
import GeneratorPage from './pages/captionGenerating';
import CaptionGenerating from './pages/captionGenerating';
function App() {
  return (
<Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<AiToolsPage />} />
        <Route path="/tools/caption-generator" element={<CaptionGenerating />} />
      </Routes>
    </Router>
  );

 
  
}

export default App;
