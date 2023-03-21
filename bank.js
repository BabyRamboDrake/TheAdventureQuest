
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
      <li data-id="${expense.id}" class="list-item">
          <span class="list-item-name">${expense.name}:</span>
          <span class="list-item-number">${expense.amount.toFixed(2)}</span>
          <button class="delete-btn" onclick="deleteExpense(${expense.id})">x</button>
      </li>
  `).join('');
}

function renderIncomes() {
  incomeList.innerHTML = incomes.map(income => `
      <li data-id="${income.id}" class="list-item">
          <span class="list-item-name">${income.name}:</span>
          <span class="list-item-number">${income.amount.toFixed(2)}</span>
          <button class="delete-btn" onclick="deleteIncome(${income.id})">x</button>
      </li>
  `).join('');
}

function renderAllocations() {
  allocationList.innerHTML = allocations.map(allocation => `
      <li data-id="${allocation.id}" class="list-item">
          <span class="list-item-name">${allocation.name}:</span>
          <span class="list-item-number">${allocation.percentage.toFixed(2)}%</span>
          <button class="delete-btn" onclick="deleteAllocation(${allocation.id})">x</button>
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
     <div class="results-wrapper">
        <div class="expense">  
          <p>Total Expenses:</p><p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div class="income">  
          <p>Total Income:</p><p>${totalIncome.toFixed(2)}</p>
        </div>
        <div class="taxes"> 
          <p>Taxes:</p><p>${taxes.toFixed(2)}</p>
          </div>
        <div class="net-income"> 
          <p>Net Income:</p><p>${netIncome.toFixed(2)}</p>
        </div>
      </div> 
  `;

  if (netIncome < 0) {
      const additionalAmountNeeded = Math.abs(netIncome) / (1 - 0.3);
      resultsHTML += `<div class="results-wrapper">
        <div class="target"
      <p>Target to cover expenses</p> <p>${additionalAmountNeeded.toFixed(2)} inc. tax.</p>
        </div>
      </div>`;
  } else {
      resultsHTML += `<h2>Allocations:</h2>`;
      allocations.forEach(allocation => {
          const allocatedAmount = netIncome * (allocation.percentage / 100);
          resultsHTML += `<div class="results-wrapper"><div class="alloc"><p> ${allocation.name}: ${allocatedAmount.toFixed(2)}</p></div></div>`;
      });
  }

  results.innerHTML = resultsHTML;
}