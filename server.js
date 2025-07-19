const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint: Tambah transaksi
app.post('/api/transactions', (req, res) => {
  const { name, amount, type, category } = req.body;

  fs.readFile('transactions.json', 'utf8', (err, data) => {
    let transactions = [];

    if (!err && data) {
      try {
        transactions = JSON.parse(data);
      } catch (e) {
        transactions = [];
      }
    }

    transactions.push({ name, amount, type, category });

    fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Gagal menyimpan transaksi.' });
      }
      res.status(200).json({ message: 'Transaksi berhasil ditambahkan.' });
    });
  });
});

// Endpoint: Ambil semua transaksi
app.get('/api/transactions', (req, res) => {
  fs.readFile('transactions.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal membaca data transaksi.' });
    }

    let transactions = [];
    try {
      transactions = JSON.parse(data);
    } catch (e) {
      transactions = [];
    }

    res.status(200).json({ transactions });
  });
});

// Endpoint: Ringkasan keuangan
app.get('/api/summary', (req, res) => {
  fs.readFile('transactions.json', 'utf8', (err, data) => {
    let transactions = [];
    if (!err && data) {
      try {
        transactions = JSON.parse(data);
      } catch (e) {
        transactions = [];
      }
    }

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(trx => {
      if (trx.type === 'income') totalIncome += trx.amount;
      else if (trx.type === 'expense') totalExpense += trx.amount;
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({ totalIncome, totalExpense, balance });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});