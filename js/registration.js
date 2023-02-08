let registrationUrl = "https://react-midterm.kreosoft.space/api/account/register";

function makeFormattedDate(date) {
    let dataComponents = (date.split(".")).reverse();
    let dateToReturn = new Date(dataComponents[0], dataComponents[1] - 1, dataComponents[2]);
    let datewithOffset = new Date(dateToReturn.setTime(dateToReturn.getTime() - dateToReturn.getTimezoneOffset() * 60 * 1000));
    return datewithOffset.toISOString();
}

function register() {
    let userInformation = {
        userName: String($('.registration-form-container__login').val()),
        name: String($('.registration-form-container__name').val()),
        password: String($('.registration-form-container__password').val()),
        email: String($('.registration-form-container__email').val()),
        birthDate: $(".registration-form-container__birth-date").val() == "" ? "" : makeFormattedDate($(".registration-form-container__birth-date").val()),
        gender: $(".registration-form-container__sex").val() == "Женщина" ? 0 : 1 
    }
    fetch (registrationUrl, {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(userInformation),
        headers: new Headers({
            "Content-Type": "application/json",
        }),      
    })
    .then((response) => {
        if (!response.ok) {
            error = new MyError(response.status)
            return response.json()
            .then(result => {
                error.body = result.errors;
                throw error
            })
        }
        else return response.json();
    })
    .then(() => window.location.pathname = "/")
    .catch((error) => {
        let errorType = Object.keys(error.body)[0];
        let inputs, message, feedbacks = [];
        if(errorType == "DuplicateUserName"){
            inputs = $('#inputLogin');
            message = error.body.DuplicateUserName.errors[0].errorMessage;
        }
        else if(errorType == "PasswordTooShort") {
            inputs = $("input[type='password']");
            message = error.body.PasswordTooShort.errors[0].errorMessage;
        }
        inputs.each(function() {
            $(this).removeClass("is-valid").addClass("is-invalid");
            feedbacks.push($(`#${$(this).attr("aria-describedby")}`))
        })
        feedbacks.forEach(function(feedback, i ,feedbacks) {
            feedback.removeClass("d-none");
            feedback.text(message)
        })
    });
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
    let passwordVal = $(".registration-form-container__password").val();
    let passwordCheckVal = $(".registration-form-container__password-check").val();
    if(passwordVal != passwordCheckVal) {
        $("#checkingInputPassword").removeClass("is-valid").addClass("is-invalid");
        $("#password-check-validation-feedback").removeClass("d-none").text("Пароль и его подтверждение не совпадают. Повторите ввод.");
        isValid = false;
    }
    return isValid;
}

function submitForm(e) {
    e.preventDefault();

    let form = $(this);
    clearValidationMarksOnForm(form)
    if (validateForm(form) == false) return false

    register();
}

$(document).ready(function() {
    $('.registration-form').on("submit", submitForm);

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

    $('#inputBirthDate').datepicker({
        language: 'ru',
        orientation: 'bottom left',
        todayHighlight: true
    });
})

