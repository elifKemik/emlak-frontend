import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const favorileriYukle = () => {
    if (userId && userId !== "undefined") {
      axios.get(`http://localhost:3000/kullanici/${userId}/favoriler`)
        .then(res => {
          setFavorites(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Favori çekme hatası:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    favorileriYukle();
  }, [userId]);

  const favoriCikar = async (ilanId: number) => {
    if (!window.confirm("Bu ilanı favorilerinizden çıkarmak istediğinize emin misiniz?")) return;

    try {
      await axios.post('http://localhost:3000/kullanici/favori-cikar', {
        userId: Number(userId),
        listingId: ilanId
      });
      setFavorites(favorites.filter(ilan => ilan.id !== ilanId));
    } catch (error) {
      console.error("Favori çıkarma hatası:", error);
      alert("İşlem gerçekleştirilemedi.");
    }
  };

  if (!userId || userId === "undefined") {
    return (
      <div className="container mt-5 py-5 text-center">
        <div className="card shadow-lg p-5 border-0 rounded-5 bg-light">
          <h2 className="display-4 mb-3">🔒</h2>
          <h3 className="fw-bold">Favorilerinize Erişemiyoruz</h3>
          <p className="text-muted mb-4">Favori listenizi yönetmek için önce giriş yapmalısınız.</p>
          <button className="btn btn-primary rounded-pill px-5 fw-bold" onClick={() => navigate('/login')}>Giriş Yap</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-5 text-center">
        <h2 className="fw-bold display-6">Favori İlanlarım ❤️</h2>
        <div className="mx-auto bg-primary mt-2" style={{ width: '60px', height: '4px', borderRadius: '2px' }}></div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Yükleniyor...</p>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.length > 0 ? (
            favorites.map(ilan => (
              <div className="col-lg-4 col-md-6 mb-4" key={ilan.id}>
                <div className="card h-100 border-0 shadow-sm transition-all hover-up" 
                     style={{ borderRadius: '24px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                  
                  <div className="position-relative overflow-hidden">
                    <img 
                      src={ilan.imageUrl ? (ilan.imageUrl.startsWith('http') ? ilan.imageUrl : `http://localhost:3000${ilan.imageUrl}`) : 'https://via.placeholder.com/400x250'} 
                      className="card-img-top img-zoom" 
                      alt={ilan.title}
                      style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    <div className="position-absolute bottom-0 start-0 m-3">
                       <span className="badge bg-primary rounded-pill px-3 py-2 shadow-lg fs-6">
                          {Number(ilan.price).toLocaleString()} TL
                       </span>
                    </div>
                    <button 
                      className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                      style={{ width: '35px', height: '35px', backgroundColor: 'rgba(255,255,255,0.8)' }}
                      onClick={() => favoriCikar(ilan.id)}
                    >
                      <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>✕</span>
                    </button>
                  </div>
                  
                  <div className="card-body p-4 text-center">
                    <h5 className="fw-bold text-dark mb-2">{ilan.title}</h5>
                    <p className="text-muted small mb-0 d-flex align-items-center justify-content-center">
                      <span className="me-1">📍</span> {ilan.location ? `${ilan.location.city} / ${ilan.location.district}` : 'Konum bilgisi yok'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 px-4 bg-white rounded-5 shadow-sm border">
              <div className="display-1 mb-3 opacity-25">🏘️</div>
              <h3 className="fw-bold text-secondary">Favori listeniz henüz boş</h3>
              <p className="text-muted fs-5 mb-4">Keşfedilmeyi bekleyen binlerce ilan seni bekliyor.</p>
              <button 
                className="btn btn-primary btn-lg px-5 fw-bold rounded-pill shadow-sm"
                onClick={() => navigate('/')}
              >
                Hemen Keşfetmeye Başla
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;