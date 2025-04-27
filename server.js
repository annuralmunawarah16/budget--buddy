const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Menyajikan file HTML dan lainnya dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk menambahkan transaksi
app.post('/api/transactions', (req, res) => {
    const { name, amount, type, category } = req.body;

    // Membaca file transactions.json
    fs.readFile('transactions.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan saat membaca data.' });
        }

        let transactions;
        try {
            // Jika data ada, coba parse JSON
            transactions = JSON.parse(data);
        } catch (e) {
            // Jika JSON rusak, buat array kosong
            transactions = [];
        }

        // Menambahkan transaksi baru
        transactions.push({ name, amount, type, category });

        // Menyimpan data transaksi baru ke file JSON
        fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data.' });
            }
            res.status(200).json({ message: 'Transaksi berhasil ditambahkan!' });
        });
    });
});

// Endpoint untuk mendapatkan ringkasan keuangan
app.get('/api/summary', (req, res) => {
    fs.readFile('transactions.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan saat membaca data.' });
        }

        let transactions;
        try {
            transactions = JSON.parse(data); // Mengubah data JSON menjadi objek JavaScript
        } catch (e) {
            transactions = []; // Jika data rusak, inisialisasi dengan array kosong
        }

        let totalIncome = 0;
        let totalExpense = 0;

        // Menghitung total pemasukan dan pengeluaran
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        // Mengembalikan ringkasan keuangan
        res.status(200).json({ totalIncome, totalExpense, balance });
    });
});

// Endpoint untuk mendapatkan riwayat transaksi
app.get('/api/transactions', (req, res) => {
    fs.readFile('transactions.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan saat membaca data.' });
        }

        let transactions;
        try {
            transactions = JSON.parse(data); // Mengubah data JSON menjadi objek JavaScript
        } catch (e) {
            transactions = []; // Jika data rusak, inisialisasi dengan array kosong
        }

        res.status(200).json({ transactions });
    });
});

// Rute untuk halaman utama (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server di port 3000
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});
