export const TERMINALS = {
  cogon: {
    id: 'cogon',
    name: 'Cogon Public Market',
    short: 'Cogon',
    color: '#3b82f6',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    description: 'Main city terminal — most jeepney routes end here.',
  },
  carmen: {
    id: 'carmen',
    name: 'Carmen Public Market',
    short: 'Carmen',
    color: '#10b981',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    description: 'Terminal serving western and southern CDO routes.',
  },
  limketkai: {
    id: 'limketkai',
    name: 'Limketkai Drive',
    short: 'Limketkai',
    color: '#8b5cf6',
    bg: 'bg-violet-500/20',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    description: 'Terminal near Limketkai Mall and SM City.',
  },
  gaisano: {
    id: 'gaisano',
    name: 'Gaisano City',
    short: 'Gaisano',
    color: '#f59e0b',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    description: 'Terminal at Gaisano City Mall.',
  },
  wbtpm: {
    id: 'wbtpm',
    name: 'West Bound Terminal (WBTPM)',
    short: 'WBTPM',
    color: '#ef4444',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    description: 'West-bound public market terminal.',
  },
  agora: {
    id: 'agora',
    name: 'Agora Market City & Terminal',
    short: 'Agora',
    color: '#06b6d4',
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    description: 'Agora market terminal area.',
  },
};

