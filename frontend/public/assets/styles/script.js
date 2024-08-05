document.addEventListener("DOMContentLoaded", function() {
    // Get all buttons with the class 'btn-dropdown'
    var dropdownButtons = document.getElementsByClassName("btn-dropdown");

    // Loop through each button and add the event listener
    for (var i = 0; i < dropdownButtons.length; i++) {
        dropdownButtons[i].addEventListener("click", function() {
            var dropdownContent = this.nextElementSibling;
            console.log("Button clicked, toggling dropdown"); // Debugging line
            dropdownContent.classList.toggle("dropdown-show");
            this.classList.toggle("open");
        });
    }

    function closeAllDropdowns() {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("dropdown-show");
        }

        var buttons = document.getElementsByClassName("btn-dropdown");
        for (var n = 0; n < buttons.length; n++) {
            buttons[n].classList.remove("open");
        }
    }
});

