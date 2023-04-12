"use strict";

const BASE_URL = "https://api.tvmaze.com";
const DEFAULT_IMAGE = `https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300`

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const searchTerm = $searchForm.val();

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  //send a get request to tvmaze with searchTerm as q parameters
  const searchResult = await axios.get(
    `${BASE_URL}/search/shows/?q=${searchTerm}`
  );

  //TODO:ask about why this didnt work in CR
  //   method: "get",
  //   url: `${BASE_URL}/search/shows/?q=${searchTerm}`,
  //   type: 'application/json',
  //   //no headers
  //   // params: {
  //   //   q: `${searchTerm}`,
  //   // },
  // });

  //leaving these for now for further testing
  // console.log("search result=", searchResult);
  // console.log("ID", searchResult.data[0].show.id);
  // console.log("image", searchResult.data[0].show.image.original);
  // console.log("name", searchResult.data[0].show.name);

  //format it per below

  // ADD: Remove placeholder & make request to TVMaze search shows API.

  return [
    {
      id: searchResult.data[0].show.id,
      name: searchResult.data[0].show.name,
      summary: searchResult.data[0].show.summary,
      image: searchResult.data[0].show.image.original || DEFAULT_IMAGE,
    },
  ];
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  console.log('shows=', shows)
  $showsList.empty();

  for (const show of shows) {
    console.log('show=', show)
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

/**handles click on submit button and calls searchShowAndDisplay */
$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
