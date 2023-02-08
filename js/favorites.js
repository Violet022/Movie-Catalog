let getFavouriteMoviesUrl = "https://react-midterm.kreosoft.space/api/favorites";
let deleteFavouriteMovieUrl = "https://react-midterm.kreosoft.space/api/favorites/";

function loadPage() {
    getUserData()
    .then((userData) => {return userData.nickName})
    .then(userName => {
        $(".navbar__link-user-nickname").text(`Авторизован как - ${userName}`);
        $(".navbar__link-logout").click(function() {
            btnLogout();
        })
    })
    .then(() => {
        loadFavoutiteMovies();
    })
    .catch((error) => {
        if(error.status == 401) {
            logoutToLoginPage()
        }
    })
}

function loadFavoutiteMovies() {
    fetch(getFavouriteMoviesUrl, {
        credentials: "same-origin",
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("SavedToken")
          }),      
    })
    .then((response) => {
        if (!response.ok) throw new MyError(response.status);
        else return response.json();
    })
    .then((json) => {
        let movies = json.movies;
        $('.fav-movies-container__movies-list').empty();
        if (movies.length != 0) {
            for (let movie of movies) {
                $newMovie = $("#fav-movie-item").clone();
                $newMovie.removeClass("d-none");
                $newMovie.find(".fav-item__name").text(movie.name);
                $newMovie.find(".fav-item__poster").attr("src", movie.poster);
                $newMovie.find(".fav-item__poster").attr("alt", movie.name);
                $newMovie.find(".fav-item__year").text(movie.year);
                $newMovie.find(".fav-item__country").text(movie.country);
                $newMovie.find(".fav-item__btn-delete").attr("data-id", movie.id);

                if (movie.genres.length != 0) {
                    let genresArray = [];
                    for (let genre of movie.genres) {
                        genresArray.push(genre.name);
                    }
                    $newMovie.find(".fav-item__genres").text(genresArray.join(", "));
                }
                else {
                    $newMovie.find(".fav-item__genres").text("Жанры не указаны");
                }
                
                if(movie.reviews.length != 0) {
                    let movieRate = 0;
                    for (rewiew of movie.reviews) {
                        movieRate += rewiew.rating;
                    }
                    movieRate /= movie.reviews.length;
                    $newMovie.find(".fav-item__rate").text("Средняя оценка - " + String(movieRate.toFixed(1)));
                }
                else {
                    $newMovie.find(".fav-item__rate").text("Нет оценок");
                }

                $('.fav-movies-container__movies-list').append($newMovie);

                $newMovie.find(".fav-item__btn-delete").click(function() {
                    let url = `${deleteFavouriteMovieUrl}${$(this).data("id")}/delete`;
                    sendRequest(url, "DELETE", {id: $(this).data("id")});
                });
            }
        }
    })
    .catch((error) => {
        if(error.status == 401) {
            logoutToLoginPage();
        }
    });
}

function sendRequest(url, method, body = null) {
    fetch (url, {
        credentials: "same-origin",
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("SavedToken")
        }),      
    })
    .then((response) => {
        if (!response.ok) throw new MyError(response.status);
    })
    .then(() => {
        loadFavoutiteMovies();
    })
    .catch((error) => {
        if(error.status == 401) {
            logoutToLoginPage();
        }
    });
}


$(document).ready(function() {
    loadPage();
})
