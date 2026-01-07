import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ListingCardProps {
  ilan: any;
  editingId: number | null;
  editForm: any;
  setEditForm: (val: any) => void;
  setEditingId: (id: number | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  guncelle: (id: number) => void;
  ilanSil: (id: number) => void;
  handleFavoriteToggle: (id: number) => void;
  isFavorite: boolean;
  userRole: string | null;
  userId: string | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  ilan, editingId, editForm, setEditForm, setEditingId,
  selectedFile, setSelectedFile, guncelle, ilanSil,
  handleFavoriteToggle, isFavorite, userRole, userId
}) => {
  const navigate = useNavigate();
  const isAuthorizedAgent = userRole === 'agent';

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/400x250?text=Resim+Yok';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `http://localhost:3000/uploads/${cleanPath}`;
  };

  return (
    <div className="card h-100 shadow-sm card-hover" style={{ borderRadius: '20px' }}>
      
      {userRole === 'user' && (
        <div 
          className="position-absolute top-0 end-0 m-3 p-1 rounded-circle bg-white shadow"
          style={{ cursor: 'pointer', zIndex: 10, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}
          onClick={() => handleFavoriteToggle(ilan.id)}
        >
          <span style={{ fontSize: '1.4rem' }}>{isFavorite ? '❤️' : '🤍'}</span>
        </div>
      )}

      <div className="listing-image-container">
        <img 
          src={getImageUrl(ilan.imageUrl)} 
          className="card-img-top" 
          alt="emlak"
          style={{ height: '240px', objectFit: 'cover' }}
        />
      </div>

      <div className="card-body d-flex flex-column p-4">
        {editingId === ilan.id ? (
          <div className="p-3 bg-light rounded-4 border shadow-sm">
            <h6 className="fw-bold mb-3 text-primary">İlanı Düzenle</h6>
            
            {/* SADECE LİNK GİRİŞİ BIRAKILDI */}
            <label className="fw-bold small text-muted mb-1 ms-2">Resim Adresi (URL)</label>
            <input 
              type="text" 
              className="form-control rounded-pill mb-2" 
              placeholder="https://i.ibb.co/..." 
              value={editForm.imageUrl || ''} 
              onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})} 
            />

            <input 
              type="text" 
              className="form-control rounded-pill mb-2" 
              placeholder="Başlık" 
              value={editForm.title} 
              onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
            />
            <input 
              type="number" 
              className="form-control rounded-pill mb-2" 
              placeholder="Fiyat" 
              value={editForm.price} 
              onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})} 
            />
            <select 
              className="form-select rounded-pill mb-3" 
              value={editForm.locationId} 
              onChange={(e) => setEditForm({...editForm, locationId: e.target.value})}
            >
              <option value="">Konum Seçin...</option>
              <option value="1">İstanbul / Beşiktaş</option>
              <option value="2">Ankara / Çankaya</option>
              <option value="3">İzmir / Bornova</option>
              <option value="4">Antalya / Muratpaşa</option>
              <option value="5">Bursa / Nilüfer</option>
            </select>

            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm rounded-pill flex-grow-1 fw-bold" onClick={() => guncelle(ilan.id)}>Kaydet</button>
              <button className="btn btn-secondary btn-sm rounded-pill flex-grow-1 fw-bold" onClick={() => setEditingId(null)}>İptal</button>
            </div>
          </div>
        ) : (
          <>
            <h5 className="card-title fw-bold text-dark mb-2">{ilan.title}</h5>
            <div className="d-flex align-items-center mb-2">
              <span className="fs-3 price-text">
                {userId ? `${Number(ilan.price)?.toLocaleString()} TL` : (
                  <span className="badge bg-light text-muted border fw-normal fs-6">🔒 Giriş yapın</span>
                )}
              </span>
            </div>
            <p className="text-muted small mb-3">
              📍 {ilan.location ? `${ilan.location.city} / ${ilan.location.district}` : 'Konum bilgisi yok'}
            </p>
            <div className="p-2 bg-light rounded-3 small text-muted border-0 mb-4 px-3">
              👤 <span className="ms-1">{ilan.user?.email || "E-posta Belirtilmemiş"}</span>
            </div>
            <div className="mt-auto pt-3 border-top">
              {isAuthorizedAgent ? (
                <div className="d-flex gap-2">
                  <button className="btn btn-warning flex-grow-1 text-white fw-bold rounded-pill shadow-sm" 
                    onClick={() => { 
                      setEditingId(ilan.id); 
                      setEditForm({ 
                        title: ilan.title, 
                        price: Number(ilan.price), 
                        locationId: ilan.location?.id?.toString() || '',
                        imageUrl: ilan.imageUrl // Mevcut resmi kutuya getirir
                      }); 
                    }}>✏️ Düzenle</button>
                  <button className="btn btn-outline-danger rounded-circle p-2" style={{width: '40px', height: '40px'}} onClick={() => ilanSil(ilan.id)}>🗑️</button>
                </div>
              ) : userId ? (
                <button className={`btn w-100 fw-bold rounded-pill py-2 shadow-sm transition-all ${isFavorite ? 'btn-danger' : 'btn-outline-primary'}`} onClick={() => handleFavoriteToggle(ilan.id)}>
                  {isFavorite ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle'}
                </button>
              ) : (
                <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" onClick={() => navigate('/login')}>Detaylar İçin Giriş Yap</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingCard;