// Variables
const apiKey = 'c1e2d1f5ad7e406391f916de7f829d78'
const menu = document.querySelector(".menu-container");
const hamburger = document.querySelector(".collapsed-menu")
const searchQuery = document.querySelector(".search-query")
const searchBtn = document.querySelector(".search-btn")
const pageContent = document.querySelector(".page-content")
const newsContainer = document.querySelector(".news-container")
const newsStory = document.querySelectorAll(".news-item")

// Global variables
let endpoint = 'everything';
let filterSort = '';
let filterLang = '';
let filterStartDate = '';
let filterEndDate = '';
let filterCountry = '';

// Filter
const filterContainer = document.querySelector(".filter-container");
const filterToggleBtn = document.querySelector(".filter-btn");
const filterApplyBtn = document.querySelector(".filter-apply-btn");
const filterCloseBtn = document.querySelector(".filter-close-btn");
const filterCountryInput = document.querySelector("#country");

// Toast
const toastEmptySearch = document.querySelector(".toast-empty-search");
const toastClose = document.querySelector(".toast-close");

// Media query for menu @ (width: 190px)
let menuChildren = document.querySelector('.menu-container').children;

// ============================
// Click Events
// ============================

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

// // Change filter tags
// const tagContainer = document.querySelector('.filter-tag-container')

// searchBtn.addEventListener('click', function() {
//     // Clear all tags
//     removeAllChildNodes(tagContainer);

//     // Add tags
//     let sort = document.createElement('p');
//     let lang = document.createElement('p');
//     let dateStart = document.createElement('p');
//     let dateEnd = document.createElement('p');
//     let country = document.createElement('p');

//     sort.textContent = `${filterSort}`
//     console.log(`${filterSort}`)
//     sort.classList.add('default-filter')
//     tagContainer.appendChild(sort);

//     lang.textContent = `${filterLang}`
//     lang.classList.add('default-filter')
//     tagContainer.appendChild(lang);

//     dateStart.textContent = `${filterStartDate}`
//     dateStart.classList.add('default-filter')
//     tagContainer.appendChild(dateStart);

//     dateEnd.textContent = `${filterEndDate}`
//     dateEnd.classList.add('default-filter')
//     tagContainer.appendChild(dateEnd);

//     country.textContent = `${filterCountry}`
//     country.classList.add('default-filter')
//     tagContainer.appendChild(country);
// })

