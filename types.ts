export interface HouseContent {
  id: number;
  houseName: string;
  badge: string;
  signboardTitle: string;
  iconName: string;
  themeColor: string;
  crystalName: string;
  speechScript: string; // Clean Malaysian Malay script for TTS
  sections: {
    title: string;
    items: string[];
    isNumbered?: boolean;
    emphasisPrefix?: string;
  }[];
  importantNotes?: string[];
}

export interface HouseConfig {
  id: number;
  name: string;
  category: string;
  position: [number, number, number]; // [x, y, z] of the house
  doorPosition: [number, number, number]; // interaction point in front of door
  interactionRadius: number;
  themeColor: string;
  accentColor: string;
  iconName: string;
  crystalName: string;
  content: HouseContent;
}

export const HOUSES_DATA: HouseConfig[] = [
  {
    id: 1,
    name: 'RUMAH 1 – MAKLUMAT PEMBELAJARAN',
    category: 'Pengenalan & Kurikulum',
    position: [-28, 4, -22],
    doorPosition: [-28, 4, -18],
    interactionRadius: 6.0,
    themeColor: '#F5008F', // Hot Pink
    accentColor: '#FFF4E6',
    iconName: 'BookOpen',
    crystalName: 'Kristal Maklumat',
    content: {
      id: 1,
      houseName: 'RUMAH 1 – MAKLUMAT PEMBELAJARAN',
      badge: 'Kurikulum & Standard',
      signboardTitle: 'MAKLUMAT PEMBELAJARAN',
      iconName: 'BookOpen',
      themeColor: '#F5008F',
      crystalName: 'Kristal Maklumat',
      speechScript: `Selamat datang ke Rumah Satu: Maklumat Pembelajaran. 
Mata Pelajaran: Bahasa Melayu. 
Tahun: Tahun Lima. 
Tema: Kelestarian Alam. 
Fokus: Kemahiran Mendengar dan Bertutur. 
Standard Kandungan satu perpuluhan satu: Mendengar dan memberikan respons semasa berkomunikasi dalam situasi formal dan tidak formal. 
Standard Pembelajaran satu perpuluhan satu perpuluhan dua: Mendengar, memahami dan memberikan respons terhadap maklumat yang diujarkan dalam situasi formal.`,
      sections: [
        {
          title: 'Maklumat Asas Kurikulum',
          items: [
            'Mata Pelajaran: **Bahasa Melayu**',
            'Tahun: **Tahun 5**',
            'Tema: **Kelestarian Alam**',
            'Fokus Utama: **Kemahiran Mendengar dan Bertutur**'
          ]
        },
        {
          title: 'Standard Kandungan (SK)',
          items: [
            '**1.1** Mendengar dan memberikan respons semasa berkomunikasi dalam situasi formal dan tidak formal.'
          ]
        },
        {
          title: 'Standard Pembelajaran (SP)',
          items: [
            '**1.1.2** Mendengar, memahami dan memberikan respons terhadap maklumat yang diujarkan dalam situasi formal.'
          ]
        }
      ],
      importantNotes: [
        'Fokus terarah kepada keupayaan murid mencerna maklumat berkaitan isu pencemaran sungai dan menyampaikannya secara lisan yang teratur.'
      ]
    }
  },
  {
    id: 2,
    name: 'RUMAH 2 – OBJEKTIF PEMBELAJARAN',
    category: 'Sasaran & Hasil Pembelajaran',
    position: [24, 7, -26],
    doorPosition: [24, 7, -22],
    interactionRadius: 6.0,
    themeColor: '#9DBB69', // Matcha Green
    accentColor: '#526B4C',
    iconName: 'Target',
    crystalName: 'Kristal Objektif',
    content: {
      id: 2,
      houseName: 'RUMAH 2 – OBJEKTIF PEMBELAJARAN',
      badge: 'Hasil Pembelajaran',
      signboardTitle: 'OBJEKTIF PEMBELAJARAN',
      iconName: 'Target',
      themeColor: '#9DBB69',
      crystalName: 'Kristal Objektif',
      speechScript: `Selamat datang ke Rumah Dua: Objektif Pembelajaran. 
Pada akhir pembelajaran, murid dapat: 
Pertama: Mendengar audio dan mengenal pasti sekurang-kurangnya lapan daripada sepuluh maklumat penting. 
Kedua: Memahami maklumat yang didengar dan memberikan respons yang sesuai dalam situasi formal. 
Ketiga: Memberikan respons secara lisan secara individu dan berkumpulan berdasarkan maklumat yang diperoleh.`,
      sections: [
        {
          title: 'Objektif Pembelajaran (Pada akhir pembelajaran, murid dapat):',
          isNumbered: true,
          items: [
            '**Mendengar audio** dan mengenal pasti sekurang-kurangnya **8 daripada 10 maklumat penting**.',
            '**Memahami maklumat** yang didengar dan memberikan **respons yang sesuai** dalam situasi formal.',
            '**Memberikan respons secara lisan** secara individu dan berkumpulan berdasarkan maklumat yang diperoleh.'
          ]
        }
      ],
      importantNotes: [
        'Kriteria kejayaan dinilai berdasarkan ketepatan respons lisan dan pemahaman fakta saintifik mengenai alam sekitar.'
      ]
    }
  },
  {
    id: 3,
    name: 'RUMAH 3 – PENDEKATAN TEMATIK',
    category: 'Tema Kelestarian Alam',
    position: [34, 3, 10],
    doorPosition: [30, 3, 10],
    interactionRadius: 6.0,
    themeColor: '#E87991', // Strawberry Red
    accentColor: '#FFF4E6',
    iconName: 'TreePine',
    crystalName: 'Kristal Tematik',
    content: {
      id: 3,
      houseName: 'RUMAH 3 – PENDEKATAN TEMATIK',
      badge: 'Tema Alam Sekitar',
      signboardTitle: 'PENDEKATAN TEMATIK',
      iconName: 'TreePine',
      themeColor: '#E87991',
      crystalName: 'Kristal Tematik',
      speechScript: `Selamat datang ke Rumah Tiga: Pendekatan Tematik. 
Tema Pembelajaran: Kelestarian Alam. 
Fokus Pembelajaran merangkumi: 
Satu: Pencemaran sungai. 
Dua: Pembuangan sampah. 
Tiga: Kebersihan sungai. 
Empat: Tanggungjawab masyarakat. 
Lima: Pemeliharaan sumber air. 
Penerangan: Murid mendengar maklumat berkaitan alam sekitar, memahami isu yang disampaikan dan memberikan respons secara lisan tentang tindakan menjaga alam sekitar.`,
      sections: [
        {
          title: 'Tema: Kelestarian Alam',
          items: [
            'Fokus pembelajaran merangkumi lima aspek teras penjagaan sungai dan alam sekitar.'
          ]
        },
        {
          title: 'Fokus Pembelajaran:',
          items: [
            '**Pencemaran sungai** dan punca-puncanya.',
            '**Pembuangan sampah** ke dalam sumber air.',
            '**Kebersihan sungai** demi ekosistem hidupan.',
            '**Tanggungjawab masyarakat** dalam pemeliharaan.',
            '**Pemeliharaan sumber air** untuk generasi masa depan.'
          ]
        },
        {
          title: 'Penerangan Pelaksanaan:',
          items: [
            'Murid **mendengar maklumat** berkaitan alam sekitar, **memahami isu** yang disampaikan dan **memberikan respons secara lisan** tentang tindakan menjaga alam sekitar.'
          ]
        }
      ]
    }
  },
  {
    id: 4,
    name: 'RUMAH 4 – PEMBELAJARAN BERASASKAN INKUIRI',
    category: 'Penerokaan & Penyiasatan',
    position: [18, 5, 30],
    doorPosition: [18, 5, 26],
    interactionRadius: 6.0,
    themeColor: '#F4A6B8', // Strawberry Pink
    accentColor: '#526B4C',
    iconName: 'Search',
    crystalName: 'Kristal Inkuiri',
    content: {
      id: 4,
      houseName: 'RUMAH 4 – PEMBELAJARAN BERASASKAN INKUIRI',
      badge: 'Penyiasatan Saintifik',
      signboardTitle: 'PEMBELAJARAN BERASASKAN INKUIRI',
      iconName: 'Search',
      themeColor: '#F4A6B8',
      crystalName: 'Kristal Inkuiri',
      speechScript: `Selamat datang ke Rumah Empat: Pembelajaran Berasaskan Inkuiri. 
Misi Satu: Penerokaan Sungai Harmoni. Murid mendengar taklimat awal dan mengenal pasti persoalan berkaitan keadaan sungai. 
Misi Dua: Penyiasatan Petunjuk. Murid mendengar maklumat dan meneliti petunjuk untuk mengenal pasti punca serta kesan pencemaran sungai. 
Misi Tiga: Cadangan Penyelesaian. Murid menggunakan maklumat yang diperoleh untuk berbincang dan menyampaikan cadangan penyelesaian secara lisan.`,
      sections: [
        {
          title: 'Misi 1: Penerokaan Sungai Harmoni',
          items: [
            'Murid **mendengar taklimat awal** dan mengenal pasti persoalan berkaitan keadaan sungai.'
          ]
        },
        {
          title: 'Misi 2: Penyiasatan Petunjuk',
          items: [
            'Murid **mendengar maklumat** dan meneliti petunjuk untuk mengenal pasti **punca serta kesan pencemaran sungai**.'
          ]
        },
        {
          title: 'Misi 3: Cadangan Penyelesaian',
          items: [
            'Murid **menggunakan maklumat yang diperoleh** untuk berbincang dan **menyampaikan cadangan penyelesaian secara lisan**.'
          ]
        }
      ]
    }
  },
  {
    id: 5,
    name: 'RUMAH 5 – PEMBELAJARAN KOPERATIF',
    category: 'Kerjasama 5 Sahabat',
    position: [-22, 6, 26],
    doorPosition: [-22, 6, 22],
    interactionRadius: 6.0,
    themeColor: '#526B4C', // Deep Green
    accentColor: '#FFF4E6',
    iconName: 'Users',
    crystalName: 'Kristal Kerjasama',
    content: {
      id: 5,
      houseName: 'RUMAH 5 – PEMBELAJARAN KOPERATIF',
      badge: 'Kerjasama Kumpulan',
      signboardTitle: 'PEMBELAJARAN KOPERATIF',
      iconName: 'Users',
      themeColor: '#526B4C',
      crystalName: 'Kristal Kerjasama',
      speechScript: `Selamat datang ke Rumah Lima: Pembelajaran Koperatif. 
Konsep: Murid bekerjasama dalam kumpulan untuk berkongsi maklumat, berbincang dan menghasilkan cadangan penyelesaian. 
Aktiviti Satu: Perkongsian Maklumat. Murid berkongsi maklumat yang didengar secara individu dengan ahli kumpulan. 
Aktiviti Dua: Perbincangan Kumpulan. Murid mengumpulkan dan membandingkan petunjuk berkaitan pencemaran sungai. 
Aktiviti Tiga: Pembentangan Cadangan. Murid bekerjasama menyediakan dan membentangkan cadangan penyelesaian. 
Nilai yang diterapkan merangkumi: Kerjasama, Tanggungjawab, Keyakinan, Toleransi, dan Hormat-menghormati.`,
      sections: [
        {
          title: 'Konsep Koperatif:',
          items: [
            'Murid **bekerjasama dalam kumpulan** untuk berkongsi maklumat, berbincang dan menghasilkan cadangan penyelesaian.'
          ]
        },
        {
          title: 'Struktur Aktiviti Berkumpulan:',
          items: [
            '**Aktiviti 1: Perkongsian Maklumat** – Murid berkongsi maklumat yang didengar secara individu dengan ahli kumpulan.',
            '**Aktiviti 2: Perbincangan Kumpulan** – Murid mengumpulkan dan membandingkan petunjuk berkaitan pencemaran sungai.',
            '**Aktiviti 3: Pembentangan Cadangan** – Murid bekerjasama menyediakan dan membentangkan cadangan penyelesaian.'
          ]
        },
        {
          title: 'Nilai yang Diterapkan:',
          items: [
            '🤝 **Kerjasama** erat sesama ahli kumpulan.',
            '🛡️ **Tanggungjawab** melunaskan tugasan peranan.',
            '✨ **Keyakinan** berhujah dan bertutur.',
            '🤲 **Toleransi** mendengar pendapat berbeza.',
            '🌸 **Hormat-menghormati** sesama rakan sekelas.'
          ]
        }
      ]
    }
  },
  {
    id: 6,
    name: 'RUMAH 6 – PENTAKSIRAN PEMBELAJARAN',
    category: 'Penilaian Bilik Darjah (PBD)',
    position: [-34, 8, 2],
    doorPosition: [-30, 8, 2],
    interactionRadius: 6.0,
    themeColor: '#F5008F', // Hot Pink
    accentColor: '#9DBB69',
    iconName: 'ClipboardCheck',
    crystalName: 'Kristal Pentaksiran',
    content: {
      id: 6,
      houseName: 'RUMAH 6 – PENTAKSIRAN PEMBELAJARAN',
      badge: 'Penilaian Autentik',
      signboardTitle: 'PENTAKSIRAN PEMBELAJARAN',
      iconName: 'ClipboardCheck',
      themeColor: '#F5008F',
      crystalName: 'Kristal Pentaksiran',
      speechScript: `Selamat datang ke Rumah Enam: Pentaksiran Pembelajaran. 
Aspek yang ditaksir merangkumi: 
Satu: Mengenal pasti maklumat yang didengar. 
Dua: Memahami maklumat yang disampaikan. 
Tiga: Memberikan respons secara lisan. 
Empat: Membentangkan hasil perbincangan kumpulan. 
Lima: Melibatkan diri secara individu dan berkumpulan. 
Kaedah pentaksiran adalah melalui: Pemahaman audio, Respons lisan murid, Pemerhatian guru, Penglibatan individu, dan Penglibatan kumpulan.`,
      sections: [
        {
          title: 'Aspek yang Ditaksir:',
          items: [
            '**Mengenal pasti maklumat** yang didengar.',
            '**Memahami maklumat** yang disampaikan.',
            '**Memberikan respons** secara lisan.',
            '**Membentangkan hasil** perbincangan kumpulan.',
            '**Melibatkan diri** secara individu dan berkumpulan.'
          ]
        },
        {
          title: 'Kaedah Pentaksiran:',
          items: [
            '🎧 **Pemahaman audio** bersandarkan rakaman situasi formal.',
            '🗣️ **Respons lisan murid** dengan tatabahasa dan sebutan baku.',
            '📋 **Pemerhatian guru** melalui instrumen senarai semak.',
            '👤 **Penglibatan individu** dalam menyelesaikan tugasan.',
            '👥 **Penglibatan kumpulan** dalam membentang cadangan.'
          ]
        }
      ]
    }
  }
];

