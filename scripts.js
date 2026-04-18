document.addEventListener("DOMContentLoaded", function () {
    // dynamic date
    const todayText = document.getElementById("todayText");
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    if (todayText) {
        todayText.textContent = today.toLocaleDateString("en-US", options);
    }

    // slider value
    const slider = document.getElementById("health");
    const output = document.getElementById("healthValue");

    if (slider && output) {
        output.textContent = slider.value;
        slider.oninput = function () {
            output.textContent = this.value;
        };
    }

    // form validation
    const form = document.getElementById("patientForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            let hasError = false;

            const userId = document.getElementById("user_id").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm_password").value;

            const passwordError = document.getElementById("passwordError");
            const confirmPasswordError = document.getElementById("confirmPasswordError");

            // clear old messages
            passwordError.textContent = "";
            confirmPasswordError.textContent = "";

            // password rule:
            // at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/;

            if (!passwordPattern.test(password)) {
                passwordError.textContent = "Password must be 8-30 characters and include uppercase, lowercase, number, and special character.";
                hasError = true;
            }

            if (password === userId) {
                passwordError.textContent = "Password cannot be the same as User ID.";
                hasError = true;
            }

            if (confirmPassword !== password) {
                confirmPasswordError.textContent = "Passwords do not match.";
                hasError = true;
            }

            if (hasError) {
                e.preventDefault();
            }
        });
    }
});
