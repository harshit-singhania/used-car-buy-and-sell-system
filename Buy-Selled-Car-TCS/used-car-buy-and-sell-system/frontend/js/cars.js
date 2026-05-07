/* Shared localStorage key for car listings */
const CARS_KEY = 'ucm_cars';

/* ─── Storage helpers ─────────────────────────────────── */

function getCars() {
  try {
    return JSON.parse(localStorage.getItem(CARS_KEY)) || [];
  } catch (err) {
    console.error('Failed to read cars from localStorage:', err);
    return [];
  }
}

function saveCars(cars) {
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

function getCarById(carId) {
  return getCars().find(function (car) {
    return String(car.id) === String(carId);
  }) || null;
}

function addCar(car) {
  const cars = getCars();
  cars.push(car);
  saveCars(cars);
  return car;
}

function updateCar(carId, updates) {
  const cars = getCars();

  const updatedCars = cars.map(function (car) {
    if (String(car.id) === String(carId)) {
      return Object.assign({}, car, updates);
    }

    return car;
  });

  saveCars(updatedCars);
}

function deleteCar(carId) {
  const cars = getCars().filter(function (car) {
    return String(car.id) !== String(carId);
  });

  saveCars(cars);
}

function incrementViewCount(carId) {
  const cars = getCars();

  const updatedCars = cars.map(function (car) {
    if (String(car.id) === String(carId)) {
      return Object.assign({}, car, {
        viewCount: Number(car.viewCount || 0) + 1
      });
    }

    return car;
  });

  saveCars(updatedCars);
}

/* ─── Formatting helpers ──────────────────────────────── */

function formatPrice(value) {
  const amount = Number(value || 0);

  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
}

function formatKilometers(value) {
  return Number(value || 0).toLocaleString('en-IN') + ' km';
}

/* ─── Car health score logic ───────────────────────────── */

function calculateHealthScore(year, mileage) {
  const currentYear = new Date().getFullYear();

  const carYear = Number(year);
  const carMileage = Number(mileage);

  if (!carYear || isNaN(carYear) || isNaN(carMileage)) {
    return 0;
  }

  const age = Math.max(0, currentYear - carYear);

  /*
    Project formula:
    score = 100 - (currentYear - carYear) * 3 - (mileage / 10000) * 2
    Score is capped between 0 and 100.
  */

  let score = 100 - (age * 3) - ((carMileage / 10000) * 2);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return score;
}

function getHealthBand(score) {
  const value = Number(score || 0);

  if (value >= 70) {
    return {
      label: 'Excellent',
      cls: 'health-good'
    };
  }

  if (value >= 40) {
    return {
      label: 'Good',
      cls: 'health-average'
    };
  }

  return {
    label: 'Needs Attention',
    cls: 'health-poor'
  };
}

/* ─── Visual helper for car cards/placeholders ────────── */

function makeColor(make) {
  const brand = String(make || '').trim();

  const colors = {
    Maruti: 'linear-gradient(135deg, #f97316, #fb923c)',
    Hyundai: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    Honda: 'linear-gradient(135deg, #dc2626, #f87171)',
    Toyota: 'linear-gradient(135deg, #111827, #64748b)',
    Tata: 'linear-gradient(135deg, #0f766e, #2dd4bf)',
    Mahindra: 'linear-gradient(135deg, #7c2d12, #fb923c)',
    Kia: 'linear-gradient(135deg, #be123c, #fb7185)',
    Ford: 'linear-gradient(135deg, #1d4ed8, #38bdf8)',
    Volkswagen: 'linear-gradient(135deg, #334155, #94a3b8)',
    BMW: 'linear-gradient(135deg, #020617, #2563eb)',
    Others: 'linear-gradient(135deg, #475569, #94a3b8)'
  };

  return colors[brand] || 'linear-gradient(135deg, #1a2e4a, #2d4a73)';
}

/* ─── Optional buyer/seller helpers ───────────────────── */

function getAvailableCars() {
  return getCars().filter(function (car) {
    return String(car.status || 'available').toLowerCase() === 'available';
  });
}

function getCarsBySeller(sellerId) {
  return getCars().filter(function (car) {
    return String(car.sellerId) === String(sellerId);
  });
}

function markCarSold(carId) {
  updateCar(carId, {
    status: 'sold'
  });
}

function markCarAvailable(carId) {
  updateCar(carId, {
    status: 'available'
  });
}

/* ─── Safe demo data helper ───────────────────────────── */

function seedCarsIfEmpty() {
  const existingCars = getCars();

  if (existingCars.length > 0) {
    return;
  }

  const demoCars = [
    {
      id: 'CAR1001',
      make: 'Maruti',
      model: 'Swift VXI',
      year: 2021,
      price: 560000,
      mileage: 28000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      color: 'White',
      sellerId: 'SELLER_DEMO_1',
      status: 'available',
      viewCount: 18,
      listingDate: '2026-04-20T10:00:00.000Z',
      healthScore: calculateHealthScore(2021, 28000),
    },
    {
      id: 'CAR1002',
      make: 'Hyundai',
      model: 'Creta SX',
      year: 2020,
      price: 980000,
      mileage: 42000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      color: 'Black',
      sellerId: 'SELLER_DEMO_2',
      status: 'available',
      viewCount: 34,
      listingDate: '2026-04-24T12:30:00.000Z',
      healthScore: calculateHealthScore(2020, 42000),
    },
    {
      id: 'CAR1003',
      make: 'Honda',
      model: 'City ZX',
      year: 2019,
      price: 820000,
      mileage: 55000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Silver',
      sellerId: 'SELLER_DEMO_3',
      status: 'available',
      viewCount: 27,
      listingDate: '2026-04-26T09:15:00.000Z',
      healthScore: calculateHealthScore(2019, 55000),
    },
    {
      id: 'CAR1004',
      make: 'Tata',
      model: 'Nexon XZ+',
      year: 2022,
      price: 875000,
      mileage: 21000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      color: 'Blue',
      sellerId: 'SELLER_DEMO_4',
      status: 'available',
      viewCount: 41,
      listingDate: '2026-04-28T14:45:00.000Z',
      healthScore: calculateHealthScore(2022, 21000),
    },
    {
      id: 'CAR1005',
      make: 'Toyota',
      model: 'Innova Crysta',
      year: 2018,
      price: 1425000,
      mileage: 78000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      color: 'Grey',
      sellerId: 'SELLER_DEMO_5',
      status: 'available',
      viewCount: 63,
      listingDate: '2026-04-29T08:20:00.000Z',
      healthScore: calculateHealthScore(2018, 78000),
    },
    {
      id: 'CAR1006',
      make: 'Kia',
      model: 'Seltos HTX',
      year: 2021,
      price: 1180000,
      mileage: 36000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Red',
      sellerId: 'SELLER_DEMO_6',
      status: 'available',
      viewCount: 52,
      listingDate: '2026-05-01T11:10:00.000Z',
      healthScore: calculateHealthScore(2021, 36000),
    }
  ];

  saveCars(demoCars);
}
