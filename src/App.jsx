import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import useAuthStore from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import ReturnToTopButton from './components/ReturnToTopButton';
import './index.css';

// Lazy load pages for performance
const Home          = lazy(() => import('./pages/Home'));
const Shop          = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
import VerifyOTP from './pages/VerifyOTP';
const ForgotPassword= lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile       = lazy(() => import('./pages/Profile'));
const Cart          = lazy(() => import('./pages/Cart'));
const Notifications = lazy(() => import('./pages/Notifications'));
const DeliveryPortal= lazy(() => import('./pages/DeliveryPortal'));
const Terms          = lazy(() => import('./pages/Terms'));
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'));
const GoodMoodDeals  = lazy(() => import('./pages/GoodMoodDeals'));

const AdminLayout      = lazy(() => import('./pages/Admin/AdminLayout'));
const ProductManager   = lazy(() => import('./pages/Admin/ProductManager'));
const CategoryManager  = lazy(() => import('./pages/Admin/CategoryManager'));
const BrandManager     = lazy(() => import('./pages/Admin/BrandManager'));
const SubcategoryManager = lazy(() => import('./pages/Admin/SubcategoryManager'));
const SpecificationManager = lazy(() => import('./pages/Admin/SpecificationManager'));
const ProductForm      = lazy(() => import('./pages/Admin/ProductForm'));
const AdminOrders      = lazy(() => import('./pages/Admin/AdminOrders'));
const AdminUsers       = lazy(() => import('./pages/Admin/AdminUsers'));

const TradeInManager   = lazy(() => import('./pages/Admin/TradeInManager'));
const SiteSettings     = lazy(() => import('./pages/Admin/SiteSettings'));
const AdminGoodMood    = lazy(() => import('./pages/Admin/AdminGoodMood'));

/* ─── Page-level Suspense mini-loader ─── */
const Loader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
    background: '#F5F7FF',
  }}>
    <style>{`
      @keyframes igSpin { to { transform: rotate(360deg); } }
      @keyframes igFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      .ig-ring {
        width: 44px; height: 44px;
        border: 3px solid rgba(27,43,107,0.12);
        border-top-color: #1B2B6B;
        border-radius: 50%;
        animation: igSpin 0.8s cubic-bezier(0.4,0,0.6,1) infinite;
      }
      .ig-loader-text { animation: igFadeUp 0.5s ease forwards; }
    `}</style>
    <div className="ig-ring"></div>
    <div className="ig-loader-text" style={{ textAlign: 'center', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1rem',
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: '#1B2B6B',
      }}>ICELL <span style={{ color: '#CC1B1B' }}>GADGETS</span></span>
    </div>
  </div>
);

