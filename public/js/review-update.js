const form = document.querySelector("#reviewEditForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("input[type='submit']")
    updateBtn.removeAttribute("disabled")
})