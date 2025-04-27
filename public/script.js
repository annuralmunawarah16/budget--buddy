document.addEventListener('DOMContentLoaded', function () {
    // Ambil data transaksi saat halaman pertama kali dimuat
    loadTransactions();

    // Tambah transaksi
    const form = document.getElementById('transaction-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah form reload

        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, amount, type, category })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Transaksi berhasil ditambahkan!');
            loadTransactions(); // Setelah transaksi ditambahkan, refresh data
        } else {
            alert('Gagal menambah transaksi: ' + result.message);
        }
    });
});

// Fungsi untuk memuat transaksi dari backend
async function loadTransactions() {
    const response = await fetch('/api/transactions');
    if (response.ok) {
        const transactions = await response.json();
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = ''; // Clear list

        if (transactions.length === 0) {
            transactionList.innerHTML = '<li>Tidak ada transaksi saat ini.</li>';
        } else {
            transactions.forEach(transaction => {
                const li = document.createElement('li');
                li.textContent = `${transaction.name} (${transaction.category}) - Rp ${transaction.amount} [${transaction.type}]`;
                transactionList.appendChild(li);
            });
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const balance = document.getElementById('balance');

    // Fungsi untuk update riwayat transaksi dan ringkasan keuangan
    async function updateUI() {
        try {
            // Mendapatkan data riwayat transaksi
            const response = await fetch('/api/transactions');
            const data = await response.json();
            const transactions = data.transactions;

            // Menampilkan transaksi di UI
            transactionList.innerHTML = '';
            transactions.forEach(transaction => {
                const li = document.createElement('li');
                li.textContent = `${transaction.name} (${transaction.category}) - Rp ${transaction.amount} [${transaction.type}]`;
                transactionList.appendChild(li);
            });

            // Mendapatkan ringkasan keuangan
            const summaryResponse = await fetch('/api/summary');
            const summaryData = await summaryResponse.json();
            totalIncome.textContent = summaryData.totalIncome;
            totalExpense.textContent = summaryData.totalExpense;
            balance.textContent = summaryData.balance;
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data.', error);
        }
    }

    // Menambahkan transaksi baru
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        try {
            // Mengirim data transaksi ke backend
            await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, amount, type, category }),
            });

            // Setelah transaksi ditambahkan, perbarui UI
            updateUI();

            // Reset form
            form.reset();
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan transaksi.', error);
        }
    });

    // Panggil updateUI saat halaman pertama kali dimuat
    updateUI();
});
