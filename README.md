# NewsPortal

[logo](./assets/images/logo.png)

## About
NewsPortal is a web application that collects online news articles from a variety of reputable sources and displays them all in one infinite scrolling webpage. Each article is presented as a card that displays important information such as article title, description, and publisher in a standardised format for easy reading. Each article is linked to the publisher's domain, so users just need to click on an article to read more. Searches can be can customised by providing specific search queries and filtering the results returned.

At writing, the developer is a 2nd year university student. The purpose of creating NewsPortal was to learn the basics of API requests and front-end web development in a self-learning environment, as preparation for future university modules. NewsPortal was created using JavaScript, HTML, CSS and [NewsAPI](https://newsapi.org/).

## Preview

#### Homepage of NewsPortal
![homepage](./assets/homepage.png)

#### An example search
![searchquery](./assets/searchquery.png)

#### An example search using a different language (German shown)
![language](./assets/language.png)

#### Filter menu
![searchfilter](./assets/searchfilter.png)

![dropdown](./assets/dropdown.png)

#### How articles are displayed
![cards](./assets/cards.png)

#### Hovering over an article allows user to read more
![hover](./assets/cardhover.png)

#### Click "See More" to show more articles on the same page (if available)
![seemore](./assets/seemore.png)

#### A successful search returns the amount of articles found
![toast](./assets/toast.png)

#### An unsuccessful search displays an error message
![error](./assets/error.png)

#### Previous versions of NewsPortal (previously called Content Digest)

##### Verson 1
![v1](./assets/newsportal_v1.png)

##### Version 2
![v2](./assets/newsportal_v2.png)

![v3](./assets/newsportal_v3.jpg)

## Use Instructions

<details>
<summary>
**IMPORTANT**: Python must be installed in your system for NewsPortal to work. (Why?)
</summary>
Since NewsPortal is a personal project, it is not hosted a server (which requires payment). The NewsPortal launcher requires Python to start a local HTTP server so that the application can be hosted on your local device. 

Note that opening _index.html_ does not work either, since the free version of NewsAPI used in this project requires the GET requests to come from a defined _localhost_ server. The free version of NewsAPI does not allow cross-domain requests.

</details>

#### Follow these steps carefully to start using NewsPortal:

1. Download the latest version of Python [here](https://www.python.org/downloads/) for your system.
2. Click on the downloaded fiel and follow the Python installation instructions.
3. At the top of [this repository page](https://github.com/carsnl/NewsPortal/), click **Code** > **Download ZIP**.
4. Unzip the downloaded file.
5. Click **launch.bat** to start the application. A browser tab will be opened.
6. That's it!

## Additional Information


