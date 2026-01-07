import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        role
      });

      if (response.status === 201) {
        alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz. ✅");
        navigate('/login');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("Bu e-posta adresi zaten kullanımda! ❌");
      } else {
        setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '5%' }}>
      <div className="row justify-content-center shadow-lg rounded-5 overflow-hidden bg-white mx-auto" style={{ maxWidth: '900px' }}>
        
        {/* Sol Taraf: Form */}
        <div className="col-md-6 p-5 order-2 order-md-1">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Kayıt Ol 📝</h2>
            <p className="text-muted">Emlak dünyasına ilk adımınızı atın.</p>
          </div>

          {error && <div className="alert alert-danger rounded-4 p-2 small text-center mb-4">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="small fw-bold mb-1 ms-2">E-posta</label>
              <input 
                type="email" 
                placeholder="mail@example.com" 
                className="form-control rounded-pill py-2 px-3 border-2" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold mb-1 ms-2">Şifre</label>
              <input 
                type="password" 
                placeholder="Şifrenizi belirleyin" 
                className="form-control rounded-pill py-2 px-3 border-2" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="small fw-bold mb-1 ms-2">Hesap Türü</label>
              <select className="form-select rounded-pill py-2 px-3 border-2" onChange={(e) => setRole(e.target.value)}>
                <option value="user">Müşteri (İlan Bakmak İstiyorum)</option>
                <option value="agent">Emlakçı (İlan Vermek İstiyorum)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow btn-glow">
              Hesabı Oluştur
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Zaten bir hesabınız var mı? <span className="text-primary fw-bold" style={{cursor:'pointer'}} onClick={() => navigate('/login')}>Giriş Yap</span>
            </p>
          </div>
        </div>
{/* Sağ Taraf: Görsel Kısmını Bu Kodla Güncelle */}
<div className="col-md-6 d-none d-md-block p-0 order-1 order-md-2 position-relative">
  <img 
    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
    alt="register" 
    style={{ 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover',
      minHeight: '500px' // Görselin görünmesini garantiler
    }}
  />
  <div className="position-absolute top-0 start-0 p-4 text-white w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center" 
       style={{ background: 'rgba(0,0,0,0.4)' }}> {/* Glass-effect yerine daha garanti bir karartma */}
    <h3 className="fw-bold">Yeni Bir Başlangıç</h3>
    <p className="px-3">Hemen kayıt olun ve yüzlerce emlak fırsatını yakalayın.</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default Register;