let profileInfoUrl = "https://react-midterm.kreosoft.space/api/account/profile";
let logoutUrl = "https://react-midterm.kreosoft.space/api/account/logout";

function MyError(status, message = "") {
    this.status = status;
    this.message = message 
  }
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

function getUserData() {
    return fetch(profileInfoUrl, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            "accept": "text/plain",
            "Authorization": localStorage.getItem("SavedToken")
        }) 
    })
    .then((response) => {
        if (!response.ok) throw new MyError(response.status);
        else return response.json();
    })
}

function changeNavbarToAuthorized() {
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
        if(error.status == 401) {
            logout();
        }
    })
}

function logout() {
    fetch(logoutUrl, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "accept": "*/*",
        })      
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        localStorage.setItem("SavedToken", data.token);
        $("#unauthorized-user").removeClass("d-none");
        $("#authorized-user").addClass("d-none");
    })
    .catch(error => console.error(error))
}

function logoutToLoginPage() {
    fetch(logoutUrl, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "accept": "*/*",
        })      
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        localStorage.setItem("SavedToken", data.token); 
        window.location.pathname = "/login"
    })
    .catch(error => console.error(error))
}

function btnLogout() {
    fetch(logoutUrl, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "accept": "*/*",
        })      
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        localStorage.setItem("SavedToken", data.token);
        $("#unauthorized-user").removeClass("d-none");
        $("#authorized-user").addClass("d-none");
    })
    .then(() =>  window.location.pathname = "/")
    .catch(error => console.error(error))
}