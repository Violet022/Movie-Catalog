let getMoviesOnPage = "https://react-midterm.kreosoft.space/api/movies/";

function loadNavbar() {
    getUserData()
    .then((userData) => {return userData.nickName})
    .then(userName => {
        $("#authorized-user").removeClass("d-none");
        $("#unauthorized-user").addClass("d-none");
        $(".navbar__link-user-nickname").text(`Авторизован как - ${userName}`);
        $(".navbar__link-logout").click(function() {
            logout();
        })
    })
    .catch((error) => {
        if(error == "Error: 401") {
            logout()
        }
    })
}

function loadMovies(pageNumber) {
    fetch(getMoviesOnPage + pageNumber, {
        credentials: "same-origin",
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json"
          }),      
    })
    .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
    })
    .then((json) => {
        let movies = json.movies;
        $('.movies-container__movies-list').empty();
        if (movies.length != 0) {
            for (let movie of movies) {
                $newMovie = $("#movie-item").clone();
                $newMovie.removeClass("d-none");
                // $newMovie.find(".movie-item__details-link").attr("href", `/movie/${movie.id}`);
                $newMovie.find(".movie-item__details-link").attr("href", `/id${movie.id}`);
                $newMovie.find(".movie-item__name").text(movie.name);
                $newMovie.find(".movie-item__poster").attr("src", movie.poster);
                $newMovie.find(".movie-item__poster").attr("alt", movie.name);
                $newMovie.find(".movie-item__year").text(movie.year);
                $newMovie.find(".movie-item__country").text(movie.country);

                if (movie.genres.length != 0) {
                    let genresArray = [];
                    for (let genre of movie.genres) {
                        genresArray.push(genre.name);
                    }
                    $newMovie.find(".movie-item__genres").text(genresArray.join(", "));
                }
                else {
                    $newMovie.find(".movie-item__genres").text("Жанры не указаны");
                }
                
                if(movie.reviews.length != 0) {
                    let movieRate = 0;
                    for (rewiew of movie.reviews) {
                        movieRate += rewiew.rating;
                    }
                    movieRate /= movie.reviews.length;
                    $newMovie.find(".movie-item__rate").text("Средняя оценка - " + String(movieRate.toFixed(1)));
                    $newMovie.find(".movie-item__rate").addClass("bg-primary");
                }
                else {
                    $newMovie.find(".movie-item__rate").text("Нет оценок");
                    $newMovie.find(".movie-item__rate").addClass("bg-light");
                    $newMovie.find(".movie-item__rate").addClass("text-dark");
                }

                $('.movies-container__movies-list').append($newMovie);
            }
        }

        let pageInfo = json.pageInfo;
        $('.pagination').empty();
        $paginationPrevItem = $("#pagination__previous-item").clone();
        $paginationPrevItem.removeClass('d-none');
        if (pageNumber != 1) $paginationPrevItem.find('.page-link').attr('href', `/${String(Number(pageNumber) - 1)}`);
        $('.pagination').append($paginationPrevItem);

        if (pageInfo.pageCount.length != 0) {
            for (let i = 1; i <= pageInfo.pageCount; i++) {
                $paginationItem = $("#pagination__item").clone();
                $paginationItem.removeClass('d-none');
                $paginationItem.find('.page-link').attr('href', `/${i}`);
                $paginationItem.find(".page-link").text(String(i));
                if (i == pageInfo.currentPage) {
                    $paginationItem.addClass("active");
                }
                $('.pagination').append($paginationItem);
            }
        }
        
        $paginationNextItem = $("#pagination__next-item").clone();
        $paginationNextItem.removeClass('d-none');
        if(pageNumber != pageInfo.pageCount) $paginationNextItem.find('.page-link').attr('href', `/${String(Number(pageNumber) + 1)}`);
        $('.pagination').append($paginationNextItem);

    })
    .catch((error) => {
        if(error == "Error: 401") {
            logout("../pages/entrance.html");
        }
    });
}


$(document).ready(function() {
    let pathName = window.location.pathname;
    let pageNum = (pathName == "/") ? 1 : pathName[pathName.length - 1];
    loadNavbar();
    loadMovies(pageNum);
})
