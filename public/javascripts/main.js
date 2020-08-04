/*
 * Name: Thales Barros Fajardo Valente
 * Student ID: 200400698
 * Date: 07/06/2020
 * 
 * Description: Creation of the javaScript file that makes sure the post is deleted
 */

$(document).ready(function () {
    $('.deleteForm').on('submit', function (e) {
        var currentForm = $(this).parent().parent();
        e.preventDefault();
        var result = confirm("Want to delete?");
        if (result) {
            $.ajax({
                type: 'POST',
                url: '/delete/' + $(this).attr('id'),
                success: function (data) {
                    currentForm.fadeOut();
                    setTimeout(function () {
                        alert(data.success);
                    }, 3000);
                }
            });
        }
        else {
            return false;
        }
    });
});