let loginUrl = "https://react-midterm.kreosoft.space/api/account/login";

function login() {
    let userInfo = {
        "username": String($('.entrance-form-container__login').val()),
        "password": String($('.entrance-form-container__password').val())
    };
    fetch(loginUrl, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: new Headers({
            "Content-Type": "application/json",
            "accept": "*/*"
        })      
    })
    .then((response) => {
        if (!response.ok) {
            if(response.status == 401) throw new MyError(response.status)
            else {
                error = new MyError(response.status)
                return response.json() 
                .then(result => { 
                    error.message = result.message;
                    throw error
                })   
            }
        }
        else return response.json();
    })
    .then((data) => {
        let token = data.token;
        localStorage.setItem("SavedToken", "Bearer " + token);
    })
    .then(() => window.location.pathname = "/")
    .catch((error) => {
        $('input').each(function(){
            $(this).removeClass("is-valid").addClass("is-invalid");
        })
        $('.invalid-feedback').each(function() {
            $(this).removeClass("d-none");
            $(this).text(error.message);
        })
    })
}

function clearValidationMarksOnForm(form) {
    form.find('input').each(function() {
        $(this).removeClass("is-valid").removeClass("is-invalid");
    })
    form.find('.invalid-feedback').each(function() {
        $(this).addClass("d-none");
    })
}

function validateForm(form) {
    let isValid = true;
    form.find('input').each(function() {
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
    if (validateForm(form) == false) {
        
        return false
    };

    login();
}

$(document).ready(function() {
    $('.entrance-form').on("submit", submitForm);
})


