document.addEventListener('DOMContentLoaded', () => {
  let ages = [];

  const generateCards = () => {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    for (let i = 0; i < ages.length; i++) {
      const html = `<div class="cardHeader">
          <div class="cardName">${ages[i].name}</div>
          <button data-card-index="${i}" class="cardDelete">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"
              />
            </svg>
          </button>
        </div>
        <div class="cardAge">${ages[i].age}</div>
        <div class="cardSampleSize">Sample Size: ${ages[
          i
        ].count.toLocaleString()}</div>
      `;

      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      card.innerHTML = html;
      cards.prepend(card);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('ages', JSON.stringify(ages));
  };

  const addToStorage = (data) => {
    if (ages.length === 9) ages.shift();
    ages.push(data);
    saveToLocalStorage();
    generateCards();
  };

  const deleteFromStorage = (id) => {
    ages.splice(id, 1);
    saveToLocalStorage();
    generateCards();
  };

  const form = document.getElementById('nameForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = event.target.name.value;

    fetch('https://api.agify.io?name=' + name)
      .then((res) => res.json())
      .then((data) => {
        addToStorage(data);
      })
      .catch((error) => console.log(error));

    event.target.name.value = '';
  });

  const cards = document.getElementById('cards');
  cards.addEventListener('click', (event) => {
    if (event.target.closest('[data-card-index]')) {
      const id = event.target
        .closest('[data-card-index]')
        .getAttribute('data-card-index');

      deleteFromStorage(id);
    }
  });

  // rehydrate from local storage
  const cachedAges = JSON.parse(localStorage.getItem('ages'));
  if (cachedAges) {
    ages = cachedAges;
    generateCards();
  }
});
