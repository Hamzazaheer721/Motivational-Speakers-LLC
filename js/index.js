const cardsDisplaySection = document.getElementById('cards');

let jsonData = [];

const makeCard = (obj) => {
  const {name, length, date, location, url, title} = obj
  return `
          <div class="cards-display-section__card">
            <div class="cards-display-section__card--image--section">
              <img src="${url}" loading="lazy" class="hw-max"></img>
              <div class="cover-text"> 
                <ion-icon class="person-icon" name="person-outline"></ion-icon> 
                <span class="person-data">${name} - ${length} mins</span> 
              </div>
            </div>  
            <div class="cards-display-section__card--title">
              <div class="cards-display-section__card--title-heading truncate-text">
                ${title}
              </div>
              <div class="cards-display-section__card--title-details">
                ${date} - ${location}
              </div>
            </div>
          </div>
        `;
};


const getData = async () => {
  const response = await fetch('../data/mock.json');
  return response.json();
};

const buildCards = async (data = jsonData) => {
  let row = '';
  data.forEach(val => {
    row+= makeCard(val);
    cardsDisplaySection.innerHTML = row;
  })
};

const main = async () => {
  const data = await getData();
  jsonData = [...data];
  buildCards();
};

main();
