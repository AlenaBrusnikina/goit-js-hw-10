import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.searchInputEl.addEventListener(
  'input',
  debounce(onFormInput, DEBOUNCE_DELAY)
);

function onFormInput(e) {
  e.preventDefault();
  const searchCountries = e.target.value.trim();
  resetMarkup();

  if (searchCountries === '') {
    return;
  }
  fetchCountries(searchCountries).then(renderMarkup).catch(error);
}

function renderMarkup(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    renderMarkupOneCountry(data);
  } else if (data.length === 1) {
    renderMarkupCountryAll(data);
  }
}

function renderMarkupOneCountry(data) {
  const countryElement = data
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img"
          src="${flags.svg}"
          alt="${name.official}"
          width="60"
          height="40">
        ${name.official}
      </li>`
    )
    .join('');

  refs.countryListEl.innerHTML = countryElement;
}

function renderMarkupCountryAll(data) {
  const countryAll = data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class=country-info__container>
      <img
        src="${flags.svg}"
        alt="${name.official}"
        width="120"
        height="80">
      <h1 class="country-info__title">${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p></div>
      `
  );

  refs.countryInfoEl.innerHTML = countryAll;
}

function error() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function resetMarkup() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