export const routes = [
  // ─── BAIKINGON ───────────────────────────────────────────────────────────────
  {
    id: 1,
    routeNumber: '01',
    name: 'Baikingon',
    group: null,
    variantCode: null,
    displayCode: 'BAI',
    origin: 'Baikingon',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Baikingon', 'San Simon', 'Pagalungan', 'Carmen'],
    tip: 'Board near the Baikingon barangay hall or along the main road.',
  },

  // ─── BALONGIS ────────────────────────────────────────────────────────────────
  {
    id: 2,
    routeNumber: '02',
    name: 'Balongis',
    group: null,
    variantCode: null,
    displayCode: 'BAL',
    origin: 'Balongis',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Balongis', 'Carmen', 'Cogon'],
    tip: 'Boards at Balongis and passes through Carmen area.',
  },

  // ─── BALULANG ────────────────────────────────────────────────────────────────
  {
    id: 3,
    routeNumber: '03',
    name: 'Balulang',
    group: null,
    variantCode: null,
    displayCode: 'BLG',
    origin: 'Balulang',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Balulang', 'Macasandig', 'Cogon'],
    tip: 'Passes through Macasandig area heading to Cogon.',
  },

  // ─── BAYABAS ─────────────────────────────────────────────────────────────────
  {
    id: 4,
    routeNumber: '04',
    name: 'Bayabas RA',
    group: 'Bayabas',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'Bayabas',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bayabas', 'Kauswagan', 'Bulua', 'Cogon'],
    tip: 'Route A variant — check the jeepney sign for "BAYABAS RA".',
  },
  {
    id: 5,
    routeNumber: '05',
    name: 'Bayabas RB',
    group: 'Bayabas',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'Bayabas',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bayabas', 'Kauswagan', 'Cogon'],
    tip: 'Route B variant — slightly different path than RA.',
  },

  // ─── BONBON ──────────────────────────────────────────────────────────────────
  {
    id: 6,
    routeNumber: '06',
    name: 'Bonbon RA',
    group: 'Bonbon',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'Bonbon',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bonbon', 'Macabalan', 'Puntod', 'Cogon'],
    tip: 'Passes through the port/pier area near Macabalan.',
  },
  {
    id: 7,
    routeNumber: '07',
    name: 'Bonbon RB',
    group: 'Bonbon',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'Bonbon',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bonbon', 'Puntod', 'Cogon'],
    tip: 'Route B takes a different path from Bonbon to Cogon.',
  },

  // ─── BUENA ORO ───────────────────────────────────────────────────────────────
  {
    id: 8,
    routeNumber: '08',
    name: 'Buena Oro',
    group: null,
    variantCode: null,
    displayCode: 'BUE',
    origin: 'Buena Oro',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Buena Oro', 'Cogon'],
    tip: 'Boards from Buena Oro subdivision heading downtown.',
  },

  // ─── BUGO ────────────────────────────────────────────────────────────────────
  {
    id: 9,
    routeNumber: '09',
    name: 'Bugo',
    group: null,
    variantCode: null,
    displayCode: 'BGO',
    origin: 'Bugo',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bugo', 'Puerto', 'Agusan', 'Lapasan', 'Cogon'],
    tip: 'Long route from eastern CDO passing through Puerto and Agusan.',
  },

  // ─── BULUA ───────────────────────────────────────────────────────────────────
  {
    id: 10,
    routeNumber: '10',
    name: 'Bulua B1',
    group: 'Bulua',
    variantCode: 'B1',
    displayCode: 'B1',
    origin: 'Bulua',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bulua', 'Kauswagan', 'Cogon'],
    tip: 'B1 takes the main road through Kauswagan.',
  },
  {
    id: 11,
    routeNumber: '11',
    name: 'Bulua B2',
    group: 'Bulua',
    variantCode: 'B2',
    displayCode: 'B2',
    origin: 'Bulua',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Bulua', 'Consolacion', 'Cogon'],
    tip: 'B2 passes through the Consolacion area.',
  },
  {
    id: 12,
    routeNumber: '12',
    name: 'Bulua B3',
    group: 'Bulua',
    variantCode: 'B3',
    displayCode: 'B3',
    origin: 'Bulua',
    destination: 'Limketkai Drive',
    terminal: 'limketkai',
    areas: ['Bulua', 'Limketkai', 'SM City'],
    tip: 'B3 goes to Limketkai Mall area — great for shopping trips!',
  },

  // ─── CALAANAN ────────────────────────────────────────────────────────────────
  {
    id: 13,
    routeNumber: '13',
    name: 'Calaanan',
    group: null,
    variantCode: null,
    displayCode: 'CAL',
    origin: 'Calaanan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Calaanan', 'Carmen', 'Cogon'],
    tip: 'Passes through Carmen area heading to Cogon.',
  },

  // ─── CAMAMAN-AN ──────────────────────────────────────────────────────────────
  {
    id: 14,
    routeNumber: '14',
    name: 'Camaman-an',
    group: null,
    variantCode: null,
    displayCode: 'CAM',
    origin: 'Camaman-an',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Camaman-an', 'Macasandig', 'Gusa', 'Cogon'],
    tip: 'Passes through Gusa and Macasandig.',
  },

  // ─── CAMP EVANGELISTA ────────────────────────────────────────────────────────
  {
    id: 15,
    routeNumber: '15',
    name: 'Camp Evangelista C1',
    group: 'Camp Evangelista',
    variantCode: 'C1',
    displayCode: 'C1',
    origin: 'Camp Evangelista',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Camp Evangelista', 'Patag', 'Nazareth', 'Cogon'],
    tip: 'C1 is the most common Camp Evangelista route.',
  },
  {
    id: 16,
    routeNumber: '16',
    name: 'Camp Evangelista C2',
    group: 'Camp Evangelista',
    variantCode: 'C2',
    displayCode: 'C2',
    origin: 'Camp Evangelista',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Camp Evangelista', 'Patag', 'Carmen', 'Cogon'],
    tip: 'C2 takes a different route through Carmen.',
  },

  // ─── CANITOAN ────────────────────────────────────────────────────────────────
  {
    id: 17,
    routeNumber: '17',
    name: 'Canitoan',
    group: null,
    variantCode: null,
    displayCode: 'CNT',
    origin: 'Canitoan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Canitoan', 'Carmen', 'Cogon'],
    tip: 'Boards near Canitoan public school area.',
  },

  // ─── CARMEN ──────────────────────────────────────────────────────────────────
  {
    id: 18,
    routeNumber: '18',
    name: 'Carmen R1',
    group: 'Carmen',
    variantCode: 'R1',
    displayCode: 'R1',
    origin: 'Carmen',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Carmen', 'Nazareth', 'Poblacion', 'Cogon'],
    tip: 'R1 passes through the main Carmen-Cogon road.',
  },
  {
    id: 19,
    routeNumber: '19',
    name: 'Carmen R2',
    group: 'Carmen',
    variantCode: 'R2',
    displayCode: 'R2',
    origin: 'Carmen',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Carmen', 'Poblacion', 'Cogon'],
    tip: 'R2 takes a slightly different path from Carmen.',
  },

  // ─── DANSOLIHON ──────────────────────────────────────────────────────────────
  {
    id: 20,
    routeNumber: '20',
    name: 'Dansolihon',
    group: null,
    variantCode: null,
    displayCode: 'DAN',
    origin: 'Dansolihon',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Dansolihon', 'Canitoan', 'Carmen'],
    tip: 'Heads to Carmen terminal from Dansolihon.',
  },

  // ─── FS CATANICO ─────────────────────────────────────────────────────────────
  {
    id: 21,
    routeNumber: '21',
    name: 'FS Catanico',
    group: null,
    variantCode: null,
    displayCode: 'FSC',
    origin: 'FS Catanico',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['FS Catanico', 'Gusa', 'Cogon'],
    tip: 'Board near FS Catanico junction heading to Cogon.',
  },

  // ─── GRAN EUROPA ─────────────────────────────────────────────────────────────
  {
    id: 22,
    routeNumber: '22',
    name: 'Gran Europa',
    group: null,
    variantCode: null,
    displayCode: 'GEU',
    origin: 'Gran Europa',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Gran Europa', 'Camaman-an', 'Cogon'],
    tip: 'Passes through Camaman-an subdivision area.',
  },

  // ─── GUSA ────────────────────────────────────────────────────────────────────
  {
    id: 23,
    routeNumber: '23',
    name: 'Gusa RC',
    group: 'Gusa',
    variantCode: 'RC',
    displayCode: 'RC',
    origin: 'Gusa',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Gusa', 'Camaman-an', 'Cogon'],
    tip: 'RC variant serves one side of Gusa area.',
  },
  {
    id: 24,
    routeNumber: '24',
    name: 'Gusa RD',
    group: 'Gusa',
    variantCode: 'RD',
    displayCode: 'RD',
    origin: 'Gusa',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Gusa', 'FS Catanico', 'Cogon'],
    tip: 'RD variant covers the other side of Gusa.',
  },

  // ─── INDAHAG ─────────────────────────────────────────────────────────────────
  {
    id: 25,
    routeNumber: '25',
    name: 'Indahag',
    group: null,
    variantCode: null,
    displayCode: 'IND',
    origin: 'Indahag',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Indahag', 'Macasandig', 'Cogon'],
    tip: 'Boards along the Indahag road heading to Cogon.',
  },

  // ─── IPONAN ──────────────────────────────────────────────────────────────────
  {
    id: 26,
    routeNumber: '26',
    name: 'Iponan Centro',
    group: 'Iponan',
    variantCode: 'Centro',
    displayCode: 'CTR',
    origin: 'Iponan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Iponan', 'Patab', 'Cogon'],
    tip: 'Centro route goes through the main Iponan area.',
  },
  {
    id: 27,
    routeNumber: '27',
    name: 'Iponan Kinsanghan',
    group: 'Iponan',
    variantCode: 'Kinsanghan',
    displayCode: 'KIN',
    origin: 'Iponan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Iponan', 'Kinsanghan', 'Patab', 'Cogon'],
    tip: 'Kinsanghan variant goes through the deeper part of Iponan.',
  },

  // ─── KAUSWAGAN ───────────────────────────────────────────────────────────────
  {
    id: 28,
    routeNumber: '28',
    name: 'Kauswagan RA',
    group: 'Kauswagan',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'Kauswagan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Kauswagan', 'Bulua', 'Consolacion', 'Cogon'],
    tip: 'RA passes through the Bulua highway.',
  },
  {
    id: 29,
    routeNumber: '29',
    name: 'Kauswagan RB',
    group: 'Kauswagan',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'Kauswagan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Kauswagan', 'Consolacion', 'Cogon'],
    tip: 'RB takes the inner Kauswagan road.',
  },

  // ─── KISANLU ─────────────────────────────────────────────────────────────────
  {
    id: 30,
    routeNumber: '28K',
    name: 'Kisanlu',
    group: null,
    variantCode: null,
    displayCode: 'KSL',
    origin: 'Kisanlu',
    destination: 'Gaisano City',
    terminal: 'gaisano',
    areas: ['Kisanlu', 'Carmen', 'Gaisano City'],
    tip: 'Goes directly to Gaisano City — great for shopping.',
  },

  // ─── LAPASAN ─────────────────────────────────────────────────────────────────
  {
    id: 31,
    routeNumber: '29A',
    name: 'Lapasan LA',
    group: 'Lapasan',
    variantCode: 'LA',
    displayCode: 'LA',
    origin: 'Lapasan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Lapasan', 'Consolacion', 'Cogon'],
    tip: 'LA variant boards from the main Lapasan road.',
  },
  {
    id: 32,
    routeNumber: '29B',
    name: 'Lapasan LB',
    group: 'Lapasan',
    variantCode: 'LB',
    displayCode: 'LB',
    origin: 'Lapasan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Lapasan', 'Nazareth', 'Cogon'],
    tip: 'LB takes the inner Lapasan road.',
  },

  // ─── LUMBIA ──────────────────────────────────────────────────────────────────
  {
    id: 33,
    routeNumber: '30',
    name: 'Lumbia R1',
    group: 'Lumbia',
    variantCode: 'R1',
    displayCode: 'R1',
    origin: 'Lumbia',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Lumbia', 'Patag', 'Carmen'],
    tip: 'R1 heads to Carmen terminal — near the airport.',
  },
  {
    id: 34,
    routeNumber: '31',
    name: 'Lumbia R2',
    group: 'Lumbia',
    variantCode: 'R2',
    displayCode: 'R2',
    origin: 'Lumbia',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Lumbia', 'Nazareth', 'Cogon'],
    tip: 'R2 goes all the way to Cogon terminal.',
  },

  // ─── MACANHAN ────────────────────────────────────────────────────────────────
  {
    id: 35,
    routeNumber: '32',
    name: 'Macanhan',
    group: null,
    variantCode: null,
    displayCode: 'MAC',
    origin: 'Macanhan',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Macanhan', 'Camaman-an', 'Cogon'],
    tip: 'Passes through Camaman-an junction.',
  },

  // ─── MINDANAO HOMES ──────────────────────────────────────────────────────────
  {
    id: 36,
    routeNumber: '33',
    name: 'Mindanao Homes',
    group: null,
    variantCode: null,
    displayCode: 'MDH',
    origin: 'Mindanao Homes',
    destination: 'WBTPM',
    terminal: 'wbtpm',
    areas: ['Mindanao Homes', 'WBTPM'],
    tip: 'Goes to the West Bound Terminal — useful for connecting to west-side routes.',
  },

  // ─── NHA ─────────────────────────────────────────────────────────────────────
  {
    id: 37,
    routeNumber: '34',
    name: 'NHA RA',
    group: 'NHA',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'NHA',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['NHA', 'Indahag', 'Macasandig', 'Cogon'],
    tip: 'NHA RA boards from the National Housing Authority area.',
  },
  {
    id: 38,
    routeNumber: '35',
    name: 'NHA RB',
    group: 'NHA',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'NHA',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['NHA', 'Indahag', 'Cogon'],
    tip: 'NHA RB takes the alternate NHA road.',
  },

  // ─── PAGATPAT ────────────────────────────────────────────────────────────────
  {
    id: 39,
    routeNumber: '36',
    name: 'Pagatpat (Carmen)',
    group: 'Pagatpat',
    variantCode: 'Carmen',
    displayCode: 'CPM',
    origin: 'Pagatpat',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Pagatpat', 'Pabatpat', 'Carmen'],
    tip: 'This variant goes to Carmen terminal.',
  },
  {
    id: 40,
    routeNumber: '37',
    name: 'Pagatpat (Cogon)',
    group: 'Pagatpat',
    variantCode: 'Cogon',
    displayCode: 'CGN',
    origin: 'Pagatpat',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Pagatpat', 'Pabatpat', 'Cogon'],
    tip: 'This variant goes all the way to Cogon.',
  },

  // ─── PATAG ───────────────────────────────────────────────────────────────────
  {
    id: 41,
    routeNumber: '38',
    name: 'Patag (WBTPM)',
    group: null,
    variantCode: 'WBTPM',
    displayCode: 'PTG',
    origin: 'Patag',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Patag', 'Nazareth', 'WBTPM', 'Cogon'],
    tip: 'Passes through WBTPM area before reaching Cogon.',
  },

  // ─── PIER ────────────────────────────────────────────────────────────────────
  {
    id: 42,
    routeNumber: '39',
    name: 'Pier RA',
    group: 'Pier',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'Pier',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Pier', 'Macabalan', 'Puntod', 'Consolacion', 'Cogon'],
    tip: 'Useful if you arrive at the CDO seaport.',
  },
  {
    id: 43,
    routeNumber: '40',
    name: 'Pier RB',
    group: 'Pier',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'Pier',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Pier', 'Puntod', 'Cogon'],
    tip: 'RB takes a slightly different path from the pier.',
  },
  {
    id: 44,
    routeNumber: '41',
    name: 'Pier RBC',
    group: 'Pier',
    variantCode: 'RBC',
    displayCode: 'RBC',
    origin: 'Pier',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Pier', 'Bonbon', 'Puntod', 'Cogon'],
    tip: 'RBC covers Bonbon area before going to Cogon.',
  },

  // ─── REGENCY ─────────────────────────────────────────────────────────────────
  {
    id: 45,
    routeNumber: '42',
    name: 'Regency',
    group: null,
    variantCode: null,
    displayCode: 'REG',
    origin: 'Regency',
    destination: 'Gaisano City',
    terminal: 'gaisano',
    areas: ['Regency', 'Carmen', 'Gaisano City'],
    tip: 'Goes to Gaisano City from the Regency area.',
  },

  // ─── SAN AGUSTIN ─────────────────────────────────────────────────────────────
  {
    id: 46,
    routeNumber: '43',
    name: 'San Agustin',
    group: null,
    variantCode: null,
    displayCode: 'SAG',
    origin: 'San Agustin',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['San Agustin', 'Carmen', 'Cogon'],
    tip: 'Passes through Carmen on the way to Cogon.',
  },

  // ─── SAN SIMON ───────────────────────────────────────────────────────────────
  {
    id: 47,
    routeNumber: '44',
    name: 'San Simon',
    group: null,
    variantCode: null,
    displayCode: 'SSM',
    origin: 'San Simon',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['San Simon', 'Pagalungan', 'Carmen'],
    tip: 'Board along the San Simon road toward Carmen.',
  },

  // ─── SILVER CREEK ────────────────────────────────────────────────────────────
  {
    id: 48,
    routeNumber: '45',
    name: 'Silver Creek',
    group: null,
    variantCode: null,
    displayCode: 'SLC',
    origin: 'Silver Creek',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Silver Creek', 'Macasandig', 'Cogon'],
    tip: 'Passes through Macasandig heading to Cogon.',
  },

  // ─── SM ──────────────────────────────────────────────────────────────────────
  {
    id: 49,
    routeNumber: '46',
    name: 'SM RA',
    group: 'SM',
    variantCode: 'RA',
    displayCode: 'RA',
    origin: 'SM',
    destination: 'Limketkai Drive',
    terminal: 'limketkai',
    areas: ['SM City', 'Limketkai', 'Lapasan', 'Cogon'],
    tip: 'RA route — goes to Limketkai Drive near SM City.',
  },
  {
    id: 50,
    routeNumber: '47',
    name: 'SM RB',
    group: 'SM',
    variantCode: 'RB',
    displayCode: 'RB',
    origin: 'SM',
    destination: 'Limketkai Drive',
    terminal: 'limketkai',
    areas: ['SM City', 'Limketkai', 'Cogon'],
    tip: 'RB route — alternate path to Limketkai Drive.',
  },

  // ─── TAGPANGI ────────────────────────────────────────────────────────────────
  {
    id: 51,
    routeNumber: '48',
    name: 'Tagpangi',
    group: null,
    variantCode: null,
    displayCode: 'TAG',
    origin: 'Tagpangi',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Tagpangi', 'Pagatpat', 'Carmen'],
    tip: 'From Tagpangi heading to Carmen terminal.',
  },

  // ─── TAGUANAO ────────────────────────────────────────────────────────────────
  {
    id: 52,
    routeNumber: '49',
    name: 'Taguanao',
    group: null,
    variantCode: null,
    displayCode: 'TGN',
    origin: 'Taguanao',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Taguanao', 'Macasandig', 'Cogon'],
    tip: 'Boards near Taguanao area heading to Cogon.',
  },

  // ─── TERRY HILLS ─────────────────────────────────────────────────────────────
  {
    id: 53,
    routeNumber: '50',
    name: 'Terry Hills',
    group: null,
    variantCode: null,
    displayCode: 'TRH',
    origin: 'Terry Hills',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Terry Hills', 'Camaman-an', 'Cogon'],
    tip: 'Passes through Camaman-an area.',
  },

  // ─── TIGNAPOLOAN ─────────────────────────────────────────────────────────────
  {
    id: 54,
    routeNumber: '51',
    name: 'Tignapoloan',
    group: null,
    variantCode: null,
    displayCode: 'TIG',
    origin: 'Tignapoloan',
    destination: 'Carmen Public Market',
    terminal: 'carmen',
    areas: ['Tignapoloan', 'Canitoan', 'Carmen'],
    tip: 'Heads from Tignapoloan to Carmen terminal.',
  },

  // ─── TUMPAGON ────────────────────────────────────────────────────────────────
  {
    id: 55,
    routeNumber: '52',
    name: 'Tumpagon',
    group: null,
    variantCode: null,
    displayCode: 'TMP',
    origin: 'Tumpagon',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Tumpagon', 'Carmen', 'Cogon'],
    tip: 'Passes through Carmen on the way to Cogon.',
  },

  // ─── ZONE 10 ─────────────────────────────────────────────────────────────────
  {
    id: 56,
    routeNumber: '53',
    name: 'Zone 10 (Upper Carmen)',
    group: null,
    variantCode: null,
    displayCode: 'Z10',
    origin: 'Zone 10',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Zone 10', 'Upper Carmen', 'Carmen', 'Cogon'],
    tip: 'From the uphill Zone 10 / Upper Carmen area.',
  },

  // ─── WBTPM – AGORA ───────────────────────────────────────────────────────────
  {
    id: 57,
    routeNumber: '54',
    name: 'WBTPM',
    group: null,
    variantCode: null,
    displayCode: 'WBT',
    origin: 'WBTPM',
    destination: 'Agora Market City & Terminal',
    terminal: 'agora',
    areas: ['WBTPM', 'Poblacion', 'Agora'],
    tip: 'Connects WBTPM to the Agora terminal.',
  },

  // ─── XAVIER HEIGHTS ──────────────────────────────────────────────────────────
  {
    id: 58,
    routeNumber: '55',
    name: 'Xavier Heights',
    group: null,
    variantCode: null,
    displayCode: 'XHT',
    origin: 'Xavier Heights',
    destination: 'Cogon Public Market',
    terminal: 'cogon',
    areas: ['Xavier Heights', 'Iponan', 'Cogon'],
    tip: 'From Xavier Heights subdivision to Cogon.',
  },
];

export const routeGroups = routes.reduce((acc, route) => {
  const key = route.group || route.name;
  if (!acc[key]) acc[key] = [];
  acc[key].push(route);
  return acc;
}, {});

export const allAreas = [...new Set(routes.flatMap((r) => r.areas))].sort();

export function searchRoutes(query) {
  if (!query.trim()) return routes;
  const q = query.toLowerCase();
  return routes.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.areas.some((a) => a.toLowerCase().includes(q)) ||
      (r.variantCode && r.variantCode.toLowerCase().includes(q)) ||
      r.displayCode.toLowerCase().includes(q)
  );
}

export function findRoutesByDestination(destination) {
  const q = destination.toLowerCase();
  return routes.filter(
    (r) =>
      r.destination.toLowerCase().includes(q) ||
      r.terminal.toLowerCase().includes(q) ||
      r.areas.some((a) => a.toLowerCase().includes(q))
  );
}

export function findRoutesByOrigin(origin) {
  const q = origin.toLowerCase();
  return routes.filter(
    (r) =>
      r.origin.toLowerCase().includes(q) ||
      r.areas.some((a) => a.toLowerCase().includes(q))
  );
}
