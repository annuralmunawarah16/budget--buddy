document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const balance = document.getElementById('balance');

    // Escape teks agar aman dari XSS
    function escapeHTML(text) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Hapus transaksi
    async function deleteTransaction(id) {
        const konfirmasi = confirm("Yakin mau hapus transaksi ini?");
        if (!konfirmasi) return;

        const response = await fetch(/api/transactions/${id}, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Transaksi berhasil dihapus.");
            updateUI();
        } else {
            alert("Gagal menghapus transaksi.");
        }
    }

    // Tampilkan data transaksi dan ringkasan
    async function updateUI() {
        try {
            const response = await fetch('/api/transactions');
            const data = await response.json();
            const transactions = data.transactions || data;

            transactionList.innerHTML = '';
            if (transactions.length === 0) {
                transactionList.innerHTML = '<li>Tidak ada transaksi saat ini.</li>';
            } else {
                transactions.forEach(transaction => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${escapeHTML(transaction.name)} (${transaction.category}) - Rp ${transaction.amount} [${transaction.type}]
                        <button onclick="deleteTransaction('${transaction.id}')">Hapus</button>
                    `;
                    transactionList.appendChild(li);
                });
            }

            const summaryResponse = await fetch('/api/summary');
            const summaryData = await summaryResponse.json();
            totalIncome.textContent = summaryData.totalIncome;
            totalExpense.textContent = summaryData.totalExpense;
            balance.textContent = summaryData.balance;
        } catch (error) {
            console.error('Gagal memuat data transaksi:', error);
        }
    }

    // Tambah transaksi
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, amount, type, category })
            });

            if (response.ok) {
                alert("Transaksi berhasil ditambahkan!");
                form.reset();
                updateUI();
            } else {
                const result = await response.json();
                alert("Gagal menambah transaksi: " + result.message);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan transaksi:', error);
        }
    });

    updateUI();

    // Agar fungsi hapus bisa dipanggil dari onclick HTML
    window.deleteTransaction = deleteTransaction;
});