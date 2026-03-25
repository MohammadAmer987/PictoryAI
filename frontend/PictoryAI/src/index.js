import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from "./components/Navbar/Navbar";
import Aboutpart  from "./components/About/Aboutpart";
import PictorySimple from "./components/UnderNavbar/PictorySimple";
import Footerpart from "./components/footer/Footerpart";
import Pricingpart from "./components/PricingSection/Pricingpart";
import Featurepart from "./components/features/Featurepart";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar  />
            <PictorySimple />
            <Aboutpart />
            <Pricingpart />
            <br/><br/><br/>
            <Featurepart />
            <Footerpart />
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();