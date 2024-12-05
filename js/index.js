document.addEventListener('DOMContentLoaded', function () { 

let selectSeason;
let resultData;
let qualifyData;
//Promise Method for fetches
    function getSeasonData() {
        let raceURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season="
        let resultURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
        let qualifyURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
       
        let prom1 = fetch(raceURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}})
        let prom2 = fetch(resultURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}})
        let prom3 = fetch(qualifyURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}})
        console.log(selectSeason);
        return Promise.all([prom1, prom2, prom3]);

    }
    const select = document.querySelector("#home select");
    //Event listener for season select menu
    select.addEventListener("change", (e) => {
        selectSeason = e.target.value;
        document.querySelector("#home").style.display = "none";
        document.querySelector("#browse").style.display = "block";
        const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php";
        
        let raceData = localStorage.getItem(`race${selectSeason}`);
        if (!raceData) {
            getSeasonData().then(data =>{
                console.log(data)
                browseView(data[0]);
                resultData = data[1];
                qualifyData = data[2];
                console.log(resultData)
                localStorage.setItem(`race${selectSeason}`, JSON.stringify(data[0]));
                localStorage.setItem(`result${selectSeason}`, JSON.stringify(data[1]));
                localStorage.setItem(`qualify${selectSeason}`, JSON.stringify(data[2]));
                
            }).catch(e=> {
                console.log(e);
            });
        } else {
            resultData = JSON.parse(localStorage.getItem(`result${selectSeason}`));
        qualifyData = JSON.parse(localStorage.getItem(`qualify${selectSeason}`));
       
            browseView(JSON.parse(raceData));
        }
       
    //   fetch("https://randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=1").then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}}).then(
      //  data => {console.log(data)}
      // ).catch( error => {"AAAAAAAHHH!"});
   })
    function browseView(data) {
        console.log(resultData); 
        console.log(qualifyData);

        data = sortByRound(data);

        raceTable(data);
        listeners(data);
    }

    function raceTable(data) {
        
        const row1 = document.querySelector("#raceTable tbody");
       
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
        

    }
    function listeners(data) {
    document.querySelector("#raceTable").addEventListener("click", (e)=> {
        if (e.target.nodeName=="BUTTON") {
            document.querySelector("#resultTable tbody").innerHTML = null;
            document.querySelector("#raceResults").style.display = "block";
            document.querySelector("#qualifyingTable tbody").innerHTML = null;
            const resultsInfo = resultData.filter(r => {
                if (r.race.id == e.target.id) {
                    return r;
                }
            })
            const qualifyInfo = qualifyData.filter(q => {
                if (q.race.id == e.target.id) {
                    return q;
                }
            })
            
            resultsTable(resultsInfo);
           qualifyingTable(qualifyInfo);
        } else if (e.target.nodeName=="TH") {
            wipeClasses();
            if (e.target.id=="raceid") {
               
               document.querySelector("#raceTable tbody").innerHTML = null;
                sortByID(data);
                raceTable(data);
              document.querySelector("#raceid").classList.toggle("sort");

            } else if (e.target.id == "rName") {
                
                document.querySelector("#raceTable tbody").innerHTML = null;
                sortByName(data);
                raceTable(data);
                document.querySelector("#rName").classList.toggle("sort");

            } else if (e.target.id == "rCircuit") {
                
                document.querySelector("#raceTable tbody").innerHTML = null;
                sortByCircuit(data);
                raceTable(data);
                document.querySelector("#rCircuit").classList.toggle("sort");

            } else if (e.target.id == "rDate") {
                
                document.querySelector("#raceTable tbody").innerHTML = null;
                sortByDate(data);
                raceTable(data);
                document.querySelector("#rDate").classList.toggle("sort");

            } else if (e.target.id == "rRound") {
                
                document.querySelector("#raceTable tbody").innerHTML = null;
                sortByRound(data);
                raceTable(data);
                document.querySelector("#rRound").classList.toggle("sort");

            }
            

        }
    })}
    function resultsTable(raceResults) {
        const row1 = document.querySelector("#resultTable tbody");
       
        for (let r of raceResults) {

            const nuTr = document.createElement("tr");
            nuTr.classList.add("raceRow");

            const td1 = document.createElement("td");
            td1.textContent = r.position;
            const td2 = document.createElement("td");
            td2.textContent = `${r.driver.forename} ${r.driver.surname}`;
            td2.setAttribute("data-driver", r.driver.id);
            td2.classList.add("driver");

            const td3 = document.createElement("td");
            td3.textContent = r.constructor.name;
            const td4 = document.createElement("td");
            td4.textContent = r.laps;
            const td5 = document.createElement("td");
            td5.textContent = r.points;
   
            nuTr.appendChild(td1);
            nuTr.appendChild(td2);
            nuTr.appendChild(td3);
            nuTr.appendChild(td4);
            nuTr.appendChild(td5);
       
            row1.appendChild(nuTr);
        }
    }
    function qualifyingTable(raceyRaces) {
        const row1 = document.querySelector("#qualifyingTable tbody");
       
        for (let r of raceyRaces) {

            const nuTr = document.createElement("tr");
            nuTr.classList.add("raceRow");

            const td1 = document.createElement("td");
            td1.textContent = r.position;
            const td2 = document.createElement("td");
            td2.textContent = `${r.driver.forename} ${r.driver.surname}`;
            td2.setAttribute("data-driver", r.driver.id);
            td2.classList.add("driver");

            const td3 = document.createElement("td");
            td3.textContent = r.constructor.name;
            const td4 = document.createElement("td");
            td4.textContent = r.laps;
            const td5 = document.createElement("td");
            td5.textContent = r.points;
            const td6 = document.createElement("td");
            td6.textContent = r.points;

            nuTr.appendChild(td1);
            nuTr.appendChild(td2);
            nuTr.appendChild(td3);
            nuTr.appendChild(td4);
            nuTr.appendChild(td5);
            nuTr.appendChild(td6);

            row1.appendChild(nuTr);
        }

    }
    function wipeClasses() {
        const th = document.querySelectorAll("th");
        th.forEach(t => {
            
                t.className = "";
            
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
   

