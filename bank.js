const inputField = document.getElementById('input-field');
const cardsContainer = document.getElementById('cards-container');

inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const text = inputField.value.trim();
    if (text.length > 0) {
      const card = createCard(text);
      cardsContainer.appendChild(card);
      inputField.value = '';
    }
  }
});

function createCard(text) {
  const card = document.createElement('div');
  card.classList.add('card');
  const cardText = document.createElement('p');
  cardText.textContent = text;
  card.appendChild(cardText);
  return card;
}
