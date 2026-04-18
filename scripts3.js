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

    // ===================== VALIDATION FUNCTIONS =====================
    function validateFirstName() {
        const value = getValue("first_name");
        const pattern = /^[A-Za-z'-]{1,30}$/;
        if (!pattern.test(value)) {
            setError("firstNameError", "First name: letters, apostrophes, and dashes only.");
            return false;
        }
        setError("firstNameError", "");
        return true;
    }

    function validateMiddleInit() {
        const value = getValue("middle_init");
        const pattern = /^[A-Za-z]?$/;
        if (!pattern.test(value)) {
            setError("middleInitError", "Middle initial must be one letter or blank.");
            return false;
        }
        setError("middleInitError", "");
        return true;
    }

    function validateLastName() {
        const value = getValue("last_name");
        const pattern = /^[A-Za-z'-]{1,30}$/;
        if (!pattern.test(value)) {
            setError("lastNameError", "Last name: letters, apostrophes, and dashes only.");
            return false;
        }
        setError("lastNameError", "");
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

        setError("dobError", "");
        return true;
    }

    function formatSsnInput() {
        const ssnInput = document.getElementById("ssn");
        let value = ssnInput.value.replace(/\D/g, "").substring(0, 9);

        if (value.length > 5) {
            value = value.substring(0, 3) + "-" + value.substring(3, 5) + "-" + value.substring(5);
        } else if (value.length > 3) {
            value = value.substring(0, 3) + "-" + value.substring(3);
        }

        ssnInput.value = value;
    }

    function validateSsn() {
        const value = getValue("ssn");
        const pattern = /^\d{3}-\d{2}-\d{4}$/;
        if (!pattern.test(value)) {
            setError("ssnError", "ID / SSN must be in 999-99-9999 format.");
            return false;
        }
        setError("ssnError", "");
        return true;
    }

    function validateEmail() {
        const input = document.getElementById("email");
        input.value = input.value.trim().toLowerCase();

        const value = input.value;
        const pattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
        if (!pattern.test(value)) {
            setError("emailError", "Email must be in name@domain.tld format.");
            return false;
        }
        setError("emailError", "");
        return true;
    }

    function validatePhone() {
        const value = getValue("phone");
        const pattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!pattern.test(value)) {
            setError("phoneError", "Phone must be in 000-000-0000 format.");
            return false;
        }
        setError("phoneError", "");
        return true;
    }

    function validateAddress1() {
        const value = getValue("address1");
        if (value.length < 2 || value.length > 30) {
            setError("address1Error", "Address Line 1 must be 2 to 30 characters.");
            return false;
        }
        setError("address1Error", "");
        return true;
    }

    function validateAddress2() {
        const value = getValue("address2");
        if (value !== "" && (value.length < 2 || value.length > 30)) {
            setError("address2Error", "Address Line 2 must be 2 to 30 characters if entered.");
            return false;
        }
        setError("address2Error", "");
        return true;
    }

    function validateCity() {
        const value = getValue("city");
        if (value.length < 2 || value.length > 30) {
            setError("cityError", "City must be 2 to 30 characters.");
            return false;
        }
        setError("cityError", "");
        return true;
    }

    function validateState() {
        const value = getValue("state");
        if (value === "") {
            setError("stateError", "Please select a state.");
            return false;
        }
        setError("stateError", "");
        return true;
    }

    function validateZip() {
        const zipInput = document.getElementById("zip");
        let value = zipInput.value.trim();

        if (value.length > 10) {
            value = value.substring(0, 10);
            zipInput.value = value;
        }

        const pattern = /^\d{5}$/;
        if (!pattern.test(value)) {
            setError("zipError", "Zip must be exactly 5 digits.");
            return false;
        }
        setError("zipError", "");
        return true;
    }

    function validateUserId() {
        const input = document.getElementById("user_id");
        let value = input.value.trim().toLowerCase();
        value = value.replace(/\s+/g, "");
        input.value = value;

        const pattern = /^[a-z][a-z0-9_-]{4,19}$/;
        if (!pattern.test(value)) {
            setError("userIdError", "User ID must be 5-20 chars, start with a letter, and use only letters, numbers, _ or -.");
            return false;
        }
        setError("userIdError", "");
        return true;
    }

    function validatePassword() {
        const userId = getValue("user_id").toLowerCase();
        const password = getValue("password");

        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;

        if (!pattern.test(password)) {
            setError("passwordError", "Password must be 8-30 chars and include uppercase, lowercase, and a number.");
            return false;
        }

        const pwLower = password.toLowerCase();
        if (pwLower === userId) {
            setError("passwordError", "Password cannot equal your User ID.");
            return false;
        }

        setError("passwordError", "");
        return true;
    }

    function validateConfirmPassword() {
        const password = getValue("password");
        const confirmPassword = getValue("confirm_password");

        if (password !== confirmPassword) {
            setError("confirmPasswordError", "Passwords do not match.");
            return false;
        }
        setError("confirmPasswordError", "");
        return true;
    }

    function validateAll() {
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
        setStatus("reviewAddressStatus", validateAddress1() && validateCity() && validateState() && validateZip(), "Missing or invalid address");
    }

    // ===================== LIVE EVENTS =====================
    document.getElementById("first_name").addEventListener("input", validateFirstName);
    document.getElementById("first_name").addEventListener("blur", validateFirstName);

    document.getElementById("middle_init").addEventListener("input", validateMiddleInit);
    document.getElementById("middle_init").addEventListener("blur", validateMiddleInit);

    document.getElementById("last_name").addEventListener("input", validateLastName);
    document.getElementById("last_name").addEventListener("blur", validateLastName);

    document.getElementById("dob").addEventListener("input", validateDob);
    document.getElementById("dob").addEventListener("blur", validateDob);

    document.getElementById("ssn").addEventListener("input", function () {
        formatSsnInput();
        validateSsn();
    });
    document.getElementById("ssn").addEventListener("blur", validateSsn);

    document.getElementById("email").addEventListener("input", validateEmail);
    document.getElementById("email").addEventListener("blur", validateEmail);

    document.getElementById("phone").addEventListener("input", validatePhone);
    document.getElementById("phone").addEventListener("blur", validatePhone);

    document.getElementById("address1").addEventListener("input", validateAddress1);
    document.getElementById("address1").addEventListener("blur", validateAddress1);

    document.getElementById("address2").addEventListener("input", validateAddress2);
    document.getElementById("address2").addEventListener("blur", validateAddress2);

    document.getElementById("city").addEventListener("input", validateCity);
    document.getElementById("city").addEventListener("blur", validateCity);

    document.getElementById("state").addEventListener("change", validateState);

    document.getElementById("zip").addEventListener("input", validateZip);
    document.getElementById("zip").addEventListener("blur", validateZip);

    document.getElementById("user_id").addEventListener("input", validateUserId);
    document.getElementById("user_id").addEventListener("blur", validateUserId);

    document.getElementById("password").addEventListener("input", function () {
        validatePassword();
        validateConfirmPassword();
    });
    document.getElementById("password").addEventListener("blur", validatePassword);

    document.getElementById("confirm_password").addEventListener("input", validateConfirmPassword);
    document.getElementById("confirm_password").addEventListener("blur", validateConfirmPassword);

    // ===================== BUTTON EVENTS =====================
    reviewBtn.addEventListener("click", function () {
        const passed = validateAll();

        if (passed) {
            buildReview();
            reviewSection.classList.remove("hidden");
            finalSubmitBtn.disabled = false;
            reviewBtn.textContent = "VALIDATE";
            reviewSection.scrollIntoView({ behavior: "smooth" });
        } else {
            reviewSection.classList.add("hidden");
            finalSubmitBtn.disabled = true;
            alert("Please correct the errors on the form before submit.");
        }
    });

    form.addEventListener("submit", function (e) {
        const passed = validateAll();

        if (!passed || finalSubmitBtn.disabled) {
            e.preventDefault();
            alert("Please click VALIDATE and fix all errors before final submit.");
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
});
