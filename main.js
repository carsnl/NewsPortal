// Variables
const apiKey = 'c1e2d1f5ad7e406391f916de7f829d78'
const menu = document.querySelector(".menu-container");
const hamburger = document.querySelector(".collapsed-menu")
const searchQuery = document.querySelector(".search-query")
const searchBtn = document.querySelector(".search-btn")
const newsContainer = document.querySelector(".news-container")

// Media query for menu @ (width: 190px)
let menuChildren = document.querySelector('.menu-container').children;

// ============================
// Click Events
// ============================

// Open hamburger menu
hamburger.addEventListener('click', function() {
    menu.classList.toggle('active');
});

// TEMP: fetch posts
searchBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    let query = searchQuery.value;

    if (query != '') {
        fetch(`https://newsapi.org/v2/everything?q=${searchQuery.value}&apiKey=${apiKey}`)
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

                    // Date
                    let date = document.createElement('h5')
                    date.textContent = article.publishedAt.slice(0,10);

                    story.appendChild(img);
                    story.appendChild(a);
                    story.appendChild(desc);
                    story.appendChild(source);
                    story.appendChild(date);
                    newsContainer.appendChild(story);
                })
            })
    } else {
        alert('Please provide a topic')
    }
    

    // Clear search field
    searchQuery.value = '';
})
