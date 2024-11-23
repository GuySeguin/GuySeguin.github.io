document.addEventListener('DOMContentLoaded', function () { 
    const select = document.querySelector("#home select");
    select.addEventListener("change", () => {
        document.querySelector("#home").style.display = "none";
        document.querySelector("#browse").style.display = "block";
        const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php";
       fetch(url+"?season="+select.value).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}}).then(
        data => {browseView(data)}
       ).catch( error => {"AAAAAAAHHH!"});
    })
    function browseView(data) {
        console.log(data);
        raceTable(data);
    }

    function raceTable(data) {
        const row1 = document.querySelector("#raceTable");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.textContent = "Race ID";
        const th2 = document.createElement("th");
        th2.textContent = "Race Name";
    const th3 = document.createElement("th");
        th3.textContent = "Circuit";
        const th4 = document.createElement("th");
        th4.textContent = "Date";
        const th5 = document.createElement("th");
        th5.textContent = "Round";
    const th6 = document.createElement("th");
        th6.textContent = "URL";
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        tr.appendChild(th6);
        row1.appendChild(tr);

        for (let r of data) {
            const nuTr = document.createElement("tr");
            const td1 = document.createElement("td");
        td1.textContent = r.id;
        const td2 = document.createElement("td");
        td2.textContent = r.name;
    const td3 = document.createElement("td");
        td3.textContent = r.circuit.name;
        const td4 = document.createElement("td");
        td4.textContent = r.date;
        const td5 = document.createElement("td");
        td5.textContent = r.round;
    const td6 = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute("href", r.url);
    a.textContent = "Website";

        td6.appendChild(a);
        nuTr.appendChild(td1);
        nuTr.appendChild(td2);
        nuTr.appendChild(td3);
        nuTr.appendChild(td4);
        nuTr.appendChild(td5);
        nuTr.appendChild(td6);
        const td7 = document.createElement("button");
        td7.setAttribute("id", r.id);
        td7.textContent = "Results";
        nuTr.appendChild(td7);
        row1.appendChild(nuTr);
        }
        row1.addEventListener("click", (e)=> {
            if (e.target.nodeName=="BUTTON") {
                resultsTable(e.target.id);
            }
        })

    }
    function resultsTable(id) {
        console.log(id);
    }


}
)