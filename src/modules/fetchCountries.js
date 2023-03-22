const url = `https://restcountries.com/v3.1/name/`;
const params = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
}) 

export const fetchCountries = (name) => {
    return fetch(`${ url }${ name }?${ params }`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
};

