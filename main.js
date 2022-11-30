// Variables
const apiKey = 'c1e2d1f5ad7e406391f916de7f829d78'
const menu = document.querySelector(".menu-container");
const hamburger = document.querySelector(".collapsed-menu")
const searchQuery = document.querySelector(".search-query")
const searchBtn = document.querySelector(".search-btn")
const newsContainer = document.querySelector(".news-container")

// Global variables
let filterLang = '';

// Filter
const filterContainer = document.querySelector(".filter-container")
const filterToggleBtn = document.querySelector(".filter-btn")
const filterApplyBtn = document.querySelector(".filter-apply-btn")
const filterCloseBtn = document.querySelector(".filter-close-btn")

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

// TEMP: fetch posts
searchBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    let query = searchQuery.value;

    if (query != '') {
        // Remove previous stories
        removeAllChildNodes(newsContainer);

        console.log(`https://newsapi.org/v2/everything?q=${searchQuery.value}${filterLang}&apiKey=${apiKey}`)

        fetch(`https://newsapi.org/v2/everything?q=${searchQuery.value}${filterLang}&apiKey=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
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

                    newsContainer.appendChild(story);
                })
            })
    } else {
        toggleToastEmptySearch();
    }
    

    // Clear search field
    searchQuery.value = '';
})

// ============================
// Toast Notifications
// ============================

function toggleToastEmptySearch() {
    toastEmptySearch.classList.toggle('active');
    setTimeout(() => {
        // Check if toast was previously closed
        if (toastEmptySearch.classList.contains('active')) {
            toastEmptySearch.classList.toggle('active');
        }
    }, 3500);
}

toastClose.addEventListener('click', function() {
    let parent = toastClose.parentElement.parentElement;
    parent.classList.toggle('active');
}) 

// Filter apply button
filterApplyBtn.addEventListener('click', function() {
    // Selected language and assign to global variable
    filterLang = (document.getElementById('language').value).toString();

    filterContainer.classList.toggle('active');

    // TODO: add toast
}) 

// ============================
// Utility Functions
// ============================

// Remove all child nodes of a parent element. Used when new search query provided.
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(newsContainer.firstChild);
    }
}
    

