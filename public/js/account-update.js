const accountForm = document.querySelector("#editAccountForm")
accountForm.addEventListener("change", function () {
    const updateBtn = document.querySelector("input[type='submit']")
    updateBtn.removeAttribute("disabled")
})