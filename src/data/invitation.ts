export const invitation = {
  bride: {
    name: 'Sekar Arvinda Mahesari',
    short: 'Sekarvinda',
    father: 'Bapak Agus Riyanto',
    mother: 'Ibu Nurlailatul Fitria',
    order: 'Putri kedua dari',
    address: 'Tempelsari Banjeng, Maguwoharjo, Depok, Sleman',
    photo: '/cover/bride.jpg',
    instagram: ''
  },
  groom: {
    name: 'Cahyahadi Laksantio Rasyidi',
    short: 'Laksantio',
    father: 'Bapak Agus Hadi Purwoko',
    mother: 'Ibu Laxmi Widayanti',
    order: 'Putra kedua dari',
    address: 'Perumahan Pokoh Baru, Wedomartani, Ngemplak, Sleman',
    photo: '/cover/groom.jpg',
    instagram: ''
  },
  resepsi: {
    title: 'Resepsi Pernikahan',
    date: 'Minggu, 21 Juni 2026',
    time: '12.00 — 13.00 WIB',
    place: 'Grha Sarina Vidi',
    address:
      'Jl. Magelang 8 No.75, Mulungan Wetan, Sendangadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55285'
  },
  countdownTo: '2026-06-21T12:00:00+07:00',
  mapsUrl:
    'https://maps.google.com/?q=Grha+Sarina+Vidi+Jl.+Magelang+8+No.75+Mulungan+Wetan+Sendangadi+Mlati+Sleman',
  couplePhoto: '/cover/couple.jpg',
  gallery: [
    '/cover/gallery-1.jpg',
    '/cover/gallery-2.jpg',
    '/cover/gallery-3.jpg',
    '/cover/gallery-4.jpg',
    '/cover/gallery-5.jpg',
    '/cover/gallery-6.jpg',
    '/cover/gallery-7.jpg',
    '/cover/gallery-8.jpg',
  ],
  liveStream: {
    platform: 'YouTube',
    url: 'https://youtube.com/live/sekarvinda-laksantio'
  },
  story: [
    {
      year: '2019',
      title: 'Pertama Berjumpa',
      text: 'Takdir mempertemukan kami di bangku kuliah. Sebuah perkenalan sederhana yang kemudian tumbuh menjadi persahabatan hangat.'
    },
    {
      year: '2021',
      title: 'Menjalin Kasih',
      text: 'Setelah waktu yang panjang saling mengenal, kami memutuskan untuk melangkah bersama dalam sebuah hubungan yang lebih serius.'
    },
    {
      year: '2025',
      title: 'Lamaran',
      text: 'Dengan restu kedua keluarga, prosesi lamaran berlangsung khidmat sebagai janji untuk melanjutkan ke jenjang berikutnya.'
    },
    {
      year: '2026',
      title: 'Akad & Resepsi',
      text: 'Tiba waktunya kami menyatukan dua keluarga dalam ikatan suci pernikahan, memohon doa restu Bapak/Ibu/Saudara/i.'
    }
  ],
  gift: {
    bank: 'Bank Mandiri',
    accountNumber: '1370017891694',
    accountName: 'Sekar Arvinda Maheswari'
  },
  shipping: {
    recipient: 'Sekar Arvinda Maheswari',
    phone: '082136776386',
    address:
      'Sanggar Rias Fitri Maheswari, Tempelsari Banjeng, Maguwoharjo, Depok, Sleman'
  },
  quote: {
    text: '“Witing tresna jalaran saka kulina, sing tresna ora bakal ilang dening wektu.”',
    source: '— Paribasan Jawa'
  }
};

export type Invitation = typeof invitation;
