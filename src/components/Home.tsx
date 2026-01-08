import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ListingCard from './ListingCard'; 

const cardStyle = `
  .hero-gradient {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: none !important;
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 25px;
  }
  .card-hover {
    transition: all 0.3s ease-in-out;
    border: none !important;
  }
  .card-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
  }
  .listing-image-container {
    overflow: hidden;
    position: relative;
    border-radius: 20px 20px 0 0;
  }
  .listing-image-container img {
    transition: transform 0.5s ease;
  }
  .card-hover:hover .listing-image-container img {
    transform: scale(1.1);
  }
  .price-text {
    color: #2563eb;
    font-weight: 800;
  }
  .btn-glow:hover {
    box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
  }
`;

const Home = () => {
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();
  
  // --- YENİ EKLENEN STATE ---
  const [categories, setCategories] = useState<any[]>([]); 
  // --------------------------

  const [editForm, setEditForm] = useState({
    title: '',
    price: 0,
    locationId: '',
    imageUrl: '',
    categoryId: '' // --- DÜZENLEME FORMU İÇİN EKLENDİ ---
  });

  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId'); 

  const ilanlariGetir = () => {
    axios.get('http://localhost:3000/ilan/liste', {
      headers: { 'user-id': userId || 'guest' } 
    })
      .then(res => {
        setIlanlar(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Veri çekme hatası:", err);
        setIlanlar([]);
      });
  };

  // --- KATEGORİLERİ GETİREN FONKSİYON ---
  const kategorileriGetir = () => {
    axios.get('http://localhost:3000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Kategori çekme hatası:", err));
  };
  // --------------------------------------

  const favorileriGetir = () => {
    if (userId && userId !== "undefined") {
      axios.get(`http://localhost:3000/kullanici/${userId}/favoriler`, {
        headers: { 'user-id': userId } 
      })
        .then(res => {
          const favIds = res.data.map((f: any) => f.id);
          setUserFavorites(favIds);
        })
        .catch(err => console.log("Favori çekme hatası:", err));
    }
  };

  useEffect(() => {
    ilanlariGetir();
    favorileriGetir();
    kategorileriGetir(); // --- SAYFA AÇILDIĞINDA ÇALIŞTIR ---
  }, [userId]);

  const filtrelenmisIlanlar = ilanlar.filter(ilan => 
    ilan.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFavoriteToggle = async (ilanId: number) => {
    if (!userId) {
      alert("Bu işlem için önce giriş yapmalısınız! 🔑");
      navigate('/login');
      return;
    }
    const isFavorite = userFavorites.includes(ilanId);
    const endpoint = isFavorite ? 'favori-cikar' : 'favori-ekle';
    try {
      await axios.post(`http://localhost:3000/kullanici/${endpoint}`, {
        userId: Number(userId),
        listingId: ilanId
      });
      if (isFavorite) {
        setUserFavorites(userFavorites.filter(id => id !== ilanId));
      } else {
        setUserFavorites([...userFavorites, ilanId]);
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
    }
  };

  const guncelle = async (id: number) => {
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('price', String(editForm.price));
    formData.append('locationId', editForm.locationId);
    formData.append('categoryId', editForm.categoryId); // --- KATEGORİ GÜNCELLEME EKLENDİ ---
    
    if (editForm.imageUrl) {
      formData.append('imageUrl', editForm.imageUrl);
    }

    if (selectedFile) formData.append('file', selectedFile);
    
    try {
      const response = await axios.patch(`http://localhost:3000/ilan/guncelle/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'user-id': userId 
        }
      });

      if (response.status === 200) {
        alert("İlan başarıyla güncellendi! ✅");
        setEditingId(null);
        setSelectedFile(null);
        ilanlariGetir(); 
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Güncelleme başarısız!");
    }
  };

  const ilanSil = async (id: number) => {
    if (window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:3000/ilan/sil/${id}`, {
          headers: { 'user-id': userId }
        });
        alert("İlan silindi! 🗑️");
        ilanlariGetir();
      } catch (err: any) {
        alert(err.response?.data?.message || "Silme hatası!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <style>{cardStyle}</style>
      
      {!userId && (
        <div className="hero-gradient p-5 mb-5 rounded-5 shadow-lg text-center position-relative overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="position-absolute bg-primary opacity-10 rounded-circle" style={{ width: '300px', height: '300px', top: '-100px', right: '-100px' }}></div>
          <div className="position-relative glass-effect p-5" style={{ zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-3 text-white">Hayalindeki Evi <span className="text-primary">Keşfet</span> 🏠</h1>
            <p className="lead mb-4 text-light opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
              Binlerce güncel ilan arasından sana en uygun olanı bulmak için hemen aramıza katıl.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <button className="btn btn-primary btn-lg px-5 fw-bold rounded-pill shadow btn-glow" onClick={() => navigate('/login')}>Giriş Yap</button>
              <button className="btn btn-outline-light btn-lg px-5 fw-bold rounded-pill shadow" onClick={() => navigate('/register')}>Hesap Oluştur</button>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center mb-5" style={{ marginTop: !userId ? '-80px' : '20px', position: 'relative', zIndex: 10 }}>
        <div className="col-md-8">
          <div className="input-group input-group-lg shadow-lg rounded-pill overflow-hidden bg-white p-2">
            <span className="input-group-text bg-white border-0 ps-4">🔍</span>
            <input 
              type="text" 
              className="form-control border-0 fs-5" 
              placeholder="İl, semt veya ilan başlığına göre ara..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-5 mt-4">
        <h2 className="fw-bold text-center mb-1">
          {userId ? "✨ Sizin İçin Seçtiklerimiz" : "🔍 Öne Çıkan İlanlar"}
        </h2>
        <div className="mx-auto bg-primary" style={{ width: '60px', height: '4px', borderRadius: '2px' }}></div>
      </div>

      <div className="row">
        {filtrelenmisIlanlar.map((ilan) => (
          <div className="col-lg-4 col-md-6 mb-4" key={ilan.id}>
            <ListingCard 
              ilan={ilan}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              setEditingId={setEditingId}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              guncelle={guncelle}
              ilanSil={ilanSil}
              handleFavoriteToggle={handleFavoriteToggle}
              isFavorite={userFavorites.includes(ilan.id)}
              userRole={userRole}
              userId={userId}
              categories={categories} // --- KATEGORİ LİSTESİ KARTA GÖNDERİLDİ ---
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;