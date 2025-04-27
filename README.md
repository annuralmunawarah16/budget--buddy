# Budget Buddy

Budget Buddy adalah aplikasi manajemen keuangan yang dapat mencatat transaksi harian, menghitung pemasukan, pengeluaran, dan saldo, serta menyimpan data transaksi secara permanen dalam file JSON.

## Fitur
- Menambah transaksi (pemasukan dan pengeluaran)
- Menampilkan riwayat transaksi
- Menghitung total pemasukan, total pengeluaran, dan saldo
- Menyimpan transaksi di file transactions.json

## Teknologi yang Digunakan
- *Frontend:* HTML, CSS, JavaScript
- *Backend:* Node.js, Express.js
- *Penyimpanan:* File JSON (transactions.json)

## Cara Install dan Menjalankan Aplikasi
Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal kamu:

1. *Clone repository ini*
   ```bash
   git clone https://github.com/annuralmunawarah16/budget-buddy.git
   cd budget-buddy
2.	Install dependencies
Pastikan Node.js sudah terpasang di komputer kamu, kemudian jalankan perintah berikut untuk menginstall dependensi yang dibutuhkan:
npm install express
3.	Jalankan server
Setelah dependensi terpasang, jalankan server dengan perintah:
node server.js
4.	Akses aplikasi melalui browser
Buka browser dan kunjungi alamat berikut untuk menggunakan aplikasi:
http://localhost:3000

## Screenshot

Berikut adalah tampilan dari aplikasi **Budget Buddy**:

![Tampilan Budget Buddy](images/screenshot.png)

Struktur Folder

budget-buddy/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── transactions.json
├── package.json
└── README.md

Endpoint API

GET /api/summary

Mengambil ringkasan keuangan (total pemasukan, pengeluaran, dan saldo).

POST /api/transactions

Menambahkan transaksi baru dengan data yang dikirimkan melalui body request.

Lisensi

Proyek ini dibuat untuk pembelajaran dan tidak memiliki lisensi resmi.

⸻

©️ 2025 Budget Buddy — Proyek Akhir Kelas X