const cardsDisplaySection = document.getElementById('cards');
const range = document.getElementById('range-values');
const input = document.getElementById('search-field');

const locationDropDown = document.querySelector('#location');

const lengthFrom = document.querySelector('#from');
const lengthTo = document.querySelector('#to');

const costFrom = document.querySelector('#costFrom');
const costTo = document.querySelector('#costTo');

let lowerSlider = document.querySelector('#lower'),
  upperSlider = document.querySelector('#upper'),
  lowerVal = parseInt(lowerSlider.value);
upperVal = parseInt(upperSlider.value);

const DIFFERENCE_IN_RANGE = 5;
let jsonData = [];

let costFromValue = costFrom.value || '';
let costToValue = costTo.value || '';

let lengthFromValue = '';
let lengthToValue = '';

const filterCardsWithGivenCostRange = ({costFromValue, costToValue}) => {
  const filteredArray = jsonData.filter(obj => {
    if (+obj.cost >= +costFromValue && +obj.cost <= +costToValue) {
      return obj;
    }
  })
  buildCards(filteredArray);
};

const filterCardsWithGivenLengthRange = ({lengthFromValue, lengthToValue}) => {
  console.info({lengthFromValue,lengthToValue});
  const filteredArray = jsonData.filter(obj => {
    if (+obj.length >= +lengthFromValue && +obj.length <= +lengthToValue) {
      return obj;
    }
  })
  buildCards(filteredArray);
};

const checkCostValuesAndRebuildCards = () => {
  if (costFromValue && costToValue) {
    filterCardsWithGivenCostRange({ costFromValue, costToValue });
  } else if (costFromValue && !costToValue) {
    filterCardsWithGivenCostRange({
      costFromValue,
      costToValue: costFromValue,
    });
  } else if (!costFromValue && costToValue) {
    filterCardsWithGivenCostRange({ costFromValue: costToValue, costToValue });
  } else {
    filterCardsWithGivenCostRange({ costFromValue: 5, costToValue: 30 });
  }
};

const checkEventsLengthAndRebuildCards = () => {
  if (lengthFromValue && lengthToValue) {
    filterCardsWithGivenLengthRange({ lengthFromValue, lengthToValue });
  } else if (lengthFromValue && !lengthToValue) {
    filterCardsWithGivenLengthRange({
      lengthFromValue,
      lengthToValue: lengthFromValue,
    });
  } else if (!lengthFromValue && lengthToValue) {
    filterCardsWithGivenLengthRange({ lengthFromValue: lengthToValue, lengthToValue });
  } else {
    filterCardsWithGivenLengthRange({ lengthFromValue: 5, lengthToValue: 30 });
  }
};

lengthFrom.addEventListener('change', () => {
  const value = lengthFrom.selectedOptions[0].value;
  lengthFromValue = value;
  checkEventsLengthAndRebuildCards()
});

lengthTo.addEventListener('change', () => {
  const value = lengthTo.selectedOptions[0].value;
  lengthToValue = value;
  checkEventsLengthAndRebuildCards()
});

costFrom.addEventListener('keyup', () => {
  const { value } = costFrom;
  costFromValue = value;
  checkCostValuesAndRebuildCards();
});

costTo.addEventListener('keyup', () => {
  const { value } = costTo;
  costToValue = value;
  checkCostValuesAndRebuildCards();
});

upperSlider.oninput = function () {
  lowerVal = parseInt(lowerSlider.value);
  upperVal = parseInt(upperSlider.value);
  if (upperVal < lowerVal + DIFFERENCE_IN_RANGE) {
    lowerSlider.value = upperVal - DIFFERENCE_IN_RANGE;
    if (lowerVal == lowerSlider.min) {
      upperSlider.value = DIFFERENCE_IN_RANGE;
    }
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
  }
  updateRangeStyle({ lowerVal, upperVal });
};

lowerSlider.oninput = function () {
  lowerVal = parseInt(lowerSlider.value);
  upperVal = parseInt(upperSlider.value);
  if (lowerVal > upperVal - DIFFERENCE_IN_RANGE) {
    upperSlider.value = lowerVal + DIFFERENCE_IN_RANGE;
    if (upperVal == upperSlider.max) {
      lowerSlider.value = parseInt(upperSlider.max) - DIFFERENCE_IN_RANGE;
    }
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
  }
  updateRangeStyle({ lowerVal, upperVal });
};

locationDropDown.addEventListener('change', () => {
  const value = locationDropDown.selectedOptions[0].value;
  checkLocation(value);
});

input.addEventListener('keyup', () => {
  const { value } = input;
  checkIfValueExists(value);
});


const updateRangeStyle = (obj = { lowerVal, upperVal }) => {
  const { lowerVal, upperVal } = obj;
  const content = `
    <label id="label" class="label" for="from">Event Size</label>
    &nbsp;
    <div class="give-gap">
      <label id="label" class="label" for="from">From</label>
      <span class="label-range">${lowerVal}</span>
      &nbsp;
      <label id="label" class="label" for="from">To</label>
      <span class="label-range">${upperVal}</span>
      &nbsp;
    </div>
  `;
  range.innerHTML = content;
};

const checkLocation = (value) => {
  if (!Object.keys(jsonData).length) return;
  const filteredArray = jsonData.filter((obj) => obj.location.includes(value));
  buildCards(filteredArray);
};

const makeCard = (obj) => {
  const { name, length, date, location, url, title, cost } = obj;
  return `
          <div class="cards-display-section__card">
            <div class="cards-display-section__card--image--section">
              <img src="${url}" loading="lazy" class="hw-max"></img>
              <div class="cover-text"> 
                <ion-icon class="person-icon" name="person-outline"></ion-icon> 
                <span class="person-data">${name} - ${length} mins - ${cost}$ </span> 
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
  data.forEach((val) => {
    row += makeCard(val);
    cardsDisplaySection.innerHTML = row;
  });
};

const checkIfValueExists = (value) => {
  if (!Object.keys(jsonData).length) return;
  const filteredArray = jsonData.filter(
    (obj) => obj.location.includes(value) || obj.name.includes(value)
  );
  buildCards(filteredArray);
};

const main = async () => {
  const data = await getData();
  jsonData = [...data];
  buildCards();
  updateRangeStyle();
};

main();
