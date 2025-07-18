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

    // Tambah transaksi
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions.push({ name, amount, type, category });
        localStorage.setItem('transactions', JSON.stringify(transactions));

        alert("Transaksi berhasil ditambahkan!");
        form.reset();
        updateUI();
    });

    // Hapus transaksi
    function deleteTransaction(index) {
        const konfirmasi = confirm("Yakin mau hapus transaksi ini?");
        if (!konfirmasi) return;

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI();
    }

    // Tampilkan data transaksi dan ringkasan
    function updateUI() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // Tampilkan daftar transaksi
        transactionList.innerHTML = '';
        if (transactions.length === 0) {
            transactionList.innerHTML = '<li>Tidak ada transaksi saat ini.</li>';
        } else {
            transactions.forEach((transaction, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${escapeHTML(transaction.name)} (${transaction.category}) - Rp ${transaction.amount} [${transaction.type}]
                    <button onclick="deleteTransaction(${index})">Hapus</button>
                `;
                transactionList.appendChild(li);
            });
        }

        // Hitung total pemasukan dan pengeluaran
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            if (t.type === 'income') {
                income += t.amount;
            } else {
                expense += t.amount;
            }
        });

        totalIncome.textContent = income;
        totalExpense.textContent = expense;
        balance.textContent = income - expense;
    }

    // Agar fungsi delete bisa diakses dari HTML onclick
    window.deleteTransaction = deleteTransaction;

    // Pertama kali jalan
    updateUI();
});