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
import'./css/footer.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/captionGenerator.css'
import './css/content-studio.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {getMe,logout} from "./Services/authService";
import ContentStudioPage from "./pages/User/ContentStudioPage";
import Text from "./components/module_3/Text";
import InhanceImg from './pages/InhanceImgPage';
import './css/inhance_img/InhanceImgPage.css'
import ThemeImgPage from "./pages/ThemeImgPage";
import './css/theme_img/ThemeImgPage.css'
import SubscriptionPage from "./components/SubscriptionPage";
import ChatBotWidget from "./components/ChatBotWidget";
import { useNotifications } from './pages/useNotifications';
import PaymentPage from "./pages/paymentPage"

function App() {
    const navigate = useNavigate();


async function handleLogout() {
  await logout();
  setUser(null);
  navigate("/login");
}
React.useEffect(() => {
  async function loadCurrentUser() {
    try {
      const data = await getMe();

      if (data?.data?.user) {
        setUser(normalizeUser(data.data.user));
      }
    } catch {
      setUser(null);
    }
  }

  loadCurrentUser();
}, []);

  const [user, setUser] = React.useState(null);
    const { notifications, unreadCount, addNotification, clearNotifications } =
        useNotifications(user?.plan || "free");
    return (
        <>
            <Navbar user={user} onNavigate={(route) => navigate(route)}   onLogout={handleLogout} onUserUpdated={(apiUser) => setUser(normalizeUser(apiUser))}  notifications={notifications}
                    unreadCount={unreadCount}
                    onClearNotifications={clearNotifications}
 />

            <Routes>
                <Route path="/" element={
                    <>
                        <PictorySimple />
                        <Aboutpart />
                        <Pricingpart />
                        <Featurepart />

                    </>
                } />
                <Route path="/tools/image-generator" element={<Text onSubmit={(data) => console.log(data)} />}  addNotification={addNotification}/>

                <Route path="/about" element={<Aboutpart />} />
                <Route path="/pricing" element={<Pricingpart />} />
                <Route path="/features" element={<Featurepart />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={(apiUser) => {
        setUser(normalizeUser(apiUser));
      }}/>} />
                <Route path="/signup" element={<SignupPage/>} />
                <Route path="/tools" element={<AiToolsPage />} />  
                <Route path="/history" element={<ContentStudioPage />} />
                <Route path="/tools/caption-generator" element={<CaptionGenerating addNotification={addNotification}/>} />
                <Route path="/tools/enhance-image" element={<InhanceImg addNotification={addNotification}/>}/>

                <Route path ="/tools/generate-image" element={<Text onSubmit={(data) => console.log(data)} />}></Route>

                <Route path="/tools/theme-image-generation" element={<ThemeImgPage addNotification={addNotification} />}/>
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/payment" element={<PaymentPage  />} />

            </Routes>

            <ChatBotWidget />
            <Footerpart />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
function normalizeUser(apiUser) {
  if (!apiUser) return null;

  return {
    id: apiUser.id,
    name:
      apiUser.profile?.owner_name ||"User",    
    store_name: apiUser.profile?.store_name || null,  
    email: apiUser.email,
    plan: apiUser.active_subscription?.plan?.name || "free",
    role: apiUser.role?.name || "user",
    raw: apiUser,
  };
}
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />

        </BrowserRouter>

    </React.StrictMode>

);







