function updateSliderValue(value) {
    document.getElementById("slider-value").value = value + "%";
}

function updateSlider(value) {
    let numericValue = value.replace("%", "");
    if (numericValue > 400) numericValue = 400;
    if (numericValue < 1) numericValue = 1;
    document.getElementById("scale-slider").value = numericValue;
    document.getElementById("slider-value").value = numericValue + "%";
}

document.getElementById("slider-value").addEventListener("input", function () {
    let value = this.value.replace("%", "");
    if (value > 400) value = 400;
    if (value < 1) value = 1;
    updateSlider(value);
});

function increaseSlider() {
    let slider = document.getElementById('scale-slider');
    let newValue = parseInt(slider.value, 10) + 1;
    if (newValue <= 400) {
        slider.value = newValue;
        updateSliderValue(newValue);
    }
}

function decreaseSlider() {
    let slider = document.getElementById('scale-slider');
    let newValue = parseInt(slider.value, 10) - 1;
    if (newValue >= 1) {
        slider.value = newValue;
        updateSliderValue(newValue);
    }
}