function createNewsItem(data) {
    data.articles.forEach(article => {
        // <article class="news-item">
        //     <img src="" alt="">
        //     <h3></h3>
        //     <p></p>
        // </article>
        let story = document.createElement('article');
        story.classList.add('news-item')
        // Story image
        let img = document.createElement('img')
        img.setAttribute('src', article.urlToImage)
        img.setAttribute('alt', 'image')

        // Story title
        let a = document.createElement('a');
        a.setAttribute('href', article.url);
        a.setAttribute('target', '_blank')
        a.textContent = article.title;

        // Story description
        let desc = document.createElement('p');
        desc.textContent = article.description;

        // Source
        let source = document.createElement('h5')
        source.textContent = article.source.name;
        source.classList.add('news-source')

        // Date
        let date = document.createElement('h5')
        date.textContent = article.publishedAt.slice(0,10);
        date.classList.add('news-date')

        // Read more button
        let readMoreBtn = document.createElement('a')
        readMoreBtn.innerText = 'Read More'

        readMoreBtn.setAttribute('href', article.url);
        readMoreBtn.setAttribute('target', '_blank');

        readMoreBtn.classList.add('read-more-btn')

        // Story content (image, title, description)
        let content = document.createElement('div')
        content.classList.add('story-content')
        content.appendChild(img);
        content.appendChild(a);
        content.appendChild(desc);


        // Story footer (source and date)
        let footer = document.createElement('div')
        footer.classList.add('story-footer')
        footer.appendChild(source);
        footer.appendChild(date);

        // Append story to news-container
        story.appendChild(content);
        story.appendChild(footer);
        story.appendChild(readMoreBtn);

        // Mouseover event for 'Read More' button
        story.addEventListener('mouseover', function() {
            readMoreBtn.classList.toggle('active');
        })
        story.addEventListener('mouseout', function() {
            readMoreBtn.classList.toggle('active');
        })

        newsContainer.appendChild(story);

    })
}
// TEMP: fetch posts
searchBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    let query = searchQuery.value;

    if (query == '') {
        toggleToastEmptySearch();
    } else {
        // Search query provided
        query = `?q=${query}`
    }

    // Remove previous stories
    removeAllChildNodes(newsContainer);

    // Remove error messages
    // TODO: improve code quality here
    const noResultsError = document.querySelector('.no-results-container');
    noResultsError.style.display = 'none';

    console.log(`https://newsapi.org/v2/${endpoint}${query}${filterSort}${filterLang}${filterStartDate}${filterEndDate}${filterCountry}&apiKey=${apiKey}`)

    fetch(`https://newsapi.org/v2/${endpoint}?q=${searchQuery.value}${filterSort}${filterLang}${filterStartDate}${filterEndDate}${filterCountry}&apiKey=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            try {
                createNewsItem(data);
            } catch(e) {
                noResultsError.style.display = 'flex';
            }
            
            // If no results, show no results error page
            // const noResultsError = document.querySelector('.no-results-container');
            // console.log(noResultsError);
            // console.log(newsContainer.childElementCount)
            // if (newsContainer.childElementCount === 0){
            //     console.log('showing')
            //     noResultsError.style.display = 'flex';
            // } else if (newsContainer.childElementCount > 0 && noResultsError.classList.contains('show')) {
            //     console.log('hiding')
            //     noResultsError.style.display = 'none';
            // }
        })

    // Clear search field
    searchQuery.value = '';
})

// ============================
// Input Events
// ============================

// Detect if user has selected a specific country
filterCountryInput.addEventListener('input', function(e) {
    let countryNotice = document.querySelector('.country-select-notice');
    let filterForm = document.querySelector('.filter-drop-down-container');

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

// ============================
// Scroll Events
// ============================

let scrollToTopBtn = document.getElementById('scroll-to-top-btn')

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

// Event listeners
window.addEventListener('scroll', showScrollToTopBtn);
scrollToTopBtn.addEventListener('click', scrollToTop);

// ============================
// Toast Notifications
// ============================

function toggleToastEmptySearch() {
    if (filterCountry == ''){
        toastEmptySearch.classList.toggle('active');
        setTimeout(() => {
            // Check if toast was previously closed
            if (toastEmptySearch.classList.contains('active')) {
                toastEmptySearch.classList.toggle('active');
            }
        }, 3500);
    }    
}

toastClose.addEventListener('click', function() {
    let parent = toastClose.parentElement.parentElement;
    parent.classList.toggle('active');
}) 

// Filter apply button
filterApplyBtn.addEventListener('click', function() {
    // Sort
    filterSort = (document.getElementById('sort').value).toString();

    // Selected language and assign to global variable
    filterLang = (document.getElementById('language').value).toString();

    // Date
    const localStartDate = (document.querySelector("#start-date")).value;
    const localEndDate = (document.querySelector("#end-date")).value;

    if (validateDate(localStartDate, localEndDate)) {
        if (localStartDate != '') {
            filterStartDate = `&from=${localStartDate}`;
        }
        if (localEndDate != '') {
            filterEndDate = `&to=${localEndDate}`;
        }   
    } else {
        alert('Check dates.')
    }

    // Country
    filterCountry = (document.getElementById('country').value).toString();

    // If a specific country selected (not all)
    // News API does not support 'everything' endpoint for specific countries
    if (filterCountry !== '') {
        endpoint = 'top-headlines';
    }

    filterContainer.classList.toggle('active');

    // TODO: add toast
}) 

// ============================
// Utility Functions
// ============================

// Remove all child nodes of a parent element. Used when new search query provided.
function removeAllChildNodes(parent) {
    while (parent.firstElementChild) {
        console.log(parent.firstElementChild);
        parent.removeChild(parent.firstElementChild);
    }
}

// Date input validation
function validateDate(start, end) {
    // End date >= start date
    // Two dates available
    if (end != '' && start != '') {
        return end >= start;
    } else {
        // Only 'from' or 'to' provided
        return true
    }
}
    

