import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'; 
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import Favorites from './pages/Favorites'; 
import IlanEkle from './pages/AddListing';

function App() {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role'); // Kullanıcı rolünü alıyoruz

  const handleLogout = () => {
    localStorage.clear();
    alert("Başarıyla çıkış yapıldı! 👋");
    window.location.href = "/"; 
  };

  return (
    <Router>
      <div className="app-wrapper min-vh-100">
        <nav className="navbar navbar-expand-lg sticky-top custom-nav mb-4 shadow-sm">
          <div className="container p-2">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <span className="fs-3 me-2">🏠</span>
              <span className="fw-bold logo-text">Emlak Projesi</span>
            </Link>
            
            <div className="d-flex align-items-center gap-2">
              <Link className="nav-link fw-semibold px-3 d-none d-md-block" to="/">Anasayfa</Link>
              
              {!userId ? (
                <div className="d-flex gap-2">
                  <Link className="btn btn-link text-dark text-decoration-none fw-semibold px-3" to="/login">Giriş Yap</Link>
                  <Link className="btn btn-primary rounded-pill px-4 shadow fw-bold" to="/register">Kayıt Ol</Link>
                </div>
              ) : (
                <>
                  {/* Sadece Emlakçı ise İlan Ekle görünsün */}
                  {userRole === 'agent' && (
                    <Link className="nav-link text-primary fw-bold px-3" to="/ilan-ekle">İlan Ekle ➕</Link>
                  )}

                  {/* SADECE Müşteri (User) ise Favorilerim görünsün */}
                  {userRole === 'user' && (
                    <Link className="nav-link fw-semibold px-3" to="/favoriler">Favorilerim ❤️</Link>
                  )}
                  
                  <button className="btn btn-danger rounded-pill px-4 ms-2 fw-bold shadow-sm" onClick={handleLogout}>
                    Çıkış Yap 🚪
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="container main-content pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favoriler" element={<Favorites />} />
            <Route path="/ilan-ekle" element={<IlanEkle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;