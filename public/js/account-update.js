const accountForm = document.querySelector("#editAccountForm")
accountForm.addEventListener("change", function () {
    const updateBtn = document.querySelector("input[type='submit']")
    updateBtn.removeAttribute("disabled")
})

const passForm = document.querySelector("#editPasswordForm")
passForm.addEventListener("change", function () {
    const updateBtn = document.querySelector("input[type='submit']")
    updateBtn.removeAttribute("disabled")
})