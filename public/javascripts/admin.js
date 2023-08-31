const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector("#options-dropdown");

dropdownButton.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", function (event) {
  if (!dropdownButton.contains(event.target)) {
    dropdownContent.style.display = "none";
  }
});

const selectBranch = document.querySelector("#branch");
const submitButton = document.querySelector("#filter");

selectBranch.addEventListener("change", function () {
  submitButton.click();
});
