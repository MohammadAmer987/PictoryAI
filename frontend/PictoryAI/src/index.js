import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Navbar from "./components/Navbar/Navbar";
import Aboutpart from "./components/About/Aboutpart";
import PictorySimple from "./components/UnderNavbar/PictorySimple";
import Footerpart from "./components/footer/Footerpart";
import Pricingpart from "./components/PricingSection/Pricingpart";
import Featurepart from "./components/features/Featurepart";
import LoginPage from "./login";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar onNavigate={(route) => navigate(route)} />

            <Routes>
                <Route path="/" element={
                    <>
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

