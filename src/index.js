import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    countryList: document.querySelector('.country-list'),
    countryCard: document.querySelector('.country-info'),
    input: document.querySelector('#search-box')
};

refs.input.addEventListener('input', debounce(onCountryFetch, DEBOUNCE_DELAY));

function onCountryFetch(event) {
    event.preventDefault();

    const searchCountry = refs.input.value.trim();

    if (!searchCountry) {
        refs.countryList.style.display = "none";
        refs.countryCard.style.display = "none";
        refs.countryList.innerHTML = '';
        refs.countryCard.innerHTML = '';
        return;
    }

    fetchCountries(searchCountry)
        .then(response => {
            if (response.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }
            markupRender(response)
        })
        .catch(error => {
            refs.countryList.innerHTML = '';
            refs.countryCard.innerHTML = '';
            Notify.failure('Oops, there is no country with that name');
        })
};

function markupRender(response) {
    if (response.length === 1) {
        refs.countryCard.innerHTML = ''
        refs.countryList.style.display = "none";
        refs.countryCard.style.display = "block";
        onRenderCard(response);
    };

    if (response.length > 1 && response.length <= 10) {
        refs.countryList.innerHTML = ''
        refs.countryList.style.display = "block";
        refs.countryCard.style.display = "none";
        onRenderList(response);
    };
};

function onRenderList(response) {
    const countryListRender = response.map(({ flags, name }) => {
        return `<li>
        <img src="${flags.svg}" alt="${name}" width="60">
        <span>${name.official}</span>
        </li>`
    }).join('');

    refs.countryList.innerHTML = countryListRender;
    return countryListRender;
};

function onRenderCard(response) {
    const countryCardRender = response.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
        return `
        <img src="${flags.svg}" alt="${name}" width="120">
        <h1>${name.official}</h1>
        <p>Capital: <span>${capital}</span></p>
        <p>Population: <span>${population}</span></p>
        <p>Languages: <span>${languages}</span></p>
        `
    }).join('');

    refs.countryCard.innerHTML = countryCardRender;
    return countryCardRender;
};
