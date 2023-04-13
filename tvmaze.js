"use strict";

const BASE_URL = "https://api.tvmaze.com";
const DEFAULT_IMAGE = `https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300`;

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList")
const $searchForm = $("#searchForm");
const searchTerm = $searchForm.val();

/**Class to handle all logic and parsing related to the object data returned
 * from API call
 */
class Show {
  constructor(rawShowObject) {
    const { id, name, summary, image } = rawShowObject.show;

    this.id = id;
    this.name = name;
    this.summary = this.checkSummary(summary);
    this.image = this.imageCheck(image);
  }

  /**checks if image is present, returns the image if true, default image if not
   *
   */
  imageCheck(image) {
    if (image === null) {
      console.log("image=", image);
      return DEFAULT_IMAGE;
    } else {
      return image.original;
    }
  }

  /**checks if a summary is present, returns the summary if true, default
   * text if not
   */
  checkSummary(summary) {
    if (!summary) {
      return "No summary available";
    } else {
      return summary;
    }
  }
}

/**class to handle all logic and parsing related to raw episode objects returned
 * from the API.
 */
class Episode {
  constructor(rawEpisodeObject) {
    const { id, name, season, number } = rawEpisodeObject;
    this.id = id;
    this.name = name;
    this.season = season;
    this.number = number;
  }
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  const searchResult = await axios.get(
    `${BASE_URL}/search/shows/?q=${searchTerm}`
  );

  const shows = searchResult.data;
  const formattedShowData = shows.map((show) => new Show(show));

  return formattedShowData;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  // console.log('shows=', shows);
  $showsList.empty();

  for (const show of shows) {
    // console.log('show=', show);
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

//return array of episode objects
async function getEpisodesOfShow(id) {
  const searchResult = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
  const { data } = searchResult;

  const formattedEpisodeData = data.map((episode) => new Episode(episode));
  console.log('formattedEpisode=', formattedEpisodeData)

  return formattedEpisodeData;
}

/**Populates and displays the episode list for a show
 * Args: an array of pre-formatted show objects
 * Returns: nothing, only modifes the DOM
 */
function displayEpisodes(episodes) {
  console.log('episodes in displayEps=', episodes)
  //empty the episode area
  $episodesList.empty();

  for (const episode of episodes) {
    const { id, name, season, number } = episode;

    const $episode = $(
      `<li data-episode-id="${id}">
      ${name} (season ${season}, number ${number})
      </li>`
    );

    $episodesList.append($episode)
  }

  $episodesArea.removeAttr('display');

  //populate it with the clicked on shows list of episodes
}

// add other functions that will be useful / match our structure & design
