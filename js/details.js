let getDetailsAboutMovie = "https://react-midterm.kreosoft.space/api/movies/details/";
let addToFavoritesUrl = "https://react-midterm.kreosoft.space/api/favorites/";
let getFavouriteMoviesUrl = "https://react-midterm.kreosoft.space/api/favorites";
let movieReviewUrl = "https://react-midterm.kreosoft.space/api/movie/";
let movieId;

function getMovieDetails(id) {
    changeNavbarToAuthorized();

    fetch(getDetailsAboutMovie + id, {
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
    .then((data) => {
        fetch(getFavouriteMoviesUrl, {
            credentials: "same-origin",
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("SavedToken")
              }),      
        })
        .then((response) => {
            if (!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then((json) => {
            let movieInFavouritesList = false;
            let movies = json.movies;
            if (movies.length != 0) {
                for (let movie of movies) {
                    if (movie.name == data.name) {
                        movieInFavouritesList = true;
                        break;
                    }
                }
            }
            return movieInFavouritesList;
        })
        .then((checkResult) => {
            if(checkResult != undefined && checkResult == false) {
                $(".about-movie__btn-add").removeClass("d-none");
                $(".about-movie__btn-add").attr("data-id", data.id);
                $(".about-movie__btn-add").click(function() {
                    let url = `${addToFavoritesUrl}${$(this).data("id")}/add`;
                    $(".about-movie__btn-add").addClass("d-none");
                    sendRequest(url, "POST", {id: $(this).data("id")})
                })
            }
        })
        .catch((error) => {
            if(error == "Error: 401") {
                logout();
            }
        });
        return data;
    })
    .then((data) => {
        getUserData()
        .then((userData) => {return userData.nickName})
        .then((userName => {
            let userReview;
            let userHasRewiew = false;
            $(".user-reviews-container").empty();
            if (data.reviews.length != 0) {
                let reviews = data.reviews;
                for(review of reviews) {
                    if(review.author != null && review.author.nickName == userName) {
                        userHasRewiew = true;
                        userReview = review;
                    }
                }
                if (userHasRewiew) {
                    $newReview = $("#movie-review-authorized").clone();
                    $newReview.removeClass('d-none');
                    let commentView = userReview.rating > 5 ? "success" : "danger";
                    $newReview.addClass(`border-${commentView}`);
                    $newReview.find(".movie-review-card__comment-text").addClass(`text-${commentView}`);
                    $newReview.find(".date-info__rate").addClass(`bg-${commentView}`);
                    $newReview.find(".user-info__author").text(`${userName} (Мой отзыв)`);

                    if (userReview.author != null && userReview.author.avatar != "") {
                        $newReview.find(".user-info__avatar").attr("src", userReview.author.avatar);
                    }
        
                    $newReview.find(".date-info__rate").text(userReview.rating);
                    $newReview.find(".date-info__date").text(getFormattedDate(userReview.createDateTime)); 
                    $newReview.find(".movie-review-card__comment-text").text(userReview.reviewText);

                    $newReview.find(".movie-review-card__delete-btn").click(function() {
                        sendRequest(`${movieReviewUrl}${data.id}/review/${userReview.id}/delete`, "DELETE");
                    })

                    $newReview.find(".movie-review-card__edit-btn").click(function() {
                        $(".user-reviews-container").empty();
                        $("#movie-review-edit-form").removeClass("d-none");
                        $(".user-reviews-container").append($("#movie-review-edit-form"));
                        $("#movie-review-edit-form").find(".review-info__text").val(userReview.reviewText);
                        $("#movie-review-edit-form").find(".review-info__rate > option[value=" + userReview.rating + "]").attr("selected","selected")
                        $("#movie-review-edit-form").find(".review-info__is-anonymous").prop('checked', userReview.isAnonymous); 
                        $("#movie-review-edit-form").find(".review-info__edit-btn").click(function(e) {
                            e.preventDefault();
                            let commentInfo = {
                                reviewText: $("#movie-review-edit-form").find(".review-info__text").val(),
                                rating: Number($("#movie-review-edit-form").find(".review-info__rate").val()),
                                isAnonymous: $("#movie-review-edit-form").find(".review-info__is-anonymous").is(":checked")
                            }
                            sendRequest(`${movieReviewUrl}${data.id}/review/${userReview.id}/edit`, "PUT", commentInfo);
                        })
                    })

                    $(".user-reviews-container").append($newReview);
                    let userReviewIndex = data.reviews.indexOf(userReview);
                    data.reviews.splice(userReviewIndex, 1);
                }
                else {
                    $("#movie-review-add-form").removeClass("d-none");
                    $(".user-reviews-container").append($("#movie-review-add-form"))
                    $("#movie-review-add-form").find(".review-info__save-btn").click(function() {
                        let commentInfo = {
                            reviewText: $("#movie-review-add-form").find(".review-info__text").val(),
                            rating: Number($("#movie-review-add-form").find(".review-info__rate").val()),
                            isAnonymous: $("#movie-review-add-form").find(".review-info__is-anonymous").is(":checked")
                        }
                        sendRequest(`${movieReviewUrl}${data.id}/review/add`, "POST", commentInfo);
                    })
                }
            }
            else {
                $("#movie-review-add-form").removeClass("d-none");
                $(".user-reviews-container").append($("#movie-review-add-form"))
                $("#movie-review-add-form").find(".review-info__save-btn").click(function() {
                    let commentInfo = {
                        reviewText: $("#movie-review-add-form").find(".review-info__text").val(),
                        rating: Number($("#movie-review-add-form").find(".review-info__rate").val()),
                        isAnonymous: $("#movie-review-add-form").find(".review-info__is-anonymous").is(":checked")
                    }
                    sendRequest(`${movieReviewUrl}${data.id}/review/add`, "POST", commentInfo);
                })
            }
        }))
        .catch((error) => {
            if(error == "Error: 401") {
                logout();
            }
        })
        return data;
    }) 
    .then((movieInfo) => {
        $(".movie-info__poster").attr("src", movieInfo.poster);
        $(".movie-info__poster").attr("alt", movieInfo.name);
        $(".about-movie__name").text(`${movieInfo.name} (${movieInfo.year})`);
        $(".about-movie__description").text(innerInfo(movieInfo.description));
        $(".detail-info__year").text(innerInfo(movieInfo.year));
        $(".detail-info__country").text(innerInfo(movieInfo.country));
        if (movieInfo.genres.length != 0) {
            let genresArray = [];
            for (let genre of movieInfo.genres) {
                genresArray.push(genre.name);
            }
            $(".detail-info__genres").text(genresArray.join(", "));
        }
        else {
            $(".detail-info__genres").text("Жанры не указаны");
        }
        $(".detail-info__time").text(innerInfo(movieInfo.time));
        $(".detail-info__tagLine").text(`«${innerInfo(movieInfo.tagline)}»`);
        $(".detail-info__director").text(innerInfo(movieInfo.director));
        $(".detail-info__budget").text(`$${(innerInfo(movieInfo.budget)).toLocaleString('ru')}`);
        $(".detail-info__fees").text(`$${(innerInfo(movieInfo.fees)).toLocaleString('ru')}`);
        $(".detail-info__ageLimit").text(`${innerInfo(movieInfo.ageLimit)}+`);

        if (movieInfo.reviews.length != 0) {
            let reviews = movieInfo.reviews;
            let avatarPathRegex = new RegExp('https?:\/\/.*');
            
            let userNameLinkString = $('.navbar__link-user-nickname').text() == "" ? "" : $('.navbar__link-user-nickname').text();
            let userName = "";
            if (userNameLinkString != "") {
                userNameLinkString = userNameLinkString.split(" ");
                userName = userNameLinkString[userNameLinkString.length - 1];
            }

            $('.movie-reviews-container').empty();
            for(review of reviews) {
                if (userName != "" && review.author.nickName == userName && review.author != null) continue;
                $newReview = $("#movie-review").clone();
                $newReview.removeClass('d-none');
                let commentView = review.rating > 5 ? "success" : "danger";
                $newReview.addClass(`border-${commentView}`);
                $newReview.find(".movie-review-card__comment-text").addClass(`text-${commentView}`);
                $newReview.find(".date-info__rate").addClass(`bg-${commentView}`);

                if (review.isAnonymous == true || review.author == null) {
                    $newReview.find(".user-info__author").text("Анонимный пользователь");
                }
                else {
                    $newReview.find(".user-info__author").text(review.author.nickName);
                }

                if (review.author != null && review.author.avatar != null && review.author.avatar != "" && review.author.avatar.match(avatarPathRegex) != null) {
                    $newReview.find(".user-info__avatar").attr("src", review.author.avatar);
                }

                $newReview.find(".date-info__rate").text(review.rating);
                $newReview.find(".date-info__date").text(getFormattedDate(review.createDateTime)); 
                $newReview.find(".movie-review-card__comment-text").text(review.reviewText);

                $('.movie-reviews-container').append($newReview);
            }
        }
    })
    .catch(error => console.error(error));
}

function getFormattedDate(datetime) {
    var date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '.' + month + '.' + year;
}

function innerInfo(infoPiece) {
    if(infoPiece == null || infoPiece == "")
        return "-";
    else
        return infoPiece;
}

function sendRequest(url, method, body) {
    fetch (url, {
        credentials: "same-origin",
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("SavedToken")
        }),      
    })
    .then(() => {
        getMovieDetails(movieId);
    })
    .catch(error => console.error(error));
}


$(document).ready(function() {
    let pathName = window.location.pathname;
    movieId = pathName.substring(3);
    getMovieDetails(movieId);
})
