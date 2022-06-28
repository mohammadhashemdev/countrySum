// GLOBAL VARIABLES
const search = document.querySelector("#search");
const form = document.querySelector("form");
const countryInfoContainer = document.querySelector(".information-container");
const borderHeader = document.querySelector(".border-header");
const borderItemContainer = document.querySelector(".border-item-container");
const welcome = document.querySelector(".welcome");

function removeElements() {
  const items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}

function displayNames(value) {
  search.value = value;
  removeElements();
  search.focus();
}

// returning JSON value from APIs
const getJSON = async function (url, errMessage = "Something went wrong") {
  const response = await fetch(url);
  return await response.json();
};

// function for changing the alpha code to full-name
const alphaToFullName = function (alpha) {
  fetch(`https://restcountries.com/v3.1/alpha/${alpha}`)
    .then((res) => res.json())
    .then((data) => {
      const html = `
        <div class="border-item">
            <p>${data[0].name.common}</p>
            <img src="${data[0].flags.png}" alt="Border Flag" />
        </div>
        `;
      borderItemContainer.insertAdjacentHTML("beforeend", html);
    });
};

// render country information to the dom
const renderCountry = function (data) {
  const html = `
  <div class="flags-container">
    <div class="flag national-flag">
      <img class="flag-image" src="${data.flags.png}" alt="Flag Image" />
    </div>
    <div class="flag national-sign">
     <div class="coat-of-arms">
        <img class="national-sign-image" src="${
          data.coatOfArms.png
        }" alt="Sign Image" />
      </div>
      <h3>Coat of Arms</h3>
    </div>
  </div>

  <div class="details-container">
   <div class="details details--1">
     <h3>Common Name: <span>${data.name.common}</span></h3>
     <h3>Capital: <span>${data.capital[0]}</span></h3>
     <h3>Area: <span>${data.area}</span></h3>
      <h3>Currencies: <span>${
        Object.values(data.currencies)[0].name
      }</span></h3>
     <h3>Latitude & longitude: <span>[${data.latlng[0]}, ${
    data.latlng[1]
  }]</span></h3>
   </div>
   <div class="details details--2">
     <h3>
       Official Name: <span>${data.name.official}</span>
     </h3>
     <h3>Continant: <span>${data.continents[0]}</span></h3>
     <h3>population: <span>${(+data.population / 1000000).toFixed(
       1
     )} M</span></h3>
     <h3>Time Zone: <span>${data.timezones[0]}</span></h3>
     <h3>Map: <span><a href="${
       data.maps.googleMaps
     }"> See in the Map...</a></span></h3>
   </div>
  </div>
  `;

  countryInfoContainer.insertAdjacentHTML("afterbegin", html);
  countryInfoContainer.style.opacity = 1;
};

// render border countries
const renderBorders = function (data) {
  const countryBorders = data.borders;
  countryBorders.forEach((country) => {
    alphaToFullName(country);
  });

  borderHeader.style.opacity = 1;
};

// input autoComplete feature
search.addEventListener("keyup", function (e) {
  removeElements();
  for (let countryName of countries) {
    if (
      countryName.toLowerCase().startsWith(search.value.toLowerCase()) &&
      search.value != ""
    ) {
      const listItems = document.createElement("li");
      listItems.classList.add("list-items");
      listItems.style.cursor = "pointer";
      listItems.setAttribute("onclick", "displayNames('" + countryName + "')");

      let word = `<b>${countryName.substring(0, search.value.length)}</b>`;
      word += countryName.substring(search.value.length);
      listItems.innerHTML = word;
      document.querySelector(".country-list").appendChild(listItems);
    }
  }
});

const getCountryData = async function (country) {
  const [countryData] = await getJSON(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  );
  renderCountry(countryData);
  renderBorders(countryData);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  welcome.style.display = "none";
  borderHeader.style.opacity = 0;
  countryInfoContainer.innerHTML = "";
  borderItemContainer.innerHTML = "";
  getCountryData(search.value);
  search.value = "";
});
