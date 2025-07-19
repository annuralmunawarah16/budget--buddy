const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const balanceEl = document.getElementById('balance');
const form = document.getElementById('transaction-form');
const historyList = document.getElementById('history');

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function fetchSummary() {
  fetch('/api/summary')
    .then(res => res.json())
    .then(data => {
      incomeEl.textContent = formatRupiah(data.totalIncome);
      expenseEl.textContent = formatRupiah(data.totalExpense);
      balanceEl.textContent = formatRupiah(data.balance);
    });
}

function fetchTransactions() {
  fetch('/api/transactions')
    .then(res => res.json())
    .then(data => {
      historyList.innerHTML = '';
      if (data.transactions.length === 0) {
        historyList.innerHTML = '<li style="text-align:center;color:#888;">Tidak ada transaksi saat ini.</li>';
      } else {
        data.transactions.forEach(trx => {
          const li = document.createElement('li');
          li.className = trx.type;
          li.textContent = `${trx.name} - ${formatRupiah(trx.amount)} (${trx.category})`;
          historyList.appendChild(li);
        });
      }
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const amount = Number(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount, type, category })
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      fetchSummary();
      fetchTransactions();
    });
});

// Load data awal saat halaman dibuka
fetchSummary();
fetchTransactions();