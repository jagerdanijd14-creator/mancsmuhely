import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import React, { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyANOY9x0WYfrlu_mHGI2lgaKutj3QFtONc",
  authDomain: "mancsmuhely-kutyakozmetika.firebaseapp.com",
  databaseURL: "https://mancsmuhely-kutyakozmetika-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mancsmuhely-kutyakozmetika",
  storageBucket: "mancsmuhely-kutyakozmetika.firebasestorage.app",
  messagingSenderId: "282055899441",
  appId: "1:282055899441:web:6676bea8bedf8e8f881810",
  measurementId: "G-1BH3ZWBL9S"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [step, setStep] = useState(0); 
  const [user, setUser] = useState(null);
  const [phoneInput, setPhoneInput] = useState('+36 ');
  const [phoneError, setPhoneError] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  
  // Kutyák listája a profilon belül
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  
  // Új kutyus vagy szerkesztés állapota
  const [showNewDogForm, setShowNewDogForm] = useState(false);
  const [editingDogId, setEditingDogId] = useState(null);
  const [newDogData, setNewDogData] = useState({ name: '', breed: '' });

  // Kutya fajta kereséshez és szűréshez
  const [breedSearch, setBreedSearch] = useState('');
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Gazdi adatai (profilhoz is mentve)
  const [ownerInfo, setOwnerInfo] = useState({ name: '', phone: '', email: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Elmentett foglalások listája
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Admin szűrők és nézetek
  const [adminDateFilter, setAdminDateFilter] = useState('');
  const [adminViewMode, setAdminViewMode] = useState('list'); // 'list' vagy 'week'
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // Heti nézet lapozáshoz

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAllBookings(list);
      } else {
        setAllBookings([]);
      }
    });
  }, []);

  const commonBreeds = [
    { name: 'Keverék - kis testű', size: 'Kis testű' },
    { name: 'Keverék - közepes testű', size: 'Közepes testű' },
    { name: 'Keverék - nagy testű', size: 'Nagy testű' },
    { name: 'Francia bulldog', size: 'Kis testű' },
    { name: 'Csivava', size: 'Kis testű' },
    { name: 'Yorkshire terrier', size: 'Kis testű' },
    { name: 'Máltai selyemkutya', size: 'Kis testű' },
    { name: 'Bichon frise', size: 'Kis testű' },
    { name: 'Törpe uszkár', size: 'Kis testű' },
    { name: 'Tacskó', size: 'Kis testű' },
    { name: 'West highland white terrier', size: 'Kis testű' },
    { name: 'Törpe spicc (Pomerániai)', size: 'Kis testű' },
    { name: 'Mopsz', size: 'Kis testű' },
    { name: 'Pekingi palotapincsi', size: 'Kis testű' },
    { name: 'Shih tzu', size: 'Kis testű' },
    { name: 'Beagle', size: 'Közepes testű' },
    { name: 'Cocker spániel', size: 'Közepes testű' },
    { name: 'Staffordshire bull terrier', size: 'Közepes testű' },
    { name: 'Boxer', size: 'Közepes testű' },
    { name: 'Whippet', size: 'Közepes testű' },
    { name: 'Ausztral juhászkutya (Aussie)', size: 'Közepes testű' },
    { name: 'Border collie', size: 'Nagy testű' },
    { name: 'Közép uszkár', size: 'Közepes testű' },
    { name: 'Schnauzer (Közép)', size: 'Közepes testű' },
    { name: 'Corgi (Pembroke / Cardigan)', size: 'Közepes testű' },
    { name: 'Basset hound', size: 'Közepes testű' },
    { name: 'Bull terrier', size: 'Közepes testű' },
    { name: 'Német juhászkutya', size: 'Nagy testű' },
    { name: 'Golden retriever', size: 'Nagy testű' },
    { name: 'Labrador retriever', size: 'Nagy testű' },
    { name: 'Rövidszőrű magyar vizsla', size: 'Nagy testű' },
    { name: 'Dobermann', size: 'Nagy testű' },
    { name: 'Óriás uszkár', size: 'Nagy testű' },
    { name: 'Berni pásztorkutya', size: 'Nagy testű' },
    { name: 'Rhodesian ridgeback', size: 'Nagy testű' },
    { name: 'Szibériai husky', size: 'Nagy testű' },
    { name: 'Alaszkai malamut', size: 'Nagy testű' },
    { name: 'Ír szetter', size: 'Nagy testű' },
    { name: 'Weimari vizsla', size: 'Nagy testű' }
  ];

  const services = [
    { id: 1, category: 'Kis testű', name: 'Rövid szőr (pl. csivava, francia bulldog)', price: '7.500 Ft', time: '60 perc' },
    { id: 2, category: 'Kis testű', name: 'Hosszú szőr / nyírás (yorkie, bichon)', price: '9.000 Ft', time: '75 perc' },
    { id: 3, category: 'Kis testű', name: 'Trimmelés (westie, tacskó)', price: '10.000 Ft', time: '90 perc' },
    { id: 4, category: 'Kis testű', name: 'Dupla szőr (törpe spicc)', price: '9.500 Ft', time: '75 perc' },
    { id: 5, category: 'Közepes testű', name: 'Rövid szőr (beagle, basset hound)', price: '9.500 Ft', time: '75 perc' },
    { id: 6, category: 'Közepes testű', name: 'Hosszú szőr / nyírás (spániel, közép uszkár)', price: '11.000 Ft', time: '90 perc' },
    { id: 7, category: 'Közepes testű', name: 'Trimmelés (foxterrier, schnauzer)', price: '13.000 Ft', time: '100 perc' },
    { id: 8, category: 'Közepes testű', name: 'Dupla szőr (középspicc, corgi)', price: '12.000 Ft', time: '90 perc' },
    { id: 9, category: 'Nagy testű', name: 'Rövid szőr (vizsla, dobermann)', price: '12.000 Ft', time: '90 perc' },
    { id: 10, category: 'Nagy testű', name: 'Hosszú szőr (óriás uszkár)', price: '18.000 Ft', time: '120 perc' },
    { id: 11, category: 'Nagy testű', name: 'Trimmelés (airedale, óriás schnauzer)', price: '17.000 Ft', time: '120 perc' },
    { id: 12, category: 'Nagy testű', name: 'Dupla szőr (golden retriever, collie)', price: '15.000 Ft', time: '120 perc' },
    { id: 13, category: 'Egyéb Szolgáltatás', name: 'Karomvágás', price: '2.000 Ft', time: '20 perc' }
  ];

  const timeSlots = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+36 ')) {
      value = '+36 ';
    }
    const afterPrefix = value.replace('+36 ', '').replace(/\D/g, '').slice(0, 9);
    setPhoneInput('+36 ' + afterPrefix);
    setPhoneError('');
  };

  const handlePhoneLoginSubmit = (e) => {
    e.preventDefault();
    const digitsAfter = phoneInput.replace('+36 ', '');
    
    if (digitsAfter.length !== 9) {
      setPhoneError('Hiba: Pontosan 9 számjegy megadása kötelező a +36 után!');
      return;
    }

    setUser({ type: 'phone', identifier: phoneInput });

    const savedDogs = localStorage.getItem(`mancs_dogs_${phoneInput}`);
    if (savedDogs) setDogs(JSON.parse(savedDogs));
    else setDogs([]);

    const savedOwner = localStorage.getItem(`mancs_owner_${phoneInput}`);
    if (savedOwner) {
      setOwnerInfo(JSON.parse(savedOwner));
    } else {
      setOwnerInfo({ name: '', phone: phoneInput, email: '' });
    }

    const savedBookings = localStorage.getItem(`mancs_bookings_${phoneInput}`);
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    else setBookings([]);

    setStep(1);
  };

  const handleGuestLogin = () => {
    setUser({ type: 'guest', identifier: 'Vendég (Nincs mentés)' });
    setDogs([]);
    setBookings([]);
    setOwnerInfo({ name: '', phone: '', email: '' });
    setStep(1);
  };

  const handleLogout = () => {
    setUser(null);
    setPhoneInput('+36 ');
    setPhoneError('');
    setShowPhoneInput(false);
    setStep(0);
    setDogs([]);
    setSelectedDog(null);
    setShowNewDogForm(false);
    setEditingDogId(null);
    setNewDogData({ name: '', breed: '' });
    setBreedSearch('');
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setOwnerInfo({ name: '', phone: '', email: '' });
    setIsEditingProfile(false);
    setBookings([]);
    setAdminDateFilter('');
    setAdminViewMode('list');
    setCurrentWeekOffset(0);
  };

  const handleAdminAccess = () => {
    const password = prompt('Add meg az admin jelszót:');
    if (password === 'admin123') {
      setStep(7);
    } else if (password !== null) {
      alert('Hibás jelszó!');
    }
  };

  const saveDogsToStorage = (updatedDogs) => {
    setDogs(updatedDogs);
    if (user && user.type === 'phone') {
      localStorage.setItem(`mancs_dogs_${user.identifier}`, JSON.stringify(updatedDogs));
    }
  };

  const handleSaveOwnerProfile = (e) => {
    e.preventDefault();
    if (user && user.type === 'phone') {
      localStorage.setItem(`mancs_owner_${user.identifier}`, JSON.stringify(ownerInfo));
    }
    setIsEditingProfile(false);
    alert('Profil adatok sikeresen elmentve!');
  };

  const handleSaveDogSubmit = (e) => {
    e.preventDefault();
    if (!newDogData.name || !newDogData.breed) return;

    const matchedBreedObj = commonBreeds.find(b => b.name.toLowerCase() === newDogData.breed.toLowerCase());
    if (!matchedBreedObj) {
      alert('Kérlek a listából válassz ki egy érvényes kutyafajtát vagy keverék kategóriát!');
      return;
    }

    let updatedDogs;
    if (editingDogId !== null) {
      updatedDogs = dogs.map(dog => 
        dog.id === editingDogId 
          ? { ...dog, name: newDogData.name, breed: matchedBreedObj.name, size: matchedBreedObj.size } 
          : dog
      );
    } else {
      const newDog = {
        id: Date.now(),
        name: newDogData.name,
        type: 'Kutya',
        breed: matchedBreedObj.name,
        size: matchedBreedObj.size
      };
      updatedDogs = [...dogs, newDog];
      setSelectedDog(newDog);
    }

    saveDogsToStorage(updatedDogs);
    setShowNewDogForm(false);
    setEditingDogId(null);
    setNewDogData({ name: '', breed: '' });
    setBreedSearch('');
  };

  const handleStartEdit = (e, dog) => {
    e.stopPropagation();
    setEditingDogId(dog.id);
    setNewDogData({ name: dog.name, breed: dog.breed });
    setBreedSearch(dog.breed);
    setShowNewDogForm(true);
  };

  const handleDeleteDog = (e, dogId) => {
    e.stopPropagation();
    if (window.confirm('Biztosan törölni szeretnéd ezt a kutyust?')) {
      const updatedDogs = dogs.filter(dog => dog.id !== dogId);
      saveDogsToStorage(updatedDogs);
      if (selectedDog?.id === dogId) {
        setSelectedDog(null);
      }
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Biztosan le szeretnéd mondani ezt az időpontot? Az idősáv azonnal újra felszabadul.')) {
      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);

      if (user && user.type === 'phone') {
        localStorage.setItem(`mancs_bookings_${user.identifier}`, JSON.stringify(updatedBookings));
      }

      const updatedAllBookings = allBookings.filter(b => b.id !== bookingId);
      setAllBookings(updatedAllBookings);
    }
  };

  const handleAdminUpdateStatus = (bookingId, newStatus) => {
    const updatedAll = allBookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });

    let finalAllBookings = updatedAll;
    if (newStatus === 'Elutasítva') {
      finalAllBookings = updatedAll.filter(b => b.id !== bookingId);
    }

    setAllBookings(finalAllBookings);

    const updatedUserBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    
    const finalUserBookings = newStatus === 'Elutasítva' 
      ? bookings.filter(b => b.id !== bookingId) 
      : updatedUserBookings;

    setBookings(finalUserBookings);
  };

  const filteredBreeds = commonBreeds.filter(b => 
    b.name.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const isTimeSlotBooked = (date, time) => {
    return allBookings.some(b => b.date === date && b.time === time && b.status !== 'Elutasítva');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (isTimeSlotBooked(selectedDate, selectedTime)) {
      alert('Sajnáljuk, ezt az időpontot közben már valaki lefoglalta! Kérlek válassz másik idősávot.');
      setStep(3);
      return;
    }

    const newBooking = {
      id: Date.now(),
      ownerName: ownerInfo.name,
      ownerPhone: ownerInfo.phone,
      ownerEmail: ownerInfo.email,
      dogName: selectedDog?.name,
      dogBreed: selectedDog?.breed,
      serviceName: selectedService?.name,
      servicePrice: selectedService?.price,
      date: selectedDate,
      time: selectedTime,
      status: 'Függőben',
      createdAt: new Date().toLocaleDateString('hu-HU')
    };

    try {
      const appointmentsRef = ref(db, 'appointments');
      await push(appointmentsRef, newBooking);

      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);

      if (user && user.type === 'phone') {
        localStorage.setItem(`mancs_bookings_${user.identifier}`, JSON.stringify(updatedBookings));
        localStorage.setItem(`mancs_owner_${user.identifier}`, JSON.stringify(ownerInfo));
      }

      setStep(5);
    } catch (error) {
      console.error("Hiba a mentés során: ", error);
      alert('Nem sikerült elmenteni az adatbázisba a foglalást.');
    }
  };

  const getWeekDates = (offset) => {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + (offset * 7));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const d = String(day.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${d}`;
      
      const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
      weekDays.push({
        dateStr,
        label: `${dayNames[day.getDay()]} (${d}.${month}.)`
      });
    }
    return weekDays;
  };

  return (
    <div style={{ backgroundColor: '#FAF6F2', color: '#4A3B32', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Fejléc */}
        <div style={{ textAlign: 'center', marginBottom: '25px', position: 'relative' }}>
          {user && (
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <button 
                onClick={handleLogout}
                style={{ fontSize: '12px', background: '#E5D9D2', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', color: '#4A3B32' }}
              >
                Kijelentkezés
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              backgroundColor: '#FAF6F2'
            }}>
              <img 
                src="https://www.dropbox.com/scl/fi/f23d17fmsis9x3ut0mric/Messenger_creation_25CA50C6-B346-41F8-9B6A-27DD838CC152.jpeg?rlkey=5bscghxc6q0t0t0cfbucklrpa&st=k82ic52h&raw=1" 
                alt="MancsMűhely Kutyakozmetika Logó" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>

          <h1 style={{ color: '#4A3B32', fontSize: '28px', margin: '0 0 5px 0' }}>MancsMűhely</h1>
          <p style={{ color: '#8C7A70', fontSize: '14px', margin: 0 }}>Kutyakozmetika Időpontfoglaló</p>
          
          {user && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#D8B4B8', fontWeight: 'bold' }}>
                {user.type === 'phone' ? `Profil: ${user.identifier}` : 'Mód: Vendég'}
              </span>
              {user.type === 'phone' && (
                <>
                  <button 
                    onClick={() => { setIsEditingProfile(true); setStep(1); }}
                    style={{ fontSize: '11px', background: '#FAF6F2', border: '1px solid #E5D9D2', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', color: '#4A3B32' }}
                  >
                    👤 Profil szerkesztése
                  </button>
                  <button 
                    onClick={() => setStep(6)}
                    style={{ fontSize: '11px', background: '#FAF6F2', border: '1px solid #E5D9D2', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', color: '#4A3B32' }}
                  >
                    📅 Foglalásaim ({bookings.length})
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 0. Lépés: Bejelentkezés */}
        {step === 0 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <h2>Üdvözlünk a MancsMűhelyben!</h2>
            <p style={{ color: '#776B63', fontSize: '14px', marginBottom: '25px' }}>
              Jelentkezz be a telefonszámoddal a profilod eléréséhez, vagy folytasd vendégként!
            </p>

            {!showPhoneInput ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px', margin: '0 auto' }}>
                <button 
                  onClick={() => setShowPhoneInput(true)}
                  style={{ padding: '12px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📱 Bejelentkezés telefonszámmal (Profil)
                </button>
                <hr style={{ border: 'none', borderTop: '1px solid #E5D9D2', margin: '10px 0' }} />
                <button 
                  onClick={handleGuestLogin}
                  style={{ padding: '12px', background: '#E5D9D2', color: '#4A3B32', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Folytatás bejelentkezés nélkül (Vendég)
                </button>

                <div style={{ marginTop: '25px', borderTop: '1px dashed #E5D9D2', paddingTop: '15px' }}>
                  <button 
                    onClick={handleAdminAccess}
                    style={{ background: 'none', border: 'none', color: '#8C7A70', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    🔒 Tulajdonosi Admin Belépés
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePhoneLoginSubmit} style={{ maxWidth: '350px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ textAlign: 'left', fontSize: '13px', fontWeight: 'bold' }}>
                  Add meg a telefonszámod:
                  <input 
                    type="text" 
                    required
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: phoneError ? '2px solid #D8B4B8' : '1px solid #CCC', boxSizing: 'border-box', backgroundColor: 'white', color: '#4A3B32', fontSize: '14px', outline: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '11px', color: '#776B63', textAlign: 'left', marginTop: '-6px' }}>
                  Formátum: +36 és pontosan 9 számjegy (pl. +36301234567)
                </span>
                {phoneError && <p style={{ color: '#A94442', fontSize: '12px', margin: 0, textAlign: 'left' }}>{phoneError}</p>}
                <button type="submit" style={{ padding: '12px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                  Belépés a profilba
                </button>
                <button type="button" onClick={() => { setShowPhoneInput(false); setPhoneError(''); setPhoneInput('+36 '); }} style={{ padding: '8px', background: 'transparent', color: '#8C7A70', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  Vissza a főbb opciókhoz
                </button>
              </form>
            )}
          </div>
        )}

        {/* Profil szerkesztése */}
        {step === 1 && isEditingProfile && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>👤 Gazdi adatai (Profil)</h2>
              <button onClick={() => setIsEditingProfile(false)} style={{ background: '#E5D9D2', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Vissza</button>
            </div>
            <form onSubmit={handleSaveOwnerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                Neved:
                <input 
                  type="text" required placeholder="pl. Kovács Anna"
                  value={ownerInfo.name} onChange={(e) => setOwnerInfo({...ownerInfo, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
                />
              </label>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                Telefonszám (Azonosító):
                <input 
                  type="text" disabled value={ownerInfo.phone}
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: '#FAF6F2', color: '#8C7A70' }}
                />
              </label>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                Email cím:
                <input 
                  type="email" required placeholder="pl. anna@example.com"
                  value={ownerInfo.email} onChange={(e) => setOwnerInfo({...ownerInfo, email: e.target.value})}
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
                />
              </label>
              <button type="submit" style={{ padding: '12px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Profil mentése
              </button>
            </form>
          </div>
        )}

        {/* 1. Lépés: Kutyus kiválasztása */}
        {step === 1 && !isEditingProfile && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', background: '#E5D9D2', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>1 / 4 lépés</span>
                <h2 style={{ marginTop: '10px', marginBottom: '5px' }}>Melyik kisállatoddal jössz?</h2>
                <p style={{ color: '#776B63', fontSize: '13px' }}>Válaszd ki a kutyusodat, vagy kezeld a profilodat:</p>
              </div>
              {user?.type === 'phone' && (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  style={{ fontSize: '12px', background: '#FAF6F2', border: '1px solid #E5D9D2', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#4A3B32', height: 'fit-content' }}
                >
                  ✏️ Adatok szerkesztése
                </button>
              )}
            </div>

            {!showNewDogForm ? (
              <div>
                {dogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 20px', background: '#FAF6F2', borderRadius: '12px', marginBottom: '20px' }}>
                    <p style={{ color: '#776B63', margin: '0 0 15px 0', fontSize: '14px' }}>Még nincs rögzített kisállatod a profilodban.</p>
                    <button 
                      onClick={() => { setEditingDogId(null); setNewDogData({ name: '', breed: '' }); setBreedSearch(''); setShowNewDogForm(true); }}
                      style={{ padding: '10px 20px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      + Új kisállat hozzáadása
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {dogs.map((dog) => (
                      <div 
                        key={dog.id}
                        onClick={() => { setSelectedDog(dog); setSelectedService(null); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '15px',
                          borderRadius: '12px',
                          border: selectedDog?.id === dog.id ? '2px solid #4A3B32' : '1px solid #E5D9D2',
                          backgroundColor: selectedDog?.id === dog.id ? '#FDFBF9' : 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#E5D9D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#4A3B32' }}>
                            {dog.name.charAt(0)}
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 3px 0', fontSize: '16px' }}>{dog.name}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#776B63' }}>🐶 {dog.breed} <span style={{ backgroundColor: '#FAF6F2', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', marginLeft: '4px' }}>({dog.size})</span></p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button title="Szerkesztés" onClick={(e) => handleStartEdit(e, dog)} style={{ background: '#E5D9D2', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#4A3B32' }}>✏️</button>
                          <button title="Törlés" onClick={(e) => handleDeleteDog(e, dog.id)} style={{ background: '#F8D7DA', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#721C24' }}>🗑</button>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #4A3B32', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5px' }}>
                            {selectedDog?.id === dog.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4A3B32' }}></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setEditingDogId(null); setNewDogData({ name: '', breed: '' }); setBreedSearch(''); setShowNewDogForm(true); }}
                      style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed #8C7A70', color: '#4A3B32', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      + Új kisállat hozzáadása
                    </button>
                  </div>
                )}

                <div>
                  <button 
                    disabled={!selectedDog}
                    onClick={() => setStep(2)}
                    style={{
                      width: '100%', padding: '12px',
                      backgroundColor: selectedDog ? '#4A3B32' : '#D0C9C5',
                      color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: selectedDog ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Tovább
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveDogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{editingDogId !== null ? 'Kutyus adatainak módosítása' : 'Új kutyus adatai'}</h3>
                
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  Kutyus neve:
                  <input 
                    type="text" required placeholder="pl. Bodza"
                    value={newDogData.name} onChange={(e) => setNewDogData({...newDogData, name: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
                  />
                </label>

                <label style={{ fontSize: '13px', fontWeight: 'bold', position: 'relative' }}>
                  Kutyafajta / Keverék:
                  <input 
                    type="text" required placeholder="Kezdj el gépelni..."
                    value={breedSearch}
                    onFocus={() => setIsBreedDropdownOpen(true)}
                    onChange={(e) => {
                      setBreedSearch(e.target.value);
                      setIsBreedDropdownOpen(true);
                      setNewDogData({...newDogData, breed: e.target.value});
                    }}
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
                  />
                  {isBreedDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '180px', overflowY: 'auto', backgroundColor: 'white', border: '1px solid #CCC', borderRadius: '6px', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginTop: '2px' }}>
                      {filteredBreeds.length > 0 ? (
                        filteredBreeds.map((b, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setNewDogData({...newDogData, breed: b.name});
                              setBreedSearch(b.name);
                              setIsBreedDropdownOpen(false);
                            }}
                            style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #FAF6F2', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}
                          >
                            <span>{b.name}</span>
                            <span style={{ color: '#8C7A70', fontSize: '11px' }}>{b.size}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '10px', fontSize: '12px', color: '#A94442' }}>Nincs találat a listában.</div>
                      )}
                    </div>
                  )}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowNewDogForm(false)} style={{ width: '50%', padding: '12px', background: '#E5D9D2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Mégse</button>
                  <button type="submit" style={{ width: '50%', padding: '12px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Mentés</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. Lépés: Szolgáltatás választás */}
        {step === 2 && (
          <div>
            <span style={{ fontSize: '12px', background: '#E5D9D2', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>2 / 4 lépés</span>
            <h2 style={{ marginTop: '10px', marginBottom: '5px' }}>Válassz szolgáltatást</h2>
            <div style={{ background: '#FAF6F2', padding: '10px 15px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>
              <b>Kiválasztott kutyus:</b> {selectedDog?.name} ({selectedDog?.breed} - <i>{selectedDog?.size}</i>)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
              {services
                .filter(s => s.category === selectedDog?.size || s.category === 'Egyéb Szolgáltatás')
                .map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    style={{
                      border: selectedService?.id === s.id ? '2px solid #D8B4B8' : '1px solid #E5D9D2',
                      backgroundColor: selectedService?.id === s.id ? '#FDFBF9' : 'white',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '11px', backgroundColor: '#E5D9D2', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', color: '#4A3B32' }}>{s.category}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '5px' }}>
                      <span style={{ fontSize: '15px' }}>{s.name}</span>
                      <span style={{ color: '#D8B4B8', whiteSpace: 'nowrap', marginLeft: '10px' }}>{s.price}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#776B63', margin: '3px 0 0 0' }}>Becsült idő: {s.time}</p>
                  </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setStep(1)} style={{ width: '50%', padding: '12px', background: '#E5D9D2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Vissza</button>
              <button 
                disabled={!selectedService}
                onClick={() => setStep(3)}
                style={{ width: '50%', padding: '12px', backgroundColor: selectedService ? '#4A3B32' : '#D0C9C5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: selectedService ? 'pointer' : 'not-allowed' }}
              >
                Tovább az időpontra
              </button>
            </div>
          </div>
        )}

        {/* 3. Lépés: Dátum és Időpont */}
        {step === 3 && (
          <div>
            <span style={{ fontSize: '12px', background: '#E5D9D2', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>3 / 4 lépés</span>
            <h2 style={{ marginTop: '10px', marginBottom: '5px' }}>Válassz időpontot</h2>
            <p style={{ color: '#776B63', fontSize: '12px', margin: '0 0 15px 0' }}>
              🕒 Nyitvatartásunk: Hétfőtől Vasárnapig <b>07:00 – 20:00</b> között.
            </p>
            <div style={{ marginTop: '15px' }}>
              <label>
                Dátum:
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      e.target.showPicker();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #8C7A70',
                    backgroundColor: 'white',
                    color: '#4A3B32',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </label>

              <p style={{ marginTop: '15px', marginBottom: '8px' }}>
                Elérhető idősávok {selectedDate ? `(${selectedDate})` : '- Válassz dátumot először'}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {timeSlots.map((time) => {
                  const booked = selectedDate ? isTimeSlotBooked(selectedDate, time) : false;
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      disabled={!selectedDate || booked}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #4A3B32' : (booked ? '1px solid #E5D9D2' : '1px solid #8C7A70'),
                        backgroundColor: isSelected ? '#D8B4B8' : (booked ? '#F2EDE9' : 'white'),
                        color: booked ? '#A09085' : '#4A3B32',
                        cursor: (!selectedDate || booked) ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        textDecoration: booked ? 'line-through' : 'none'
                      }}
                    >
                      {time} {booked && '(Foglalt)'}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
              <button onClick={() => setStep(2)} style={{ width: '50%', padding: '12px', background: '#E5D9D2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Vissza</button>
              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(4)} 
                style={{ width: '50%', padding: '12px', background: (selectedDate && selectedTime) ? '#4A3B32' : '#D0C9C5', color: 'white', border: 'none', borderRadius: '8px', cursor: (selectedDate && selectedTime) ? 'pointer' : 'not-allowed' }}
              >
                Tovább az adatokhoz
              </button>
            </div>
          </div>
        )}

        {/* 4. Lépés: Gazdi adatai & Összegzés */}
        {step === 4 && (
          <form onSubmit={handleBookingSubmit}>
            <span style={{ fontSize: '12px', background: '#E5D9D2', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>4 / 4 lépés</span>
            <h2 style={{ marginTop: '10px', marginBottom: '5px' }}>Gazdi adatai</h2>
            <div style={{ background: '#FAF6F2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px' }}>
              <p style={{ margin: '0 0 5px 0' }}><b>Kutyus:</b> {selectedDog?.name} ({selectedDog?.breed})</p>
              <p style={{ margin: '0 0 5px 0' }}><b>Szolgáltatás:</b> {selectedService?.name} ({selectedService?.price})</p>
              <p style={{ margin: 0 }}><b>Időpont:</b> {selectedDate} - {selectedTime}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" placeholder="Neved" required
                value={ownerInfo.name} onChange={(e) => setOwnerInfo({...ownerInfo, name: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
              />
              <input 
                type="text" placeholder="Telefonszám" required
                value={ownerInfo.phone} onChange={(e) => setOwnerInfo({...ownerInfo, phone: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
              />
              <input 
                type="email" placeholder="Email cím" required
                value={ownerInfo.email} onChange={(e) => setOwnerInfo({...ownerInfo, email: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setStep(3)} style={{ width: '50%', padding: '12px', background: '#E5D9D2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Vissza</button>
              <button type="submit" style={{ width: '50%', padding: '12px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Foglalás véglegesítése</button>
            </div>
          </form>
        )}

        {/* 5. Lépés: Sikeres foglalás */}
        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#4A3B32' }}>🎉 Sikeres időpontfoglalás!</h2>
            <p style={{ color: '#776B63', lineHeight: '1.6' }}>
              Köszönjük a foglalást, <b>{ownerInfo.name}</b>!<br />
              Várjuk szeretettel <b>{selectedDog?.name}</b> nevű kutyusodat <b>{selectedDate}</b>-án/én, <b>{selectedTime}</b>-kor.<br />
              <span style={{ fontSize: '12px', color: '#D8B4B8', fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
                ℹ Státusz: Függőben (A tulajdonos hamarosan jóváhagyja).
              </span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setStep(6)}
                style={{ padding: '10px 20px', background: '#E5D9D2', color: '#4A3B32', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📅 Foglalásaim megtekintése
              </button>
              <button 
                onClick={() => { setStep(1); setSelectedService(null); setSelectedDate(''); setSelectedTime(''); }}
                style={{ padding: '10px 20px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Új foglalás indítása
              </button>
            </div>
          </div>
        )}

        {/* 6. Lépés: Foglalásaim / Időpontjaim lista nézet */}
        {step === 6 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>📅 Elmentett foglalásaim</h2>
              <button onClick={() => setStep(1)} style={{ background: '#E5D9D2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Vissza</button>
            </div>

            {(() => {
              let currentBookings = bookings;
              if (user && user.type === 'phone') {
                const saved = localStorage.getItem(`mancs_bookings_${user.identifier}`);
                if (saved) {
                  currentBookings = JSON.parse(saved);
                }
              }

              return currentBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: '#FAF6F2', borderRadius: '12px' }}>
                  <p style={{ color: '#776B63', fontSize: '14px', margin: '0 0 15px 0' }}>Még nincsenek aktív vagy múltbeli foglalásaid.</p>
                  <button onClick={() => setStep(1)} style={{ padding: '10px 20px', background: '#4A3B32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Foglalás most</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                  {currentBookings.map((b) => (
                    <div key={b.id} style={{ background: '#FAF6F2', padding: '15px', borderRadius: '10px', border: '1px solid #E5D9D2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '10px', fontWeight: 'bold', marginBottom: '5px', alignItems: 'center' }}>
                          <span>🐶 {b.dogName} ({b.dogBreed})</span>
                          <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: b.status === 'Elfogadva' ? '#D4EDDA' : (b.status === 'Elutasítva' ? '#F8D7DA' : '#FFF3CD'), color: b.status === 'Elfogadva' ? '#155724' : (b.status === 'Elutasítva' ? '#721C24' : '#856404') }}>
                            {b.status || 'Függőben'}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0', fontSize: '13px', color: '#4A3B32' }}><b>Szolgáltatás:</b> {b.serviceName} ({b.servicePrice})</p>
                        <p style={{ margin: '3px 0', fontSize: '13px', color: '#776B63' }}>🕒 Időpont: <b>{b.date} - {b.time}</b></p>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          style={{ backgroundColor: '#F8D7DA', color: '#721C24', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        >
                          ❌ Lemondás
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* 7. Lépés: ADMIN FELÜLET */}
        {step === 7 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', backgroundColor: '#D8B4B8', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold' }}>🔒 Tulajdonosi Mód</span>
                <h2 style={{ margin: '5px 0 0 0' }}>Beérkezett Foglalások Kezelése</h2>
              </div>
              <button onClick={() => setStep(0)} style={{ background: '#E5D9D2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Főoldal / Kilépés</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button 
                onClick={() => setAdminViewMode('list')}
                style={{ flex: 1, padding: '10px', background: adminViewMode === 'list' ? '#4A3B32' : '#E5D9D2', color: adminViewMode === 'list' ? 'white' : '#4A3B32', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                📋 Lista nézet (Összes & Dátumszűrő)
              </button>
              <button 
                onClick={() => setAdminViewMode('week')}
                style={{ flex: 1, padding: '10px', background: adminViewMode === 'week' ? '#4A3B32' : '#E5D9D2', color: adminViewMode === 'week' ? 'white' : '#4A3B32', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                📅 Heti nézet (Naptár)
              </button>
            </div>

            {/* LISTA NÉZET */}
            {adminViewMode === 'list' && (
              <div>
                <div style={{ background: '#FAF6F2', padding: '12px', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #E5D9D2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', flex: 1 }}>
                    Szűrés pontos dátum szerint:
                    <input 
                      type="date"
                      value={adminDateFilter}
                      onChange={(e) => setAdminDateFilter(e.target.value)}
                      onClick={(e) => {
                        if (typeof e.target.showPicker === 'function') {
                          e.target.showPicker();
                        }
                      }}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: 'white', color: '#4A3B32', cursor: 'pointer' }}
                    />
                  </label>
                  {adminDateFilter && (
                    <button 
                      onClick={() => setAdminDateFilter('')}
                      style={{ marginTop: '18px', padding: '8px 12px', background: '#E5D9D2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Szűrés törlése
                    </button>
                  )}
                </div>

                {(() => {
                  const sortedBookings = [...allBookings].sort((a, b) => {
                    if (a.date !== b.date) {
                      return a.date.localeCompare(b.date);
                    }
                    return a.time.localeCompare(b.time);
                  });

                  const filteredAdminBookings = sortedBookings.filter(b => {
                    if (!adminDateFilter) return true;
                    return b.date === adminDateFilter;
                  });

                  return filteredAdminBookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', background: '#FAF6F2', borderRadius: '12px' }}>
                      <p style={{ color: '#776B63', fontSize: '14px', margin: 0 }}>
                        {adminDateFilter ? `Nincs foglalás a kiválasztott napon (${adminDateFilter}).` : 'Jelenleg nincs egyetlen beérkezett foglalás sem a rendszerben.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                      {filteredAdminBookings.map((b) => (
                        <div key={b.id} style={{ background: '#FAF6F2', padding: '15px', borderRadius: '10px', border: '1px solid #E5D9D2' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8C7A70' }}>📅 {b.date} - {b.time}</span>
                            <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: b.status === 'Elfogadva' ? '#D4EDDA' : (b.status === 'Elutasítva' ? '#F8D7DA' : '#FFF3CD'), color: b.status === 'Elfogadva' ? '#155724' : (b.status === 'Elutasítva' ? '#721C24' : '#856404') }}>
                              Státusz: {b.status || 'Függőben'}
                            </span>
                          </div>

                          <div style={{ fontSize: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '10px' }}>
                            <p style={{ margin: 0 }}>👤 <b>Gazdi:</b> {b.ownerName || 'Ismeretlen'}</p>
                            <p style={{ margin: 0 }}>📞 <b>Tel:</b> {b.ownerPhone || 'Nincs megadva'}</p>
                            <p style={{ margin: 0 }}>🐶 <b>Kutyus:</b> {b.dogName} ({b.dogBreed})</p>
                            <p style={{ margin: 0 }}>✂ <b>Csomag:</b> {b.serviceName} ({b.servicePrice})</p>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid #E5D9D2', paddingTop: '10px' }}>
                            {b.status !== 'Elfogadva' && (
                              <button 
                                onClick={() => handleAdminUpdateStatus(b.id, 'Elfogadva')}
                                style={{ flex: 1, backgroundColor: '#D4EDDA', color: '#155724', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                              >
                                ✅ Elfogad
                              </button>
                            )}
                            <button 
                              onClick={() => handleAdminUpdateStatus(b.id, 'Elutasítva')}
                              style={{ flex: 1, backgroundColor: '#F8D7DA', color: '#721C24', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                            >
                              ❌ Elutasít (Felszabadít)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* HETI NÉZET */}
            {adminViewMode === 'week' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAF6F2', padding: '10px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #E5D9D2' }}>
                  <button 
                    onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                    style={{ background: '#E5D9D2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    ◀ Előző hét
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {currentWeekOffset === 0 ? 'Aktuális hét' : (currentWeekOffset > 0 ? `+${currentWeekOffset}. hét` : `${currentWeekOffset}. hét`)}
                  </span>
                  <button 
                    onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                    style={{ background: '#E5D9D2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    Következő hét ▶
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {getWeekDates(currentWeekOffset).map((dayInfo) => {
                    const dayBookings = allBookings
                      .filter(b => b.date === dayInfo.dateStr)
                      .sort((a, b) => a.time.localeCompare(b.time));

                    return (
                      <div key={dayInfo.dateStr} style={{ background: '#FAF6F2', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E5D9D2' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4A3B32', borderBottom: '1px dashed #E5D9D2', paddingBottom: '5px' }}>
                          📅 {dayInfo.label}
                        </h4>

                        {dayBookings.length === 0 ? (
                          <p style={{ margin: 0, fontSize: '12px', color: '#8C7A70', fontStyle: 'italic' }}>Nincs foglalás ezen a napon.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                            {dayBookings.map((b) => (
                              <div key={b.id} style={{ background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #E5D9D2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', background: '#FAF6F2', padding: '2px 6px', borderRadius: '4px' }}>🕒 {b.time}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>🐶 {b.dogName} ({b.dogBreed})</span>
                                    <span style={{ fontSize: '10px', padding: '2px 5px', borderRadius: '4px', backgroundColor: b.status === 'Elfogadva' ? '#D4EDDA' : (b.status === 'Elutasítva' ? '#F8D7DA' : '#FFF3CD'), color: b.status === 'Elfogadva' ? '#155724' : (b.status === 'Elutasítva' ? '#721C24' : '#856404') }}>
                                      {b.status || 'Függőben'}
                                    </span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: '12px', color: '#776B63' }}>Gazdi: <b>{b.ownerName}</b> ({b.ownerPhone}) | Csomag: {b.serviceName}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  {b.status !== 'Elfogadva' && (
                                    <button 
                                      onClick={() => handleAdminUpdateStatus(b.id, 'Elfogadva')}
                                      style={{ backgroundColor: '#D4EDDA', color: '#155724', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                                    >
                                      ✔
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleAdminUpdateStatus(b.id, 'Elutasítva')}
                                    style={{ backgroundColor: '#F8D7DA', color: '#721C24', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
