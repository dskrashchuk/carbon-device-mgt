/**
 * Checks if provided input is valid against RegEx input.
 *
 * @param regExp Regular expression
 * @param inputString Input string to check
 * @returns {boolean} Returns true if input matches RegEx
 */
function inputIsValid(regExp, inputString) {
    regExp = new RegExp(regExp);
    return regExp.test(inputString);
}

$(document).ready(function () {
    var modalPopup = ".modal";
    // var modalPopupContainer = modalPopup + " .modal-content";
    var modalPopupContent = modalPopup + " .modal-body";

    $("#change-password").click(function () {

        $(modalPopupContent).html($('#change-password-window').html());
        showPopup();

        $("a#change-password-yes-link").click(function () {
            var oldPassword = $("#old-password").val();
            var newPassword = $("#new-password").val();
            var confirmedPassword = $("#confirmed-password").val();
            var user = $("#user").val();

            var errorMsgWrapper = "#notification-error-msg";
            var errorMsg = "#notification-error-msg span";
            if (!oldPassword) {
                $(errorMsg).text("Old password is a required field. It cannot be empty.");
                $(errorMsgWrapper).removeClass("hidden");
            } else if (!newPassword) {
                $(errorMsg).text("New password is a required field. It cannot be empty.");
                $(errorMsgWrapper).removeClass("hidden");
            } else if (!confirmedPassword) {
                $(errorMsg).text("Retyping the new password is required.");
                $(errorMsgWrapper).removeClass("hidden");
            } else if (confirmedPassword != newPassword) {
                $(errorMsg).text("New password doesn't match the confirmation.");
                $(errorMsgWrapper).removeClass("hidden");
            } else if (!inputIsValid(/^[\S]{5,30}$/, confirmedPassword)) {
                $(errorMsg).text("Password should be minimum 5 characters long, should not include any whitespaces.");
                $(errorMsgWrapper).removeClass("hidden");
            } else {
                var changePasswordFormData = {};
                //changePasswordFormData.username = user;
                changePasswordFormData.newPassword = unescape((confirmedPassword));
                changePasswordFormData.oldPassword = unescape((oldPassword));


                var changePasswordAPI = "/api/device-mgt/v1.0/users/" + user + "/credentials";

                invokerUtil.put(
                    changePasswordAPI,
                    changePasswordFormData,
                    function (data, textStatus, jqXHR) {
                        if (jqXHR.status == 200 && data) {
                            $(modalPopupContent).html($('#change-password-success-content').html());
                            $("#change-password-success-link").click(function () {
                                hidePopup();
                            });
                        }
                    }, function (jqXHR) {
                        if (jqXHR.status == 400) {
                            $(errorMsg).text("Old password does not match with the provided value.");
                            $(errorMsgWrapper).removeClass("hidden");
                        } else {
                            $(errorMsg).text("An unexpected error occurred. Please try again later.");
                            $(errorMsgWrapper).removeClass("hidden");
                        }
                    }
                );
            }

        });

        $("a#change-password-cancel-link").click(function () {
            hidePopup();
        });
    });
});