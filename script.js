// Globals
const apiKey = "52b5c482aa1f71ebeb8ab2ae52d11d9d";
let page;
let isSearch;

// DOM
const moreMoviesButton = document.querySelector("#load-more-movies-btn");
const movieResults = document.querySelector(".movies-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const clearButton = document.querySelector("#close-search-btn");

/**
 * Update the DOM to display results from The Movie Database API query.
 *
 * @param {Object} results - An array of results containing each item
 *                           returned by the response from The Movie Database API.
 *
 */
function displayResults(results, loadMore) {
  if (!loadMore) movieResults.innerHTML = ``;
  results.forEach((result, index) => {
    let imgURL;
    if (result.poster_path)
      imgURL = `https://image.tmdb.org/t/p/original/${result.poster_path}`;
    else
      imgURL = `https://st3.depositphotos.com/1322515/35964/v/600/depositphotos_359648638-stock-illustration-image-available-icon.jpg`;
    movieResults.innerHTML += `
   <div class="movie-card">
      <h2 class="movie-title">${result.title}</h2>
      <img class="movie-poster" src="${imgURL}" alt="Poster Image of ${result.title}">
      <h3 class="movie-votes">⭐️ ${result.vote_average}<h3>
   </div>
   `;
    //  const lastCard = movieResults.lastElementChild;
    //  if (lastCard.getElementsByTagName("img").style.width > 333.33) {
    //    lastCard.getElementsByTagName("h2").style.fontSize = "12px";
    //  }
  });
}

/**
 * The function responsible for handling all form submission events.
 *
 * @param {SubmitEvent} event - The SubmitEvent triggered when submitting the form
 *
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  const results = await getMovieApiResults(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput.value}&page=${page}`
  );
  displayResults(results, false);
}

/**
 * Make the actual `fetch` request to The Movie Database API
 * and appropriately handle the response.
 *
 * @param {String} fetchURL - URL used for fetch request
 *
 */
async function getMovieApiResults(fetchURL) {
  const response = await fetch(fetchURL);
  const results = await response.json();
  //   if (results.success === false) return [];
  //   moreMoviesButton.removeAttribute("hidden");
  return results.results;
}

/**
 * Functon to load more movies onto page
 */
async function moreMoviesEvent() {
  page++;
  let newSearchURL;
  if (isSearch)
    newSearchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput.value}&page=${page}`;
  else
    newSearchURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
  const results = await getMovieApiResults(newSearchURL);
  displayResults(results, true);
}

window.onload = async function () {
  page = 1;
  isSearch = false;
  const searchURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
  const results = await getMovieApiResults(searchURL);
  displayResults(results, false);
  // Event Listeners
  moreMoviesButton.addEventListener("click", moreMoviesEvent);
  searchForm.addEventListener("submit", (event) => {
    page = 1;
    isSearch = true;
    handleFormSubmit(event);
    clearButton.hidden = false;
  });
  clearButton.addEventListener("click", async () => {
    page = 1;
    const newSearchURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
    const results = await getMovieApiResults(newSearchURL);
    displayResults(results, false);
    clearButton.hidden = true;
  });
};

//const apiCall = async () => {}
