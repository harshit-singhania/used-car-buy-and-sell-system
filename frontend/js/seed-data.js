/* Seeds localStorage with demo cars + sellers on first load */
function seedDataIfEmpty() {
  if (getCars().length > 0) return;

  /* ── Seed sellers ─────────────────────────────── */
  const seedSellers = [
    { id: 'USEED1', userId: 'amitk01',   fullName: 'Amit Kumar',   email: 'amit.kumar@example.com',   phone: '+919876543210', city: 'Delhi',     role: 'Seller', password: 'Test@1234', registrationDate: '2023-06-01T10:00:00.000Z' },
    { id: 'USEED2', userId: 'priyas02',  fullName: 'Priya Sharma',  email: 'priya.sharma@example.com',  phone: '+918765432109', city: 'Mumbai',    role: 'Seller', password: 'Test@1234', registrationDate: '2023-08-15T10:00:00.000Z' },
    { id: 'USEED3', userId: 'rajeshs03', fullName: 'Rajesh Singh',  email: 'rajesh.singh@example.com',  phone: '+917654321098', city: 'Bangalore', role: 'Seller', password: 'Test@1234', registrationDate: '2023-11-20T10:00:00.000Z' },
  ];
  const existingUsers = getUsers();
  seedSellers.forEach(s => {
    if (!existingUsers.find(u => u.userId === s.userId)) existingUsers.push(s);
  });
  saveUsers(existingUsers);

  /* ── Seed cars ────────────────────────────────── */
  const rawCars = [
    { id:'CAR001', make:'Maruti',     model:'Swift',     year:2021, price:680000,  mileage:28000, fuelType:'Petrol',  transmission:'Manual',    color:'White',  sellerId:'USEED1', status:'available', viewCount:45,  listingDate:'2025-11-10T10:00:00.000Z' },
    { id:'CAR002', make:'Maruti',     model:'Swift',     year:2021, price:720000,  mileage:15000, fuelType:'Petrol',  transmission:'Automatic', color:'Red',    sellerId:'USEED2', status:'available', viewCount:38,  listingDate:'2025-11-22T10:00:00.000Z' },
    { id:'CAR003', make:'Hyundai',    model:'i20',       year:2022, price:950000,  mileage:12000, fuelType:'Petrol',  transmission:'Automatic', color:'Blue',   sellerId:'USEED1', status:'available', viewCount:67,  listingDate:'2025-10-05T10:00:00.000Z' },
    { id:'CAR004', make:'Honda',      model:'City',      year:2020, price:1050000, mileage:32000, fuelType:'Petrol',  transmission:'Automatic', color:'Silver', sellerId:'USEED3', status:'available', viewCount:52,  listingDate:'2025-09-18T10:00:00.000Z' },
    { id:'CAR005', make:'Toyota',     model:'Innova',    year:2019, price:1500000, mileage:65000, fuelType:'Diesel',  transmission:'Manual',    color:'White',  sellerId:'USEED2', status:'available', viewCount:89,  listingDate:'2025-08-30T10:00:00.000Z' },
    { id:'CAR006', make:'Tata',       model:'Nexon',     year:2023, price:1200000, mileage:8000,  fuelType:'Petrol',  transmission:'Manual',    color:'Grey',   sellerId:'USEED1', status:'available', viewCount:34,  listingDate:'2026-01-12T10:00:00.000Z' },
    { id:'CAR007', make:'Hyundai',    model:'Creta',     year:2021, price:1400000, mileage:25000, fuelType:'Diesel',  transmission:'Automatic', color:'Black',  sellerId:'USEED2', status:'sold',      viewCount:112, listingDate:'2025-07-20T10:00:00.000Z' },
    { id:'CAR008', make:'Maruti',     model:'Baleno',    year:2022, price:750000,  mileage:18000, fuelType:'CNG',     transmission:'Manual',    color:'Blue',   sellerId:'USEED3', status:'available', viewCount:29,  listingDate:'2025-12-08T10:00:00.000Z' },
    { id:'CAR009', make:'Mahindra',   model:'XUV700',    year:2023, price:1800000, mileage:5000,  fuelType:'Diesel',  transmission:'Automatic', color:'Red',    sellerId:'USEED1', status:'available', viewCount:78,  listingDate:'2026-02-15T10:00:00.000Z' },
    { id:'CAR010', make:'Kia',        model:'Seltos',    year:2022, price:1350000, mileage:22000, fuelType:'Petrol',  transmission:'Automatic', color:'White',  sellerId:'USEED2', status:'available', viewCount:56,  listingDate:'2025-11-30T10:00:00.000Z' },
    /* CAR011: Hyundai i20 2022 priced 63% below avg (CAR003=950k) → fraud flag */
    { id:'CAR011', make:'Hyundai',    model:'i20',       year:2022, price:350000,  mileage:9000,  fuelType:'Petrol',  transmission:'Manual',    color:'Silver', sellerId:'USEED3', status:'available', viewCount:23,  listingDate:'2026-03-01T10:00:00.000Z' },
    { id:'CAR012', make:'Ford',       model:'EcoSport',  year:2019, price:550000,  mileage:55000, fuelType:'Petrol',  transmission:'Manual',    color:'Black',  sellerId:'USEED1', status:'available', viewCount:41,  listingDate:'2025-10-20T10:00:00.000Z' },
    { id:'CAR013', make:'Maruti',     model:'Swift',     year:2021, price:650000,  mileage:35000, fuelType:'Diesel',  transmission:'Manual',    color:'Grey',   sellerId:'USEED2', status:'available', viewCount:31,  listingDate:'2025-09-05T10:00:00.000Z' },
    { id:'CAR014', make:'Tata',       model:'Tiago',     year:2022, price:580000,  mileage:15000, fuelType:'Petrol',  transmission:'Manual',    color:'White',  sellerId:'USEED3', status:'available', viewCount:19,  listingDate:'2026-01-25T10:00:00.000Z' },
    { id:'CAR015', make:'BMW',        model:'3 Series',  year:2020, price:2800000, mileage:28000, fuelType:'Petrol',  transmission:'Automatic', color:'Black',  sellerId:'USEED1', status:'available', viewCount:92,  listingDate:'2025-08-10T10:00:00.000Z' },
    { id:'CAR016', make:'Maruti',     model:'Wagon R',   year:2015, price:320000,  mileage:95000, fuelType:'CNG',     transmission:'Manual',    color:'White',  sellerId:'USEED2', status:'available', viewCount:14,  listingDate:'2026-02-28T10:00:00.000Z' },
    { id:'CAR017', make:'Mahindra',   model:'Bolero',    year:2018, price:650000,  mileage:78000, fuelType:'Diesel',  transmission:'Manual',    color:'Silver', sellerId:'USEED3', status:'available', viewCount:37,  listingDate:'2025-12-15T10:00:00.000Z' },
    { id:'CAR018', make:'Hyundai',    model:'Venue',     year:2023, price:1100000, mileage:7000,  fuelType:'Petrol',  transmission:'Automatic', color:'Blue',   sellerId:'USEED1', status:'available', viewCount:61,  listingDate:'2026-03-10T10:00:00.000Z' },
    { id:'CAR019', make:'Tata',       model:'Punch',     year:2023, price:950000,  mileage:6000,  fuelType:'Petrol',  transmission:'Manual',    color:'Red',    sellerId:'USEED2', status:'available', viewCount:44,  listingDate:'2026-02-05T10:00:00.000Z' },
    { id:'CAR020', make:'Volkswagen', model:'Polo',      year:2020, price:820000,  mileage:30000, fuelType:'Petrol',  transmission:'Manual',    color:'Grey',   sellerId:'USEED3', status:'available', viewCount:28,  listingDate:'2025-11-18T10:00:00.000Z' },
  ];

  /* Calculate health score and fraud flag for each car */
  rawCars.forEach(car => {
    car.healthScore = calculateHealthScore(car.year, car.mileage);
    car.fraudFlag   = isFraudFlagged(car.price, car.make, car.year, rawCars);
  });

  saveCars(rawCars);

  /* ── Seed reviews ─────────────────────────────── */
  const seedReviews = [
    { id:'REV001', sellerId:'USEED1', buyerId:'UBUY01', rating:5, comment:'Great seller! Car was exactly as described.', reviewDate:'2025-09-20T10:00:00.000Z' },
    { id:'REV002', sellerId:'USEED1', buyerId:'UBUY02', rating:4, comment:'Smooth transaction, very responsive.', reviewDate:'2025-10-05T10:00:00.000Z' },
    { id:'REV003', sellerId:'USEED1', buyerId:'UBUY03', rating:5, comment:'Trusted seller. Highly recommend!', reviewDate:'2025-12-18T10:00:00.000Z' },
    { id:'REV004', sellerId:'USEED2', buyerId:'UBUY04', rating:5, comment:'Very honest about the car condition.', reviewDate:'2025-11-10T10:00:00.000Z' },
    { id:'REV005', sellerId:'USEED2', buyerId:'UBUY05', rating:3, comment:'Decent seller but negotiation was tough.', reviewDate:'2025-12-01T10:00:00.000Z' },
    { id:'REV006', sellerId:'USEED3', buyerId:'UBUY06', rating:4, comment:'Good experience overall.', reviewDate:'2026-01-15T10:00:00.000Z' },
    { id:'REV007', sellerId:'USEED3', buyerId:'UBUY07', rating:4, comment:'Car was in great shape, fair price.', reviewDate:'2026-02-20T10:00:00.000Z' },
  ];
  if (!(JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []).length) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(seedReviews));
  }
}
