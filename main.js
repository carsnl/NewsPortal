// ==============================
// GLOBAL VARIABLES
// ==============================

// -----------------------
// API Key
// -----------------------
const apiKey = 'c1e2d1f5ad7e406391f916de7f829d78'

// -----------------------
// News Sources for Quick Search
// -----------------------
const sources = ['reuters', 'bbc-news','axios','bloomberg','al-jazeera-english','associated-press','business-insider','cnn','google-news','time',]

// -----------------------
// Response
// -----------------------
let result;
let resultReturned;

// -----------------------
// Selectors
// -----------------------
const pageContainer = document.querySelector('.page-container');
const menu = document.querySelector(".menu-container");
const hamburger = document.querySelector(".collapsed-menu");
const searchQuery = document.querySelector(".search-query");
const searchBtn = document.querySelector(".search-btn");
const pageContent = document.querySelector(".page-content");
const newsContainer = document.querySelector(".news-container");
const newsStory = document.querySelectorAll(".news-item");

// Filter
const filterContainer = document.querySelector(".filter-container");
const filterToggleBtn = document.querySelector(".filter-btn");
const filterApplyBtn = document.querySelector(".filter-apply-btn");
const filterCloseBtn = document.querySelector(".filter-close-btn");
const filterCountryInput = document.querySelector("#country");

// Toast
const toastEmptySearch = document.querySelector(".toast-empty-search");
const toastClose = document.querySelector(".toast-close");

// -----------------------
// Search Filters
// -----------------------
let endpoint = 'everything';
let filterSort = 'publishedAt';
let filterLang = '';
let filterStartDate = '';
let filterEndDate = '';
let filterCountry = '';
let filterSources = '';
let page = 1;

// -----------------------
// Search Topic Placeholders
// -----------------------
searchPlaceholder = [
    'football',
    'Europe',
    'movies',
    'books',
    'war',
    'Marvel',
    'Olympic Games',
]

// Provide random placeholder on start-up
searchQuery.setAttribute(
    'placeholder', `${getPlaceholder()}`
);

// ==============================
// EVENTS
// ==============================

// -----------------------
// Click
// -----------------------

// Open hamburger menu
// hamburger.addEventListener('click', function() {
//     menu.classList.toggle('active');
// });

// Clear search bar
let searchClearBtn = document.querySelector('.search-clear-btn');
searchClearBtn.addEventListener('click', function() {
    if (searchQuery.value != '') {
        // Clear search bar
        searchQuery.value = ''

        // Set a new random placeholder
        searchQuery.setAttribute(
            'placeholder', 
            searchPlaceholder[Math.floor(Math.random()*searchPlaceholder.length)],
        );
    }
});

// Open filter menu
filterToggleBtn.addEventListener('click', function() {
    toggleFilterContainer();
});

// Close filter menu
filterCloseBtn.addEventListener('click', function() {
    filterApplyBtn.click();
});

// Change filter tags
const tagContainer = document.querySelector('.filter-tag-container')

