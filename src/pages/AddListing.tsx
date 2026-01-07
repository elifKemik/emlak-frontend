import React, { useState } from 'react';
import axios from 'axios';

const AddListing = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [locationId, setLocationId] = useState('');
  // Yeni: Dosya yerine URL state'i
  const [imageUrl, setImageUrl] = useState('');

  // KRİTİK: Backend URL'ini buraya tanımlıyoruz
  const API_URL = 'http://localhost:3000';

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId || storedUserId === "undefined" || storedUserId === "null") {
      alert("Oturum bulunamadı! Lütfen tekrar giriş yapın.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('locationId', locationId);
    formData.append('userId', storedUserId);
    
    // Yeni: Image URL'i FormData'ya ekliyoruz
    if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    try {
      await axios.post(`${API_URL}/ilan/ekle`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-id': storedUserId 
        }
      });
      alert("İlan başarıyla eklendi! ✅");
      // Formu temizle
      setTitle(''); setPrice(''); setLocationId(''); setImageUrl('');
    } catch (error: any) {
      console.error("Hata detayı:", error);
      const errorMsg = error.response?.data?.message || "İlan eklenirken bir hata oluştu.";
      alert(`Hata: ${errorMsg}`);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-11 col-md-10 col-lg-9 shadow-lg rounded-5 overflow-hidden bg-white d-flex flex-wrap p-0">
          
          <div className="col-md-5 d-none d-md-flex flex-column justify-content-end p-5 text-white position-relative"
               style={{ background: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80") center/cover no-repeat' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))' }}></div>
            <div className="position-relative">
              <h2 className="fw-bold display-6">Mülkünü Satışa Çıkar 🚀</h2>
              <p className="opacity-75">Hayalindeki müşteriye ulaşmak için doğru yerdesin.</p>
            </div>
          </div>

          <div className="col-md-7 p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🏠</span>
              <h3 className="fw-bold mt-2">İlan Detayları</h3>
            </div>
            
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="fw-bold small ms-2 text-primary">İlan Başlığı</label>
                <input type="text" className="form-control form-control-lg rounded-4 bg-light border-0 shadow-sm" placeholder="Beşiktaş'ta Lüks Daire" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              
              <div className="mb-3">
                <label className="fw-bold small ms-2 text-primary">Fiyat (TL)</label>
                <input type="number" className="form-control form-control-lg rounded-4 bg-light border-0 shadow-sm" placeholder="5.000.000" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="fw-bold small ms-2 text-primary">Konum</label>
                <select className="form-select form-select-lg rounded-4 bg-light border-0 shadow-sm" value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                  <option value="">Lütfen seçin...</option>
                  <option value="1">İstanbul / Beşiktaş</option>
                  <option value="2">Ankara / Çankaya</option>
                  <option value="3">İzmir / Bornova</option>
                  <option value="4">Antalya / Muratpaşa</option>
                  <option value="5">Bursa / Nilüfer</option>
                </select>
              </div>

              {/* GÜNCELLENEN KISIM: Fotoğraf Yükle yerine Fotoğraf Linki */}
              <div className="mb-4">
                <label className="fw-bold small ms-2 text-primary">Fotoğraf Linki (URL)</label>
                <div className="p-3 border-2 border-dashed rounded-4 bg-light text-center position-relative">
                  <input 
                    type="text" 
                    className="form-control border-0 bg-transparent" 
                    placeholder="https://i.ibb.co/..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    required 
                  />
                  <small className="text-muted d-block mt-1"> "Doğrudan Bağlantı" linkini buraya yapıştırın.</small>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-lg transition-all hover-scale">
                Şimdi Yayına Al ✨
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListing;