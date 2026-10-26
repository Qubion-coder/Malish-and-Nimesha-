// Single source of truth for all wedding details shown on the invitation and admin page.

export const WEDDING = {
  groomName: 'Malish',
  brideName: 'Nimesha',

  verse: "I hold you in my heart, for we have shared together God's blessing",
  verseRef: 'Philippians 1:7',

  hostParents: 'Mr. & Mrs. Krishantha Batepola',
  coHostParents: 'Mr. & Mrs. Neil Perera',

  // ISO date used by the countdown (start of Holy Matrimony)
  dateISO: '2026-12-12T16:00:00',
  dateLong: 'Saturday, 12 December 2026',
  dateShort: '12 . 12 . 2026',
  dayMonth: 'Saturday, December 12',
  yearWords: 'The Year Two Thousand Twenty Six',
  monthYear: 'December 2026',

  ceremony: {
    title: 'Holy Matrimony',
    venue: "St. Joseph's Church",
    area: 'Gonawila',
    time: 'From 4.00 pm onwards',
    timeShort: '4:00 PM',
    mapLink: 'https://maps.app.goo.gl/zAi9D9C26tEYJS3q7',
    mapEmbedQuery: "St. Joseph's Church, Gonawila, Sri Lanka",
  },

  reception: {
    title: 'Reception',
    venue: 'Moonlight, Orilla Hotel',
    area: 'Nainamadama',
    time: 'At 7.00 pm',
    timeShort: '7:00 PM',
    mapLink: 'https://maps.app.goo.gl/dbDs2rnj48f98ux6A',
    mapEmbedQuery: 'Orilla Hotel, Nainamadama, Sri Lanka',
  },

  rsvp: {
    deadline: '28.11.2026',
    contactName: 'Krishantha',
    contactPhone: '0777561547',
    contactPhoneIntl: '+94777561547',
  },
} as const;

// Google Apps Script Web App URL (Deploy > Web app in the Apps Script editor, see code.ts).
// Connected sheet: https://docs.google.com/spreadsheets/d/1v7QE7Y4DcEuyMHknCxCspDIzLi_jeGH7zi_wx1_V4qs
export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyxhL329Spl2t_pL_t8XIhOM9x6BUEnFkBsgnun1Bo4YPmfVMBvW2WGnI6mgUtDwJAmZA/exec';

export const mapEmbedUrl = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