searchBtn.addEventListener('click', function() {
    // Clear all tags
    removeAllChildNodes(tagContainer);

    // Show tag container when loading for the first time
    if (!tagContainer.classList.contains('show')) {
        tagContainer.classList.toggle('show');
    }

    // Change page layout on first search
    if (!pageContainer.classList.contains('with-results')) {
        // Expand page container
        pageContainer.classList.toggle('with-results');
        // Remove welcome message and shift search bar up
        let message = document.querySelector('.welcome-msg')
        // message.remove();
        message.classList.toggle('with-results');

        // TODO: animate "slideup" after removing message
    }
    

    // Add tags
    let queryTag = document.createElement('p');
    let sortTag = document.createElement('p');
    let langTag = document.createElement('p');
    let dateStartTag = document.createElement('p');
    let dateEndTag = document.createElement('p');
    let countryTag = document.createElement('p');

    let j;

    // Query
    if (searchQuery.value != '') {
        queryTag.textContent = searchQuery.value;
        queryTag.classList.add('custom-filter')
        tagContainer.appendChild(queryTag);
    }

    // Sort
    let sortField = document.querySelector('#sort');
    
    for (j = 0; j < sortField.childElementCount; j++) {
        if (`${filterSort}` == sortField.children[j].value) {
            sortTag.textContent = sortField.children[j].textContent
        }
    }

    sortTag.classList.add('default-filter')
    tagContainer.appendChild(sortTag);

    // Language
    let langField = document.querySelector('#language');
    
    for (j = 0; j < langField.childElementCount; j++) {
        if (`${filterLang}` == langField.children[j].value) {
            langTag.textContent = langField.children[j].textContent
        }
    }

    langTag.classList.add('default-filter')
    tagContainer.appendChild(langTag);

    // Start date
    let dateStartField = document.querySelector('#start-date');

    // Only show tag is user specifies a start date
    if (dateStartField.value != '') {
        dateStartTag.textContent = `From ${dateStartField.value}`;
        dateStartTag.classList.add('default-filter')
        tagContainer.appendChild(dateStartTag);
    }

    // End date
    let dateEndField = document.querySelector('#end-date');
    
    // Only show tag is user specifies an end date
    if (dateEndField.value != '') {
        dateEndTag.textContent = `To ${dateEndField.value}`;
        dateEndTag.classList.add('default-filter')
        tagContainer.appendChild(dateEndTag);
    }

    // If both start and end date not specified
    // Results are from the past month
    if (dateEndField.value == '' && dateStartField.value == '') {
        let pastMonthTag = document.createElement('p');
        pastMonthTag.textContent = 'Past Month';
        pastMonthTag.classList.add('default-filter')
        tagContainer.appendChild(pastMonthTag);
    }

    // Country
    let countryField = document.querySelector('#country');
    
    for (j = 0; j < countryField.childElementCount; j++) {
        if (`${filterCountry}` == countryField.children[j].value) {
            countryTag.textContent = countryField.children[j].textContent
        }
    }

    countryTag.classList.add('default-filter')
    tagContainer.appendChild(countryTag);

    console.log(tagContainer.children);

    // Open filter window when a tag is clicked
    for (let tag of tagContainer.children) {
        tag.addEventListener('click', function() {
            toggleFilterContainer();
        })
    }
})


// ==============================
// FETCH NEWS FROM API
// ==============================

// Create news items (stories) from API call response
function createNewsItem(article) {
    // Story parent
    let story = document.createElement('article');
    story.classList.add('news-item');

    // Title
    let title = document.createElement('a');
    title.setAttribute('href', article.url);
    title.setAttribute('target', '_blank');
    title.textContent = article.title;

    // Image
    let img = document.createElement('img');
    img.setAttribute('src', article.urlToImage);
    img.setAttribute('alt', 'image');
    img.addEventListener('mouseover', function() {
        img.style.cursor = 'pointer';     
     })
    img.addEventListener('click', function() {
        title.click();  // Clicking image opens the page
    })
    

    // Description
    let desc = document.createElement('p');
    desc.textContent = article.description;

    // Source
    let source = document.createElement('h5');
    source.textContent = article.source.name;
    source.classList.add('news-source');

    // Date
    let date = document.createElement('h5');
    date.textContent = article.publishedAt.slice(0,10); // Date only, no time
    date.classList.add('news-date');

    // 'Read More' button
    let readMoreBtn = document.createElement('a');
    readMoreBtn.innerText = 'Read More';

    readMoreBtn.setAttribute('href', article.url);
    readMoreBtn.setAttribute('target', '_blank');
    readMoreBtn.classList.add('read-more-btn');

    // Story content (image, title, description)
    let content = document.createElement('div');
    content.classList.add('story-content');
    content.appendChild(img);
    content.appendChild(title);
    content.appendChild(desc);

    // Story footer (source and date)
    let footer = document.createElement('div');
    footer.classList.add('story-footer');
    footer.appendChild(source);
    footer.appendChild(date);

    // Append story content, footer and button to parent
    story.appendChild(content);
    story.appendChild(footer);
    story.appendChild(readMoreBtn);

    // 'Read More' appears on hover
    story.addEventListener('mouseover', function() {
        readMoreBtn.classList.toggle('active');
    })

    // 'Read More' disappears when cursor moves away
    story.addEventListener('mouseout', function() {
        readMoreBtn.classList.toggle('active');
    })

    // Add story to news container
    newsContainer.appendChild(story);

    // Each story "Scrolls in" animation
    setTimeout(function() {
        story.classList.add('entry');
    }, 1)
    
}

