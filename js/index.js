document.addEventListener('DOMContentLoaded', function () { 
    const select = document.querySelector("#home select");
    select.addEventListener("change", () => {
        alert(select.value);
        document.querySelector("#home").style.display = "none";
        document.querySelector("#browse").style.display = "block";

    })





}
)