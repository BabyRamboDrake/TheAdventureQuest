
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const incomeForm = document.getElementById('incomeForm');
const incomeList = document.getElementById('incomeList');
const allocationForm = document.getElementById('allocationForm');
const allocationList = document.getElementById('allocationList');
const results = document.getElementById('results');

// Load data from local storage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
let allocations = JSON.parse(localStorage.getItem('allocations')) || [];

// Render data on page load
renderExpenses();
renderIncomes();
renderAllocations();
calculateResults();

expenseForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (!name || amount <= 0) return;

    const expense = { id: Date.now(), name, amount };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    renderExpenses();
    calculateResults();
    expenseForm.reset();
});

incomeForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('incomeName').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);

    if (!name || amount <= 0) return;

    const income = { id: Date.now(), name, amount };
    incomes.push(income);
    localStorage.setItem('incomes', JSON.stringify(incomes));

    renderIncomes();
    calculateResults();
    incomeForm.reset();
});

allocationForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('allocationName').value;
    const percentage = parseFloat(document.getElementById('allocationPercentage').value);

    if (!name || percentage <= 0 || percentage > 100) return;

    const allocation = { id: Date.now(), name, percentage };
    allocations.push(allocation);
    localStorage.setItem('allocations', JSON.stringify(allocations));

    renderAllocations();
    calculateResults();
    allocationForm.reset();
});

function renderExpenses() {
    expenseList.innerHTML = expenses.map(expense => `
        <li data-id="${expense.id}">
            ${expense.name}: $${expense.amount.toFixed(2)}
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        </li>
    `).join('');
}

function renderIncomes() {
    incomeList.innerHTML = incomes.map(income => `
        <li data-id="${income.id}">
            ${income.name}: $${income.amount.toFixed(2)}
            <button onclick="deleteIncome(${income.id})">Delete</button>
        </li>
    `).join('');
}

function renderAllocations() {
    allocationList.innerHTML = allocations.map(allocation => `
        <li data-id="${allocation.id}">
            ${allocation.name}: ${allocation.percentage.toFixed(2)}%
            <button onclick="deleteAllocation(${allocation.id})">Delete</button>
        </li>
    `).join('');
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    calculateResults();
}

function deleteIncome(id) {
    incomes = incomes.filter(income => income.id !== id);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    renderIncomes();
    calculateResults();
}

function deleteAllocation(id) {
    allocations = allocations.filter(allocation => allocation.id !== id);
    localStorage.setItem('allocations', JSON.stringify(allocations));
    renderAllocations();
    calculateResults();
}

function calculateResults() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const taxes = totalIncome * 0.3;
  const netIncome = totalIncome - taxes - totalExpenses;

  let resultsHTML = `
      <p>Total Expenses: $${totalExpenses.toFixed(2)}</p>
      <p>Total Income: $${totalIncome.toFixed(2)}</p>
      <p>Taxes: $${taxes.toFixed(2)}</p>
      <p>Net Income: $${netIncome.toFixed(2)}</p>
  `;

  if (netIncome < 0) {
      const additionalAmountNeeded = Math.abs(netIncome) / (1 - 0.3);
      resultsHTML += `<p>You need to earn an additional $${additionalAmountNeeded.toFixed(2)} (including 30% taxes) to cover your expenses.</p>`;
  } else {
      resultsHTML += `<p>Allocations:</p>`;
      allocations.forEach(allocation => {
          const allocatedAmount = netIncome * (allocation.percentage / 100);
          resultsHTML += `<p>${allocation.name}: $${allocatedAmount.toFixed(2)}</p>`;
      });
  }

  results.innerHTML = resultsHTML;
}