// Calls API and attempts to return data
async function fetchNews(isNewSearch) {
    const fetchMoreBtnContainer = document.querySelector('#fetch-more-btn-container');
    const noResultsError = document.querySelector('.no-results-container.error');

    // Construct URL according to query and filters
    let searchUrl = `https://newsapi.org/v2/${endpoint}`;

    const searchParams = [`q='${searchQuery.value}'`, `sortBy=${filterSort}`, `language=${filterLang}`, `from=${filterStartDate}`, `to=${filterEndDate}`, `country=${filterCountry}`, `sources=${filterSources}`, `page=${page}`];

    let paramCount = 1;
    for (let param of searchParams) {
        let paramInput = param.split('=')[1];
        // param is tag + input e.g. (q=) + ('query')
        if (paramInput != '' && paramInput != `''`) {
            if (paramCount === 1) {
                searchUrl += `?${param}`; // first param preceeds with ?
            } else {
                searchUrl += `&${param}`; // subsequent params preceeds with &
            }
            paramCount += 1;
        }   
    }

    console.log(searchUrl);

    // Check if a query was provided
    let queryProvided = validateQuery(searchQuery.value);
    if (!queryProvided) {
        toggleToastEmptySearch();   // No search query provided, show toast to warn user
    }

    // Call API
    fetch(searchUrl, {
        headers: {
            'x-api-key': apiKey,
        }
    })
        .then((response) => response.json())
        .then((data) => {
            toggleLoad();
            result = data;
            resultReturned = checkResponse(data);    // Confirm if successfull response has results

            // TODO: style changes are in different functions

            if (resultReturned) {
                newsContainer.style.display = 'grid'; // Load news container
                if (isNewSearch) {
                    clearPage();
                    fetchMoreBtnContainer.style.display = 'block'; // Show see more button
                    toggleToastResultsReturned();
                }
                setupPage();
            } else if (!resultReturned) {
                newsContainer.style.display = 'none'; // Hide news container
                noResultsError.style.display = 'flex';  // Show no results error page
                fetchMoreBtn.style.display = 'none'; // Hide see more button
            }
        })
        .then(
            toggleLoad()
        )
}

// Fetch more button press
let fetchMoreBtn = document.querySelector('#fetch-more-btn');

fetchMoreBtn.addEventListener('click', async function() {
    page += 1;
    fetchNews(false);
    setTimeout(function() {
        if (!result.articles.length > 0) {
            toggleToastNoMoreResults();
            fetchMoreBtn.style.display = 'none';
        }    
    }, 1000)
});

function clearPage() {
    page = 1;   // back to first page of results
    removeAllChildNodes(newsContainer);

    // Remove error messages
    const noResultsError = document.querySelector('.no-results-container');
    noResultsError.style.display = 'none';
}

function setupPage() {
    // Create news items
    result.articles.forEach(article => {
        createNewsItem(article);
    });
}

// Fetch on button press
searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // isNewSearch = true
    fetchNews(true) ;
});

// Fetch on 'Enter' key press
searchQuery.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ============================
// SEARCH FILTER
// ============================

const countryNotice = document.querySelector('.country-select-notice');
const filterForm = document.querySelector('.filter-drop-down-container');

// Detects if user has selected a specific country, then shows information notification
filterCountryInput.addEventListener('input', function(e) {

    // If specific country selected (default All is ''), prompt user
    if (e.target.value != '') {
        if (!(countryNotice.classList.contains('notice-active'))) {
            // If notice is not active, activate it
            countryNotice.classList.toggle('notice-active');
            filterForm.classList.toggle('notice-active');
            filterContainer.classList.toggle('notice-active');
            // Disable search bar
            toggleSearchBar(false);
        }       
    } else {
        // All is selected
        if ((countryNotice.classList.contains('notice-active'))) {
            // If notice is active, deactivate it
            countryNotice.classList.toggle('notice-active');
            filterForm.classList.toggle('notice-active');
            filterContainer.classList.toggle('notice-active');
            // Activate search bar
            toggleSearchBar(true);
        }  
    }
})