/* ─── Full-page splash screen (auth init) ─── */
const SplashScreen = () => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#F5F7FF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    <style>{`
      @keyframes igSplashSpin   { to { transform: rotate(360deg); } }
      @keyframes igSplashPulse  { 0%,100% { transform:scale(1); opacity:0.1; } 50% { transform:scale(1.25); opacity:0.05; } }
      @keyframes igSplashBar    { from { width:0; } to { width:100%; } }
      @keyframes igSplashFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

      .ig-splash-ring-outer {
        position:absolute; width:260px; height:260px;
        border-radius:50%; border:1px solid rgba(27,43,107,0.12);
        animation: igSplashPulse 3s ease-in-out infinite;
      }
      .ig-splash-ring-mid {
        position:absolute; width:180px; height:180px;
        border-radius:50%; border:1.5px solid rgba(27,43,107,0.15);
        animation: igSplashPulse 3s ease-in-out infinite 0.5s;
      }
      .ig-splash-ring-inner {
        position:absolute; width:110px; height:110px;
        border-radius:50%; border:2px solid rgba(27,43,107,0.2);
        animation: igSplashPulse 3s ease-in-out infinite 1s;
      }
      .ig-splash-spinner {
        width:60px; height:60px;
        border-radius:50%;
        border:3px solid rgba(27,43,107,0.1);
        border-top-color:#1B2B6B;
        animation: igSplashSpin 0.9s cubic-bezier(0.4,0,0.6,1) infinite;
      }
      .ig-splash-wordmark { animation: igSplashFadeUp 0.7s 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both; }
      .ig-splash-tagline  { animation: igSplashFadeUp 0.7s 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both; }
      .ig-splash-bar-track {
        width:180px; height:3px;
        background:#E0E4F5; border-radius:99px; overflow:hidden;
        animation: igSplashFadeUp 0.7s 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both;
      }
      .ig-splash-bar-fill {
        height:100%;
        background:linear-gradient(90deg, #1B2B6B, #CC1B1B);
        border-radius:99px;
        animation: igSplashBar 2.2s 1s cubic-bezier(0.4,0,0.2,1) forwards;
        width:0;
      }
    `}</style>

    {/* Ambient soft blobs */}
    <div style={{ position:'absolute', top:'-15%', right:'-10%', width:380, height:380, borderRadius:'50%', background:'rgba(27,43,107,0.04)', filter:'blur(70px)', pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-15%', left:'-10%', width:320, height:320, borderRadius:'50%', background:'rgba(204,27,27,0.03)', filter:'blur(70px)', pointerEvents:'none' }} />

    {/* Pulse rings */}
    <div className="ig-splash-ring-outer" />
    <div className="ig-splash-ring-mid" />
    <div className="ig-splash-ring-inner" />

    {/* Center content */}
    <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
      <div className="ig-splash-spinner" />

      <div className="ig-splash-wordmark" style={{ textAlign:'center', lineHeight:1 }}>
        {/* Logo icon */}
        <div style={{
          width:52, height:52,
          borderRadius:14,
          background:'linear-gradient(135deg, #1B2B6B 0%, #2A3F8F 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 12px',
          boxShadow:'0 8px 24px rgba(27,43,107,0.3)',
        }}>
          <i className="fa-solid fa-mobile-screen" style={{ color:'#fff', fontSize:'1.4rem' }}></i>
        </div>

        <div style={{ fontSize:'1.7rem', fontWeight:900, lineHeight:1, fontFamily:'Outfit,sans-serif', letterSpacing:'-0.02em' }}>
          <span style={{ color:'#1B2B6B' }}>ICELL</span>{' '}
          <span style={{ color:'#CC1B1B' }}>GADGETS</span>
        </div>
        <div style={{ width:50, height:2.5, background:'linear-gradient(90deg,#1B2B6B,#CC1B1B)', margin:'10px auto 0', borderRadius:99 }} />
      </div>

      <div className="ig-splash-tagline" style={{ fontSize:'0.62rem', color:'#9CA3AF', letterSpacing:'0.22em', textTransform:'uppercase', textAlign:'center' }}>
        Nigeria's Trusted Phone Store
      </div>

      <div className="ig-splash-bar-track">
        <div className="ig-splash-bar-fill" />
      </div>
    </div>
  </div>
);

function AppContent() {
  const { user, isAdmin, loading } = useAuthStore();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <ReturnToTopButton />
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1A1A2E',
            border: '1.5px solid #E0E4F5',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 8px 32px rgba(27,43,107,0.12)',
          },
          success: { iconTheme: { primary: '#1B2B6B', secondary: '#FFFFFF' } },
          error:   { iconTheme: { primary: '#CC1B1B', secondary: '#FFFFFF' } },
        }}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/products"       element={<Shop />} />
          <Route path="/products/:id"   element={<ProductDetail />} />
          <Route path="/shop"           element={<Shop />} />
          <Route path="/good-mood-deals" element={<GoodMoodDeals />} />

          {/* Electronics category routes */}
          <Route path="/phones"         element={<Shop />} />
          <Route path="/laptops"        element={<Shop />} />
          <Route path="/gaming"         element={<Shop />} />
          <Route path="/audio"          element={<Shop />} />
          <Route path="/tvs"            element={<Shop />} />
          <Route path="/accessories"    element={<Shop />} />

          <Route path="/login"          element={user ? <Navigate to="/profile" replace /> : <Login />} />
          <Route path="/register"       element={user ? <Navigate to="/profile" replace /> : <Register />} />
          <Route path="/verify-otp"     element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/profile"        element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/cart"           element={<Cart />} />
          <Route path="/notifications"  element={user ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/delivery"       element={<DeliveryPortal />} />
          <Route path="/terms"          element={<Terms />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />

          <Route path="/admin" element={user && isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
            <Route index              element={<ProductManager />} />
            <Route path="categories"  element={<CategoryManager />} />
            <Route path="subcategories" element={<SubcategoryManager />} />
            <Route path="brands"      element={<BrandManager />} />
            <Route path="specifications" element={<SpecificationManager />} />
            <Route path="new"         element={<ProductForm />} />
            <Route path="edit/:id"    element={<ProductForm />} />
            <Route path="orders"      element={<AdminOrders />} />

            <Route path="trade-ins"   element={<TradeInManager />} />
            <Route path="users"       element={<AdminUsers />} />
            <Route path="settings"    element={<SiteSettings />} />
            <Route path="good-mood"   element={<AdminGoodMood />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
