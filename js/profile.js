let getOrPutUserInfoUrl = "https://react-midterm.kreosoft.space/api/account/profile";

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
        getProfile();
    })
    .catch((error) => {
        if(error.status == 401) {
            logoutToLoginPage();
        }
    })
}

function getProfile() {
    fetch(getOrPutUserInfoUrl, {
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
    .then((profileData) => {
        console.log(profileData);
        if (profileData.avatarLink != null && profileData.avatarLink != "") {
            $(".avatar-image").attr("src", profileData.avatarLink);
            $(".user-info__avatar-link").val(profileData.avatarLink);
        }
        $(".avatar-image").attr("alt", profileData.nickName);
        $(".user-info__nickname").text(profileData.nickName);
        $(".user-info__nickname").attr("data-id", profileData.id);
        $(".user-info__email").val(profileData.email);
        $(".user-info__name").val(profileData.name);
        $(".user-info__birth-date").val(getFormattedDate(profileData.birthDate));
        $(".user-info__sex > option[data-gender=" + profileData.gender + "]").attr("selected","selected");
        return profileData;
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
        getProfile();
    })
    .catch((error) => {
        if(error.status == 401) {
            logoutToLoginPage();
        }
    });
}

function getFormattedDate(datetime) {
    var date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '.' + month + '.' + year;
}

function makeFormattedDate(date) {
    let dataComponents = (date.split(".")).reverse();
    let dateToReturn = new Date(dataComponents[0], dataComponents[1] - 1, dataComponents[2]);
    let datewithOffset = new Date(dateToReturn.setTime(dateToReturn.getTime() - dateToReturn.getTimezoneOffset() * 60 * 1000));
    return datewithOffset.toISOString();
}

function clearValidationMarksOnForm(form) {
    form.find('.required-input').each(function() {
        $(this).removeClass("is-valid").removeClass("is-invalid");
    })
    form.find('.invalid-feedback').each(function() {
        $(this).addClass("d-none");
    })
}

function validateForm(form) {
    let isValid = true;
    form.find('.required-input').each(function() {
        let val = $(this).val();
        if (val.length == 0) {
            $(this).removeClass("is-valid").addClass("is-invalid");
            let labelText = $(this).parents('.form-group').find('label').text().toLowerCase();
            let feedback = $(`#${$(this).attr("aria-describedby")}`);
            feedback.removeClass("d-none");
            feedback.text(`Введите ${labelText}`);
            isValid = false;
        }
        else {
            $(this).removeClass("is-invalid").addClass("is-valid");
        }
    })
    return isValid;
}

function submitForm(e) {
    e.preventDefault();

    let form = $(this);
    clearValidationMarksOnForm(form)
    if (validateForm(form) == false) return false

    let userEditedInfo = {
        id: $(".user-info__nickname").data("id"),
        nickName: $(".user-info__nickname").text(),
        email: $(".user-info__email").val(),
        avatarLink: $(".user-info__avatar-link").val(),
        name: $(".user-info__name").val(),
        birthDate: makeFormattedDate($(".user-info__birth-date").val()),
        gender: $(".user-info__sex").val() == "Женщина" ? 0 : 1
    }
    clearValidationMarksOnForm(form)
    sendRequest(getOrPutUserInfoUrl, "PUT", userEditedInfo);
}

$(document).ready(function() {
    $('.profile-form').on("submit", submitForm);
    loadPage();
    $.fn.datepicker.dates['ru'] = {
        days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
        daysShort: ["Пон", "Вт", "Ср", "Чет", "Пят", "Суб", "Вск"],
        daysMin: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthsShort: ["Яев", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        today: "Сегодня",
        clear: "Clear",
        format: "dd.mm.yyyy",
        titleFormat: "MM yyyy",
        weekStart: 0
    };

    $('#userBirthDate').datepicker({
        language: 'ru',
        orientation: 'bottom left',
        todayHighlight: true
    });
})