// Toggles search bar 'on' or 'off' 
function toggleSearchBar(on) {
    if (on) {
        searchQuery.setAttribute('disable', false);
        searchQuery.setAttribute('placeholder', getPlaceholder().toString());
        searchQuery.classList.toggle('disable');
    } else {
        searchQuery.setAttribute('disable', true);
        searchQuery.setAttribute('placeholder', `Headlines Mode Enabled`);
        searchQuery.classList.toggle('disable');
        searchQuery.value = '';
    }
}

// Apply filters
filterApplyBtn.addEventListener('click', function() {
    // Sort
    filterSort = (document.getElementById('sort').value).toString();

    // Language
    filterLang = (document.getElementById('language').value).toString();

    // Date (to be validated)
    const checkStartDate = (document.querySelector("#start-date")).value;
    const checkEndDate = (document.querySelector("#end-date")).value;

    // Validate date
    if (validateDate(checkStartDate, checkEndDate)) {
        if (checkStartDate != '') {
            filterStartDate = `&from=${checkStartDate}`; // Only start date provided (valid)
        }
        if (checkEndDate != '') {
            filterEndDate = `&to=${checkEndDate}`; // Only end date provided (valid)
        }   
    } else {
        alert('Check dates.') // Invalid
        // TODO: add toast
    }

    // Country
    filterCountry = (document.getElementById('country').value).toString();

    // If a specific country selected (not 'All')
    // NOTE: News API does not support 'everything' endpoint for specific countries
    if (filterCountry == '') {
        endpoint = 'everything';
    } else {
        endpoint = 'top-headlines';
    }

    // Close filter window
    toggleFilterContainer();

    // Search for news
    if (pageContainer.classList.contains('with-results')) {
        searchBtn.click();  // Nothing to filter yet on home page
    }
}) 

// ============================
// SCROLL TO TOP
// ============================

const scrollToTopBtn = document.getElementById('scroll-to-top-btn')

// Shows a button that allows user to scroll back to top of the page
function showScrollToTopBtn() {
    // body for Safari, documentElement for rest
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
}

// Returns user to top of the page
function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Detects scroll event
window.addEventListener('scroll', showScrollToTopBtn);
scrollToTopBtn.addEventListener('click', scrollToTop);

// ============================
// TOAST NOTIFICATIONS
// ============================

// Empty search query provided
function toggleToastEmptySearch() {
    // Only appears if no particular country is selected
    // For specific countries, no search query is recommended to user for best results
    if (filterCountry == ''){
        toastEmptySearch.classList.toggle('active');
        // Disappear after 3.5s
        setTimeout(() => {
            // Check if toast was previously closed by 'X' button
            if (toastEmptySearch.classList.contains('active')) {
                toastEmptySearch.classList.toggle('active');
            }
        }, 3500);
    }    
}

// No more results returned from 'See More' button
function toggleToastNoMoreResults() {
    let toastNoMoreResults = document.querySelector('.toast-no-more-results');
    console.log(toastNoMoreResults);
    toastNoMoreResults.classList.toggle('active');
    // Disappear after 3.5s
    setTimeout(() => {
        // Check if toast was previously closed by 'X' button
        if (toastNoMoreResults.classList.contains('active')) {
            toastNoMoreResults.classList.toggle('active');
        }
    }, 3500);  
}

// Search returned results
function toggleToastResultsReturned() {
    let toastResultsReturned = document.querySelector('.toast-results-returned');

    let hits = document.querySelector('#hits');
    hits.textContent = `${result.totalResults} results returned.`;

    toastResultsReturned.classList.toggle('active');
    // Disappear after 3.5s
    setTimeout(() => {
        // Check if toast was previously closed by 'X' button
        if (toastResultsReturned.classList.contains('active')) {
            toastResultsReturned.classList.toggle('active');
        }
    }, 4000);  
}

