import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('role', response.data.role); 
      localStorage.setItem('userId', response.data.id); 

      alert("Giriş başarılı! Hoş geldiniz. ✅");
      navigate('/'); 
      window.location.reload(); 
    } catch (error) {
      console.error("Giriş Hatası:", error);
      alert("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="container" style={{ marginTop: '5%' }}>
      <div className="row justify-content-center shadow-lg rounded-5 overflow-hidden bg-white mx-auto" style={{ maxWidth: '900px' }}>
        {/* Sol Taraf: Görsel */}
        <div className="col-md-6 d-none d-md-block p-0 position-relative">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="login" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="position-absolute bottom-0 start-0 p-4 text-white glass-effect w-100">
            <h4 className="fw-bold">Yeniden Hoş Geldiniz!</h4>
            <p className="small mb-0">Hayalinizdeki eve bir adım daha yakınsınız.</p>
          </div>
        </div>

        {/* Sağ Taraf: Form */}
        <div className="col-md-6 p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Giriş Yap 👋</h2>
            <p className="text-muted">Lütfen hesabınıza erişmek için bilgilerinizi girin.</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="small fw-bold mb-1 ms-2">E-posta Adresi</label>
              <input 
                type="email" 
                className="form-control rounded-pill py-2 px-3 border-2" 
                placeholder="ornek@mail.com"
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="small fw-bold mb-1 ms-2">Şifre</label>
              <input 
                type="password" 
                className="form-control rounded-pill py-2 px-3 border-2" 
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow btn-glow">
              Giriş Yap
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Henüz bir hesabınız yok mu? <span className="text-primary fw-bold" style={{cursor:'pointer'}} onClick={() => navigate('/register')}>Kayıt Ol</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;