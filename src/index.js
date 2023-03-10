import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(country) {
  country.preventDefault();

  const selectCounties = country.target.value.trim();

  fetchCountries(selectCounties).then(countries => {
    if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    }
    if (countries.length >= 2 && countries.length <= 10) {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      createCountryList(countries);
    }
    if (countries.length === 1) {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      createCountryListInfo(countries);
    }
  });
}

function clearMarkup(markup) {
  return (markup.innerHTML = '');
}

function createCountryList(countries) {
  const markup = countries
    .map(
      country => `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40">
        <h3>${country.name.official}</h3>
      </li>`
    )
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);

  return markup;
}

function createCountryListInfo(countries) {
  const markup = countries
    .map(
      country =>
        `<li>
        <img src="${country.flags.svg}"
        alt="Flag of ${country.name.official}" width="160">
        <h2>${country.name.official}</h2>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
        <p><b>Languages</b>: ${Object.values(country.languages)} </p>
      </li>`
    )
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);

  return markup;
}
