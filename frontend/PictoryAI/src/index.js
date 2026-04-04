import React from 'react';
import  'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from "./components/Navbar/Navbar";
import Aboutpart from "./components/About/Aboutpart";
import PictorySimple from "./components/UnderNavbar/PictorySimple";
import Footerpart from "./components/footer/Footerpart";
import Pricingpart from "./components/PricingSection/Pricingpart";
import Featurepart from "./components/features/Featurepart";
import LoginPage from "./pages/login";
import SignupPage from './pages/signup';
import AiToolsPage from './pages/tools';
import CaptionGenerating from './pages/captionGenerating';
import './css/captionGenerator.css'
import'./css/footer.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import AnimatedBackground from './components/AnimatedBackground';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import InhanceImg from './pages/InhanceImgPage';
import './css/inhance_img/InhanceImgPage.css'


function App() {
    const navigate = useNavigate();
const handleLogout = () => {
    // Clear auth state, remove tokens, etc.
    setUser(null);
  };
  
  const [user, setUser] = React.useState({
    name: "John Doe",
    email: "john@example.com",
    plan: "Premium"
  });
    return (
        <>
            <Navbar user={user} onNavigate={(route) => navigate(route)} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={
                    <>
                        <AnimatedBackground />
                        <PictorySimple />
                        <Aboutpart />
                        <Pricingpart />
                        <Featurepart />
                    </>
                } />

                <Route path="/about" element={<Aboutpart />} />
                <Route path="/pricing" element={<Pricingpart />} />
                <Route path="/features" element={<Featurepart />} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignupPage/>} />
                <Route path="/tools" element={<AiToolsPage />} />
                <Route path="/tools/caption-generator" element={<CaptionGenerating />} />
                <Route path="/tools/enhance-image" element={<InhanceImg />}/>
            </Routes>
            
            <Footerpart />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>

    </React.StrictMode>
    
);


  
