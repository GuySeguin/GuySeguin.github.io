document.addEventListener('DOMContentLoaded', function () { 
    const select = document.querySelector("#home select");
    select.addEventListener("change", () => {
        alert(select.value);
        document.querySelector("#home").style.display = "none";
        document.querySelector("#browse").style.display = "block";
        const testData = [
            {raceId:1, name:"test", circuit:23},
            {raceId:2, name:"test", circuit:23},
            {raceId:3, name:"test", circuit:23},
            {raceId:4, name:"test", circuit:23}
        ]
        browseView(testData);
    })
    function browseView(data) {
        console.log("YAAAAY");
        raceTable(data);
    }

    function raceTable(testData) {
        const row1 = document.querySelector("#raceTable");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.textContent = "Race ID";
        const th2 = document.createElement("th");
        th2.textContent = "Race Name";
    const th3 = document.createElement("th");
        th3.textContent = "Circuit ID";
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        row1.appendChild(tr);

        for (let r of testData) {
            const nuTr = document.createElement("tr");
            const td1 = document.createElement("td");
        td1.textContent = r.raceId;
        const td2 = document.createElement("td");
        td2.textContent = r.name;
    const td3 = document.createElement("td");
        td3.textContent = r.circuit;
        nuTr.appendChild(td1);
        nuTr.appendChild(td2);
        nuTr.appendChild(td3);
        const td4 = document.createElement("button");
        td4.setAttribute("id", r.raceId);
        td4.textContent = "Results";
        nuTr.appendChild(td4);
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