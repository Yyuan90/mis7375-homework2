document.addEventListener("DOMContentLoaded", function () {
    // dynamic date
    const todayText = document.getElementById("todayText");
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    todayText.textContent = today.toLocaleDateString("en-US", options);

    // slider value
    const slider = document.getElementById("health");
    const output = document.getElementById("healthValue");

    if (slider && output) {
        output.textContent = slider.value;
        slider.oninput = function () {
            output.textContent = this.value;
        };
    }
});
