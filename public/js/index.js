const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (e) => {
  const cityName = document.getElementById("cityName").value;
  if (cityName.trim() == "") {
    e.preventDefault();
    alert("please enter city name");
  }
});
