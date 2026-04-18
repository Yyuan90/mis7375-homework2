document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("patientForm");
    const todayText = document.getElementById("todayText");
    const reviewBtn = document.getElementById("reviewBtn");
    const finalSubmitBtn = document.getElementById("finalSubmitBtn");
    const resetBtn = document.getElementById("resetBtn");
    const reviewSection = document.getElementById("reviewSection");

    // ===================== DYNAMIC DATE =====================
    const today = new Date();
    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    if (todayText) {
        todayText.textContent = today.toLocaleDateString("en-US", dateOptions);
    }

    // ===================== SLIDER =====================
    const health = document.getElementById("health");
    const healthValue = document.getElementById("healthValue");

    function getHealthText(value) {
        const v = Number(value);
        if (v <= 2) return v + " - Very Mild";
        if (v <= 4) return v + " - Mild";
        if (v <= 6) return v + " - Moderate";
        if (v <= 8) return v + " - Strong";
        return v + " - Severe";
    }

    if (health && healthValue) {
        healthValue.textContent = getHealthText(health.value);
        health.addEventListener("input", function () {
            healthValue.textContent = getHealthText(this.value);
            finalSubmitBtn.disabled = true;
        });
    }

    // ===================== HELPERS =====================
    function setError(id, message) {
        const el = document.getElementById(id);
        if (el) el.textContent = message;
    }

    function clearErrors() {
        const ids = [
            "firstNameError", "middleInitError", "lastNameError", "dobError",
            "ssnError", "emailError", "phoneError", "userIdError", "address1Error",
            "address2Error", "cityError", "stateError", "zipError", "passwordError",
            "confirmPasswordError"
        ];
        ids.forEach(id => setError(id, ""));
    }

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function validateFirstName() {
        const value = getValue("first_name");
        const pattern = /^[A-Za-z'-]{1,30}$/;
        if (!pattern.test(value)) {
            setError("firstNameError", "First name: letters, apostrophes, and dashes only.");
            return false;
        }
        return true;
    }

    function validateMiddleInit() {
        const value = getValue("middle_init");
        const pattern = /^[A-Za-z]?$/;
        if (!pattern.test(value)) {
            setError("middleInitError", "Middle initial must be one letter or blank.");
            return false;
        }
        return true;
    }

    function validateLastName() {
        const value = getValue("last_name");
        const pattern = /^[A-Za-z'-]{1,30}(?:\s?(?:2nd|3rd|4th|5th))?$/;
        if (!pattern.test(value)) {
            setError("lastNameError", "Last name allows letters, apostrophes, dashes, and optional 2nd/3rd/4th/5th.");
            return false;
        }
        return true;
    }

    function validateDob() {
        const value = getValue("dob");
        const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

        if (!pattern.test(value)) {
            setError("dobError", "Date must be in MM/DD/YYYY format.");
            return false;
        }

        const parts = value.split("/");
        const dobDate = new Date(parts[2], parts[0] - 1, parts[1]);
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (dobDate > todayOnly) {
            setError("dobError", "Date of birth cannot be in the future.");
            return false;
        }

        const minDate = new Date(todayOnly.getFullYear() - 120, todayOnly.getMonth(), todayOnly.getDate());
        if (dobDate < minDate) {
            setError("dobError", "Date of birth cannot be more than 120 years ago.");
            return false;
        }

        return true;
    }

    function validateSsn() {
        const value = getValue("ssn");
        const pattern = /^\d{9,11}$/;
        if (!pattern.test(value)) {
            setError("ssnError", "ID / SSN field must be 9 to 11 digits.");
            return false;
        }
        return true;
    }

    function validateEmail() {
        const value = getValue("email");
        const pattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
        if (!pattern.test(value)) {
            setError("emailError", "Email must be in name@domain.tld format.");
            return false;
        }
        return true;
    }

    function validatePhone() {
        const value = getValue("phone");
        const pattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!pattern.test(value)) {
            setError("phoneError", "Phone must be in 000-000-0000 format.");
            return false;
        }
        return true;
    }

    function validateAddress1() {
        const value = getValue("address1");
        if (value.length < 2 || value.length > 30) {
            setError("address1Error", "Address Line 1 must be 2 to 30 characters.");
            return false;
        }
        return true;
    }

    function validateAddress2() {
        const value = getValue("address2");
        if (value !== "" && (value.length < 2 || value.length > 30)) {
            setError("address2Error", "Address Line 2 must be 2 to 30 characters if entered.");
            return false;
        }
        return true;
    }

    function validateCity() {
        const value = getValue("city");
        if (value.length < 2 || value.length > 30) {
            setError("cityError", "City must be 2 to 30 characters.");
            return false;
        }
        return true;
    }

    function validateState() {
        const value = getValue("state");
        if (value === "") {
            setError("stateError", "Please select a state.");
            return false;
        }
        return true;
    }

    function validateZip() {
        const zipInput = document.getElementById("zip");
        let value = zipInput.value.trim();

        if (value.length > 10) {
            value = value.substring(0, 10);
            zipInput.value = value;
        }

        const pattern = /^\d{5}(-\d{4})?$/;
        if (!pattern.test(value)) {
            setError("zipError", "Zip must be 5 digits or ZIP+4 like 77006-1234.");
            return false;
        }
        return true;
    }

    function validateUserId() {
        const input = document.getElementById("user_id");
        let value = input.value.trim().toLowerCase();
        value = value.replace(/\s+/g, "");
        input.value = value;

        const pattern = /^[a-z][a-z0-9_-]{4,29}$/;
        if (!pattern.test(value)) {
            setError("userIdError", "User ID must be 5-30 chars, start with a letter, and use only letters, numbers, _ or -.");
            return false;
        }
        return true;
    }

    function validatePassword() {
        const userId = getValue("user_id").toLowerCase();
        const firstName = getValue("first_name").toLowerCase();
        const lastName = getValue("last_name").toLowerCase();
        const password = getValue("password");

        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?,.:;\/\\|{}\[\]~`]).{8,30}$/;

        if (password.includes('"') || password.includes("'")) {
            setError("passwordError", "Password cannot contain quotes.");
            return false;
        }

        if (!pattern.test(password)) {
            setError("passwordError", "Password must be 8-30 chars with uppercase, lowercase, number, and special character.");
            return false;
        }

        const pwLower = password.toLowerCase();

        if (pwLower === userId || (userId !== "" && pwLower.includes(userId))) {
            setError("passwordError", "Password cannot equal or contain your User ID.");
            return false;
        }

        if (firstName !== "" && pwLower.includes(firstName)) {
            setError("passwordError", "Password cannot contain your first name.");
            return false;
        }

        if (lastName !== "" && pwLower.includes(lastName)) {
            setError("passwordError", "Password cannot contain your last name.");
            return false;
        }

        return true;
    }

    function validateConfirmPassword() {
        const password = getValue("password");
        const confirmPassword = getValue("confirm_password");

        if (password !== confirmPassword) {
            setError("confirmPasswordError", "Passwords do not match.");
            return false;
        }
        return true;
    }

    function validateAll() {
        clearErrors();

        let ok = true;

        ok = validateFirstName() && ok;
        ok = validateMiddleInit() && ok;
        ok = validateLastName() && ok;
        ok = validateDob() && ok;
        ok = validateSsn() && ok;
        ok = validateEmail() && ok;
        ok = validatePhone() && ok;
        ok = validateAddress1() && ok;
        ok = validateAddress2() && ok;
        ok = validateCity() && ok;
        ok = validateState() && ok;
        ok = validateZip() && ok;
        ok = validateUserId() && ok;
        ok = validatePassword() && ok;
        ok = validateConfirmPassword() && ok;

        return ok;
    }

    function getCheckedValues(name) {
        const items = document.querySelectorAll(`input[name="${name}"]:checked`);
        const values = [];
        items.forEach(item => values.push(item.value));
        return values;
    }

    function getRadioValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "Not selected";
    }

    function setStatus(id, passed, errorText) {
        const el = document.getElementById(id);
        if (!el) return;

        if (passed) {
            el.textContent = "pass";
            el.className = "review-status pass";
        } else {
            el.textContent = "ERROR: " + errorText;
            el.className = "review-status error";
        }
    }

    function buildReview() {
        const first = getValue("first_name");
        const mi = getValue("middle_init");
        const last = getValue("last_name");
        const dob = getValue("dob");
        const email = getValue("email");
        const phone = getValue("phone");
        const addr1 = getValue("address1");
        const addr2 = getValue("address2");
        const city = getValue("city");
        const state = getValue("state");
        const zip = getValue("zip");
        const userId = getValue("user_id");
        const symptoms = getValue("symptoms");
        const histories = getCheckedValues("history");
        const vaccinated = getRadioValue("vaccinated");
        const insurance = getRadioValue("has_insurance");
        const healthText = getHealthText(document.getElementById("health").value);

        document.getElementById("reviewName").textContent = `${first} ${mi} ${last}`.replace(/\s+/g, " ").trim();
        document.getElementById("reviewDob").textContent = dob;
        document.getElementById("reviewEmail").textContent = email;
        document.getElementById("reviewPhone").textContent = phone;

        let addressText = addr1;
        if (addr2 !== "") addressText += "\n" + addr2;
        addressText += "\n" + city + ", " + state + " " + zip;
        document.getElementById("reviewAddress").textContent = addressText;

        document.getElementById("reviewHistory").textContent = histories.length > 0 ? histories.join(", ") : "None selected";
        document.getElementById("reviewVaccinated").textContent = vaccinated;
        document.getElementById("reviewInsurance").textContent = insurance;
        document.getElementById("reviewHealth").textContent = healthText;
        document.getElementById("reviewSymptoms").textContent = symptoms === "" ? "(blank)" : symptoms;
        document.getElementById("reviewUserId").textContent = userId;
        document.getElementById("reviewPassword").textContent = "********";

        setStatus("reviewNameStatus", validateFirstName() && validateMiddleInit() && validateLastName(), "Check name fields");
        setStatus("reviewDobStatus", validateDob(), "Invalid date");
        setStatus("reviewEmailStatus", validateEmail(), "Invalid email");
        setStatus("reviewPhoneStatus", validatePhone(), "Invalid phone");
        setStatus("reviewAddressStatus", validateAddress1() && validateCity() && validateState() && validateZip(), "Missing or invalid address/zip");
    }

    // ===================== EVENTS =====================
    reviewBtn.addEventListener("click", function () {
        const passed = validateAll();

        if (passed) {
            buildReview();
            reviewSection.classList.remove("hidden");
            finalSubmitBtn.disabled = false;
            reviewSection.scrollIntoView({ behavior: "smooth" });
        } else {
            reviewSection.classList.add("hidden");
            finalSubmitBtn.disabled = true;
            alert("Please correct the errors on the form before review.");
        }
    });

    form.addEventListener("submit", function (e) {
        const passed = validateAll();

        if (!passed || finalSubmitBtn.disabled) {
            e.preventDefault();
            alert("Please click Review Information and fix all errors before final submit.");
        }
    });

    resetBtn.addEventListener("click", function () {
        setTimeout(function () {
            clearErrors();
            reviewSection.classList.add("hidden");
            finalSubmitBtn.disabled = true;
            if (health && healthValue) {
                health.value = 5;
                healthValue.textContent = getHealthText(5);
            }
        }, 0);
    });

    // lower-case user id on blur
    const userIdInput = document.getElementById("user_id");
    userIdInput.addEventListener("blur", function () {
        this.value = this.value.trim().toLowerCase().replace(/\s+/g, "");
        finalSubmitBtn.disabled = true;
    });

    // re-check after edits
    form.querySelectorAll("input, textarea, select").forEach(function (el) {
        el.addEventListener("input", function () {
            finalSubmitBtn.disabled = true;
        });
        el.addEventListener("change", function () {
            finalSubmitBtn.disabled = true;
        });
    });
});
