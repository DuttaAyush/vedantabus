// Static list of operational cities for VedantaBus trips and routes
// Sourced from current active routes & procedural trip schedules

export const OPERATIONAL_CITIES = [
  {
    city: 'Nagpur',
    state: 'Maharashtra',
    tag: 'Fleet HQ • Samruddhi Corridor',
    popular: true,
    connectsTo: ['Pune', 'Mumbai'],
    boardingPoints: ['Dharampeth', 'Chatrapati Square', 'Ganeshpeth Bus Stand', 'Shriram Tower Kingsway'],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    tag: 'Express Transit Hub',
    popular: true,
    connectsTo: ['Nagpur', 'Mumbai', 'Goa', 'Shirdi', 'Delhi', 'Indore'],
    boardingPoints: ['Swargate', 'Wakad Flyover', 'Shivajinagar', 'Hinjewadi Phase 1'],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    tag: 'Borivali & Dadar Terminals',
    popular: true,
    connectsTo: ['Pune', 'Goa', 'Shirdi', 'Nagpur'],
    boardingPoints: ['Borivali East', 'Dadar TT Circle', 'Sion Chunabhatti', 'Vashi Toll Plaza'],
  },
  {
    city: 'Delhi',
    state: 'NCR',
    tag: 'Kashmere Gate & Majnu Ka Tilla',
    popular: true,
    connectsTo: ['Haridwar', 'Jaipur', 'Pune'],
    boardingPoints: ['Kashmere Gate ISBT', 'Majnu Ka Tilla', 'Dhaula Kuan', 'Anand Vihar'],
  },
  {
    city: 'Haridwar',
    state: 'Uttarakhand',
    tag: 'Ganga Ghat • Devsthan Special',
    popular: true,
    connectsTo: ['Delhi'],
    boardingPoints: ['Har Ki Pauri', 'Bus Stand Haridwar', 'Rishikesh Bypass'],
  },
  {
    city: 'Goa',
    state: 'Goa',
    tag: 'Panjim, Mapusa & Calangute',
    popular: true,
    connectsTo: ['Mumbai', 'Pune'],
    boardingPoints: ['Panjim KTC Bus Stand', 'Mapusa Bus Stand', 'Calangute Circle', 'Margao'],
  },
  {
    city: 'Shirdi',
    state: 'Maharashtra',
    tag: 'Sai Mandir Gate No. 2',
    popular: true,
    connectsTo: ['Pune', 'Mumbai'],
    boardingPoints: ['Temple Gate No. 2', 'Shirdi Nagar Panchayat', 'Hotel Sun-n-Sand'],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    tag: 'Majestic & Electronic City',
    popular: true,
    connectsTo: ['Hyderabad'],
    boardingPoints: ['Majestic Bus Stand', 'Anand Rao Circle', 'Silk Board', 'Hebbal Flyover'],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    tag: 'MGBS & Ameerpet Tech Corridor',
    popular: true,
    connectsTo: ['Bengaluru'],
    boardingPoints: ['MGBS Central Bus Station', 'Ameerpet', 'Kukatpally', 'Shamshabad'],
  },
  {
    city: 'Indore',
    state: 'Madhya Pradesh',
    tag: 'Vijay Nagar & AICTSL Hub',
    popular: true,
    connectsTo: ['Pune'],
    boardingPoints: ['Vijay Nagar', 'Sarwate Bus Stand', 'Navlakha Square', 'Rau Bypass'],
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    tag: 'Sindhi Camp & 200 Ft Bypass',
    popular: true,
    connectsTo: ['Delhi'],
    boardingPoints: ['Sindhi Camp Bus Stand', '200 Feet Bypass Ajmer Road', 'Narayan Singh Circle'],
  },
  {
    city: 'Nashik',
    state: 'Maharashtra',
    tag: 'Dwarka Circle • Panchavati',
    popular: false,
    connectsTo: ['Pune', 'Mumbai', 'Indore', 'Shirdi'],
    boardingPoints: ['Dwarka Circle', 'Mumbai Naka', 'Panchavati'],
  },
  {
    city: 'Amravati',
    state: 'Maharashtra',
    tag: 'Samruddhi Mahamarg Node',
    popular: false,
    connectsTo: ['Nagpur', 'Pune'],
    boardingPoints: ['Panchavati Square', 'Badnera Road'],
  },
  {
    city: 'Wardha',
    state: 'Maharashtra',
    tag: 'Sevagram Junction',
    popular: false,
    connectsTo: ['Nagpur', 'Pune'],
    boardingPoints: ['Sevagram Road', 'Bajaj Chowk'],
  },
];

/**
 * Clean a city query string (remove state, commas, extra whitespace)
 */
export function normalizeCityQuery(val) {
  if (!val) return '';
  return val
    .replace(/,\s*[a-zA-Z\s]+$/g, '') // remove trailing ", MH", ", Maharashtra"
    .trim()
    .toLowerCase();
}

/**
 * Filter operational cities based on query and optional source city
 */
export function getFilteredCities(query = '', sourceCity = '') {
  const cleanQuery = normalizeCityQuery(query);
  const cleanSource = normalizeCityQuery(sourceCity);

  // If a source city is provided, find its known direct destinations
  let directDestinations = [];
  if (cleanSource) {
    const srcObj = OPERATIONAL_CITIES.find(
      (c) => c.city.toLowerCase() === cleanSource
    );
    if (srcObj && Array.isArray(srcObj.connectsTo)) {
      directDestinations = srcObj.connectsTo.map((d) => d.toLowerCase());
    }
  }

  // Filter list
  let results = OPERATIONAL_CITIES;

  if (cleanQuery) {
    results = OPERATIONAL_CITIES.filter((item) => {
      const cityName = item.city.toLowerCase();
      const stateName = item.state.toLowerCase();
      const tag = (item.tag || '').toLowerCase();
      const points = (item.boardingPoints || []).join(' ').toLowerCase();

      return (
        cityName.includes(cleanQuery) ||
        stateName.includes(cleanQuery) ||
        tag.includes(cleanQuery) ||
        points.includes(cleanQuery)
      );
    });
  }

  // Sort: direct destinations from current source first, then popular, then alphabetic
  return [...results].sort((a, b) => {
    const aIsDirect = directDestinations.includes(a.city.toLowerCase());
    const bIsDirect = directDestinations.includes(b.city.toLowerCase());

    if (aIsDirect && !bIsDirect) return -1;
    if (!aIsDirect && bIsDirect) return 1;

    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;

    return a.city.localeCompare(b.city);
  });
}