// Close toast prematurely using 'X' button
toastClose.addEventListener('click', function() {
    let parent = toastClose.parentElement.parentElement;
    parent.classList.toggle('active');
}) 

// Toggle filter window
function toggleFilterContainer() {
    filterContainer.classList.toggle('active');
    const pageMask = document.querySelector('#page-mask');
    if (filterContainer.classList.contains('active')) {
        pageMask.style.background = 'rgba(0,0,0,0.3)'
        pageMask.style.height = '100vh'
    } else {
        pageMask.style.background = 'none'
        pageMask.style.height = '0vh'
    }
}

// ============================
// QUICK FILTERS
// ============================
// const quickFilterNewBtn = document.querySelector('#quick-filter-new');
// const quickFilterTrendingBtn = document.querySelector('#quick-filter-trending');

// quickFilterNewBtn.addEventListener('click', function() {
//     // Reset custom filters and set to premade filters
//     // New: Top-headlines since yesterday

//     endpoint = 'top-headlines';
//     filterSort = '';
//     filterStartDate = `&from=${getDateNDaysAgo(1)}`;
//     filterEndDate = '';
//     filterCountry = '';
//     filterSources = `&sources=${sources.toString()}`;
//     page = 1;

//     // TODO: query and quick filters cannot be used together due to endpoints
//     // Maybe remove 'Sort By' in filters then set endpoint to everything, give 'top-headlines' its own quick filter item
//     // TODO: remove class after deselected
//     quickFilterNewBtn.classList.add('selected');

//     searchBtn.click();

//     endpoint = 'everything';
// })

// quickFilterTrendingBtn.addEventListener('click', function() {
//     // Reset custom filters and set to premade filters
//     // New: Popular since 3 days ago

//     endpoint = 'top-headlines';
//     filterSort = '&sortBy=popularity';
//     filterStartDate = `&from=${getDateNDaysAgo(5)}`;
//     filterEndDate = '';
//     filterCountry = '';
//     filterSources = `&sources=${sources.toString()}`;
//     page = 1;

//     quickFilterTrendingBtn.classList.add('selected');

//     searchBtn.click();
// })

// ============================
// UTILITY METHODS
// ============================

// Remove all child nodes of a parent element.
function removeAllChildNodes(parent) {
    while (parent.firstElementChild) {
        parent.removeChild(parent.firstElementChild);
    }
}

// Get yesterday's date
function getDateNDaysAgo(daysAgo) {
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - daysAgo);

    day = (`${('0' + yesterday.getDate()).slice(-2)}`);
    month = (`${('0' + (yesterday.getMonth() + 1)).slice(-2)}`);
    year = (`${yesterday.getFullYear()}`);

    return `${year}-${month}-${day}`
}

// Return a random placeholder for the search bar
function getPlaceholder() {
    return searchPlaceholder[Math.floor(Math.random()*searchPlaceholder.length)]
}


// -----------------------
// Input Validation
// -----------------------

// Date 
function validateDate(start, end) {
    if (end != '' && start != '') {
        // Valid: Two dates available, then (end date >= start date)
        return end >= start; 
    } else {
        // Valid: only 'from' or 'to' provided
        return true;
    }
}

// Search query
function validateQuery(query) {
    // Process search query
    console.log(query);
    if (query == '') {
        return false;   // No search query provided, show toast to warn user
    } else {
        return true;    // Search query provided
    }
}

// Check if a response with results was returned (no empty responses)
function checkResponse(data) {
    try {
        if (data.articles.length > 0) {
            return true;
        } else {
            return false;
        }      
    } catch {
        return false;
    }
}

// Toggles the load bar when a request is sent
function toggleLoad() {
    // Search Bar load animation
    const load = document.querySelector('.load-animation');
    load.classList.toggle('active');

    // Load bar at bottom of page
    const loadBar = document.querySelector('.load-bar');
    loadBar.classList.toggle('active');
}






