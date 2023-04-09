import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import getRefs from './refs';

const refs = getRefs();

const DEBOUNCE_DELAY = 300;

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
        .then(countrys => {
            if (countrys.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }
            markupRender(countrys)
        })
        .catch(error => {
            refs.countryList.innerHTML = '';
            refs.countryCard.innerHTML = '';
            Notify.failure('Oops, there is no country with that name');
        })
};

function markupRender(countrys) {
    if (countrys.length === 1) {
        refs.countryCard.innerHTML = ''
        refs.countryList.style.display = "none";
        refs.countryCard.style.display = "block";
        onRenderCard(countrys);
    };

    if (countrys.length > 1 && countrys.length <= 10) {
        refs.countryList.innerHTML = ''
        refs.countryList.style.display = "block";
        refs.countryCard.style.display = "none";
        onRenderList(countrys);
    };
};

function onRenderList(countrys) {
    const countryListRender = countrys.map(({ flags, name }) => {
        return `<li>
        <img src="${flags.svg}" alt="${name}" width="60">
        <span>${name.official}</span>
        </li>`
    }).join('');

    refs.countryList.innerHTML = countryListRender;
    return countryListRender;
};

function onRenderCard(countrys) {
    const countryCardRender = countrys.map(({ flags, name, capital, population, languages }) => {
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