export interface EnvironmentPreset {
  id: 'cerah' | 'senja' | 'fantasi';
  name: string;
  skyColor: string;
  fogColor: string;
  sunColor: string;
  sunIntensity: number;
  hemiSkyColor: string;
  hemiGroundColor: string;
}

export const ENVIRONMENT_PRESETS: Record<string, EnvironmentPreset> = {
  cerah: {
    id: 'cerah',
    name: 'Siang Ceria',
    skyColor: '#FFF4E6',
    fogColor: '#FFF4E6',
    sunColor: '#FFFBF0',
    sunIntensity: 2.2,
    hemiSkyColor: '#FFF0F5',
    hemiGroundColor: '#9DBB69'
  },
  senja: {
    id: 'senja',
    name: 'Senja Emas',
    skyColor: '#F4A6B8',
    fogColor: '#F4A6B8',
    sunColor: '#F5008F',
    sunIntensity: 1.9,
    hemiSkyColor: '#FFF4E6',
    hemiGroundColor: '#526B4C'
  },
  fantasi: {
    id: 'fantasi',
    name: 'Malam Kristal',
    skyColor: '#36233B',
    fogColor: '#36233B',
    sunColor: '#F5008F',
    sunIntensity: 1.4,
    hemiSkyColor: '#E87991',
    hemiGroundColor: '#283824'
  }
};
