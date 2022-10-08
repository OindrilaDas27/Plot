// This index.js file is for making the drop-down functionality

for (let i = 0; i < 3; i++) {
  document
    .getElementsByClassName("fa-chevron-circle-down")
    [i].addEventListener("click", function () {
      if (i == 2) {
        document.getElementsByClassName("options")[i].style.display = "flex";
      } else document.getElementsByClassName("options")[i].style.display = "block";

      document.getElementsByClassName("fa-chevron-circle-down")[
        i
      ].style.display = "none";
      document.getElementsByClassName("fa-minus-circle")[i].style.display =
        "inline";
    });
}
for (let i = 0; i < 3; i++) {
  document
    .getElementsByClassName("fa-minus-circle")
    [i].addEventListener("click", function () {
      document.getElementsByClassName("options")[i].style.display = "none";
      document.getElementsByClassName("fa-minus-circle")[i].style.display =
        "none";
      document.getElementsByClassName("fa-chevron-circle-down")[
        i
      ].style.display = "inline";
    });
}
