// ==============================
// GLOBAL VARIABLES
// ==============================

// -----------------------
// API Key
// -----------------------
const apiKey = 'c1e2d1f5ad7e406391f916de7f829d78'

// -----------------------
// Selectors
// -----------------------
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
let filterSort = '';
let filterLang = '';
let filterStartDate = '';
let filterEndDate = '';
let filterCountry = '';

// ==============================
// EVENTS
// ==============================

// -----------------------
// Click
// -----------------------

// Open hamburger menu
hamburger.addEventListener('click', function() {
    menu.classList.toggle('active');
});

// Open filter menu
filterToggleBtn.addEventListener('click', function() {
    filterContainer.classList.toggle('active');
});

// Close filter menu
filterCloseBtn.addEventListener('click', function() {
    filterContainer.classList.toggle('active');
});

// Change filter tags
const tagContainer = document.querySelector('.filter-tag-container')

searchBtn.addEventListener('click', function() {
    // Clear all tags
    removeAllChildNodes(tagContainer);

    // Add tags
    let queryTag = document.createElement('p');
    let sortTag = document.createElement('p');
    let langTag = document.createElement('p');
    let dateStartTag = document.createElement('p');
    let dateEndTag = document.createElement('p');
    let countryTag = document.createElement('p');

    let j;

    // Query
    queryTag.textContent = searchQuery.value;
    queryTag.classList.add('custom-filter')
    tagContainer.appendChild(queryTag);

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

    // let array = [sortField, langField];
    // console.log(array)

    // for (j = 0; j < array.length; j++) {
    //     console.log(array[j].childElementCount);
    // }
})


// ==============================
// FETCH NEWS FROM API
// ==============================

// Create news items (stories) from API call response
function createNewsItem(data) {
    data.articles.forEach(article => {
        // Story parent
        let story = document.createElement('article');
        story.classList.add('news-item');

        // Image
        let img = document.createElement('img');
        img.setAttribute('src', article.urlToImage);
        img.setAttribute('alt', 'image');

        // Title
        let title = document.createElement('a');
        title.setAttribute('href', article.url);
        title.setAttribute('target', '_blank');
        title.textContent = article.title;

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
    })
}

// Call API and fetch news upon user search
function fetchNews() {
    // Search query provided by user
    let query = searchQuery.value;

    // Process search query
    if (query == '') {
        toggleToastEmptySearch();   // No search query provided, show toast to warn user
    } else {
        query = `?q='${query}'`;    // Search query provided
    }

    // Remove error messages
    // TODO: improve code quality here
    const noResultsError = document.querySelector('.no-results-container');
    noResultsError.style.display = 'none';

    // Remove previous stories
    removeAllChildNodes(newsContainer);

    // Call API
    fetch(`https://newsapi.org/v2/${endpoint}?q=${searchQuery.value}${filterSort}${filterLang}${filterStartDate}${filterEndDate}${filterCountry}&apiKey=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            try {
                newsContainer.style.display = 'grid'; // Load news container
                createNewsItem(data);   // Create news items (stories)
            } catch(e) {
                newsContainer.style.display = 'none'; // Hide news container
                noResultsError.style.display = 'flex';  // Show no results error page
            }
        })

    // Clear search input
    searchQuery.value = '';
}

// Fetch on button press
searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    fetchNews() ;
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
        }       
    } else {
        // All is selected
        if ((countryNotice.classList.contains('notice-active'))) {
            // If notice is active, deactivate it
            countryNotice.classList.toggle('notice-active');
            filterForm.classList.toggle('notice-active');
            filterContainer.classList.toggle('notice-active');
        }  
    }
})

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
    if (filterCountry !== '') {
        endpoint = 'top-headlines';
    }

    // Close filter window
    filterContainer.classList.toggle('active');

    // TODO: add toast
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

// Close toast prematurely using 'X' button
toastClose.addEventListener('click', function() {
    let parent = toastClose.parentElement.parentElement;
    parent.classList.toggle('active');
}) 

// ============================
// UTILITY METHODS
// ============================

// Remove all child nodes of a parent element.
function removeAllChildNodes(parent) {
    while (parent.firstElementChild) {
        console.log(parent.firstElementChild);
        parent.removeChild(parent.firstElementChild);
    }
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


