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
        data = sortByRound(data);

        raceTable(data);
    }

    function raceTable(data) {
        
        const row1 = document.querySelector("#raceTable");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.textContent = "Race ID";
        th1.setAttribute("id", "raceid");
        const th2 = document.createElement("th");
        th2.textContent = "Race Name";
        th2.setAttribute("id", "rName");
    const th3 = document.createElement("th");
        th3.textContent = "Circuit";
        th3.setAttribute("id", "rCircuit");
        const th4 = document.createElement("th");
        th4.textContent = "Date";
        th4.setAttribute("id", "rDate");
        const th5 = document.createElement("th");
        th5.textContent = "Round";
        th5.setAttribute("id", "rRound");
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
            nuTr.classList.add("raceRow");
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
            } else if (e.target.nodeName=="TH") {
                
                if (e.target.id=="raceid") {
                   
                   row1.innerHTML = null;
                    sortByID(data);
                    raceTable(data);
                  document.querySelector("#raceid").classList.add("sort");

                } else if (e.target.id == "rName") {
                    
                    row1.innerHTML = null;
                    sortByName(data);
                    raceTable(data);
                    document.querySelector("#rName").classList.add("sort");

                } else if (e.target.id == "rCircuit") {
                    
                    row1.innerHTML = null;
                    sortByCircuit(data);
                    raceTable(data);
                    document.querySelector("#rCircuit").classList.add("sort");

                } else if (e.target.id == "rDate") {
                    
                    row1.innerHTML = null;
                    sortByDate(data);
                    raceTable(data);
                    document.querySelector("#rDate").classList.add("sort");

                } else if (e.target.id == "rRound") {
                    
                    row1.innerHTML = null;
                    sortByRound(data);
                    raceTable(data);
                    document.querySelector("#rRound").classList.add("sort");

                }
                

            }
        })

    }
    
    
    function sortByName(data) {
        data.sort((a,b)=>{
            return a.name.localeCompare(b.name);
        })
        return data;
    }
    function sortByDate(data) {
        data.sort((a,b)=>{
            return a.date.localeCompare(b.date);
        })
    }
    function sortByCircuit(data) {
        data.sort((a,b)=>{
            return a.circuit.name.localeCompare(b.circuit.name);
        })
    }
    function sortByID(data) {
        data.sort((a,b)=>{
            if (a.id < b.id) {
                return -1;
            } else if (b.id < a.id) {
                return 1;
            }
            return 0;
        })
        
    }
    function sortByRound(data) {
        data.sort((a,b)=>{
            if (a.round < b.round) {
                return -1;
            } else if (b.round < a.round) {
                return 1;
            }
            return 0;
        })
        return data;
    }

    })
   

