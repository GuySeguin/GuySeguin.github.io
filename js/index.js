document.addEventListener('DOMContentLoaded', function () { 

let selectSeason;
let resultData;
let qualifyData;
let raceyData;
let driverArray = [];
let constructorArray = [];
let circuitArray = [];
//Promise Method for fetches
    function getSeasonData() {
        let raceURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season="
        let resultURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
        let qualifyURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
       
        let prom1 = fetch(raceURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}})
        let prom2 = fetch(resultURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!!")}})
        let prom3 = fetch(qualifyURL+selectSeason).then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!!!!")}})
        
        return Promise.all([prom1, prom2, prom3]);

    }
    const select = document.querySelector("#home select");
    //Event listener for season select menu
    select.addEventListener("change", (e) => {
        document.querySelector("#loading").showModal();
        selectSeason = e.target.value;
        document.querySelector("#home").style.display = "none";
        document.querySelector("#browse").style.display = "block";
       // const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php";
        
        let raceData = localStorage.getItem(`race${selectSeason}`);
        if (!raceData) {
            getSeasonData().then(data =>{
               
                browseView(data[0]);
                raceyData = data[0];
                resultData = data[1];
                qualifyData = data[2];
                
                localStorage.setItem(`race${selectSeason}`, JSON.stringify(data[0]));
                localStorage.setItem(`result${selectSeason}`, JSON.stringify(data[1]));
                localStorage.setItem(`qualify${selectSeason}`, JSON.stringify(data[2]));
                
            }).catch(e=> {
                console.log(e);
            });
        } else {
            resultData = JSON.parse(localStorage.getItem(`result${selectSeason}`));
        qualifyData = JSON.parse(localStorage.getItem(`qualify${selectSeason}`));
            raceyData = JSON.parse(raceData)
            browseView(JSON.parse(raceData));
        }
        dialListeners();
       
    //   fetch("https://randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=1").then(response => {if (response.ok) {return response.json()} else {throw new error("AAAAAAHHH!")}}).then(
      //  data => {console.log(data)}
      // ).catch( error => {"AAAAAAAHHH!"});
   })
    function browseView(data) {
        document.querySelector("#loading").close();
       
        console.log(data);
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
        td3.setAttribute("id", r.circuit.ref);
            td3.classList.add("circuit");
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
            printTop3(resultsInfo);
            resultsTable(resultsInfo);
           qualifyingTable(qualifyInfo);
           qualListeners(qualifyInfo);
           resultListeners(resultsInfo);
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
            

        } else if (e.target.nodeName == "TD" && e.target.classList.contains("circuit")) {
            //Check CircuitArray if item already cached.
            const cirquette = circuitArray.find(c => {
                if (c.ref == e.target.id) {
                    return c;
                } else {
                    return false;
                }
            })
            //Creates object if item does not exist.
            if (!cirquette) {
            let circ;
            for (let r of raceyData) {
                console.log(e.target.id)
                if (r.circuit.ref == e.target.id) {
                    circ = r;
                }
            }
            const circ2 = new Circuit(circ);
            circuitArray.push(circ2);
            displayCircuitDial(circ2.generateCard(), circ2);
        } else {
            displayCircuitDial(cirquette.generateCard(), cirquette);
        }
        }
    })}
    function qualListeners(qualifyThin) {
        document.querySelector("#qualifyingTable").addEventListener("click", (e) => {
            if (e.target && e.target.nodeName == "TH") {
                sortByPosition(qualifyThin);
                wipeClasses();
                document.querySelector("#qualifyingTable tbody").innerHTML = null;
                if (e.target.id == "qpos") {
                    sortByPosition(qualifyThin);
                    qualifyingTable(qualifyThin);
                    document.querySelector("#qpos").classList.toggle("sort");
                } else if (e.target.id == "qdriv") {
                    sortByDriver(qualifyThin);
                    qualifyingTable(qualifyThin);
                    document.querySelector("#qdriv").classList.toggle("sort");
                } else if (e.target.id == "qconst") {
                    sortByConstructor(qualifyThin);
                    qualifyingTable(qualifyThin);
                    document.querySelector("#qconst").classList.toggle("sort");
                } else if (e.target.id == "q1" || e.target.id == "q2" || e.target.id == "q3") {
                    sortByQualifier(qualifyThin);
                    qualifyingTable(qualifyThin);
                    document.querySelector(`#${e.target.id}`).classList.toggle("sort");
                }
                
            }
        })

    }
    function resultListeners(resultsThing) {
        document.querySelector("#resultTable").addEventListener("click", (e) => {
            if (e.target && e.target.nodeName == "TH") {
                sortByPosition(resultsThing);
                wipeClasses();
                document.querySelector("#resultTable tbody").innerHTML = null;
                if (e.target.id == "rpos") {
                    sortByPosition(resultsThing);
                    resultsTable(resultsThing);
                    document.querySelector("#rpos").classList.toggle("sort");
                } else if (e.target.id == "rdriv") {
                    sortByDriver(resultsThing);
                    resultsTable(resultsThing);
                    document.querySelector("#rdriv").classList.toggle("sort");
                } else if (e.target.id == "rconst") {
                    sortByConstructor(resultsThing);
                    resultsTable(resultsThing);
                    document.querySelector("#rconst").classList.toggle("sort");
                } else if (e.target.id == "laps") {
                    sortByLaps(resultsThing);
                    resultsTable(resultsThing);
                    document.querySelector(`#laps`).classList.toggle("sort");
                } else if (e.target.id == "points") {
                    sortByPoints(resultsThing);
                    resultsTable(resultsThing);
                    document.querySelector(`#points`).classList.toggle("sort");
                }
                
            }
        })
    }
    function dialListeners() {
        document.querySelector("#circuitClose").addEventListener("click", (e) => {
           document.querySelector("#circuit").close();
        })
    }


















    function displayCircuitDial(info, circ) {
        document.querySelector(".information").innerHTML = null;
        document.querySelector(".information").appendChild(info);
        document.querySelector("#circuit .dialButtons .fav").setAttribute("data-circuitid", circ.id);
        document.querySelector("#circuit").classList.add("dialog");
        document.querySelector("#circuit").showModal();
    }
    function printTop3(data) {
        sortByPosition(data);
        const div3 = document.querySelectorAll(".top3");
        div3.forEach( d => {
            d.innerHTML = null;
        })
        const first = document.createElement("h2");
        const second = document.createElement("h2");
        const third = document.createElement("h2");
        first.textContent = `${data[0].driver.forename} ${data[0].driver.surname}`;
        second.textContent =`${data[1].driver.forename} ${data[1].driver.surname}`;
        third.textContent = `${data[2].driver.forename} ${data[2].driver.surname}`;
        div3[0].appendChild(first);
        div3[1].appendChild(second);
        div3[2].appendChild(third);
    }











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
            td3.setAttribute("data-constructor", r.constructor.id);
            td2.classList.add("constructor");
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
    //Prints Ted items for the qualifying table.
    function qualifyingTable(raceyRaces) {
        const row1 = document.querySelector("#qualifyingTable tbody");
       
        for (let r of raceyRaces) {

            const nuTr = document.createElement("tr");
            nuTr.classList.add("raceRow");

            const ted1 = document.createElement("td");
            ted1.textContent = r.position;
            const ted2 = document.createElement("td");
            ted2.textContent = `${r.driver.forename} ${r.driver.surname}`;
            ted2.setAttribute("data-driver", r.driver.id);
            ted2.classList.add("driver");

            const ted3 = document.createElement("td");
            ted3.textContent = r.constructor.name;
            const ted4 = document.createElement("td");
            ted4.textContent = r.q1;
            const ted5 = document.createElement("td");
            ted5.textContent = r.q2;
            const ted6 = document.createElement("td");
            ted6.textContent = r.q3;

            nuTr.appendChild(ted1);
            nuTr.appendChild(ted2);
            nuTr.appendChild(ted3);
            nuTr.appendChild(ted4);
            nuTr.appendChild(ted5);
            nuTr.appendChild(ted6);

            row1.appendChild(nuTr);
        }

    }











    function wipeClasses() {
        const th = document.querySelectorAll("th");
        th.forEach(t => {
            
                t.className = "";
            
        })
    }
    function sortByLaps(data) {
        data.sort((a,b) => {
            if (a.laps < b.laps) {
                return -1;
            } else if (b.laps < a.laps) {
                return 1;
            }
            return 0;
        })
    }
    function sortByPoints(data) {
        data.sort((a,b) => {
            if (a.points < b.points) {
                return -1;
            } else if (b.points < a.points) {
                return 1;
            }
            return 0;
        })
    }
    function sortByQualifier(data, id) {
        if (id =="q1") {
            data.sort((a,b) => {
                if (a.q1 < b.q1) {
                    return -1;
                } else if (b.q1 < a.q1) {
                    return 1;
                }
                return 0;
            })
        } else if (id == "q2") {
            if (a.q2 < b.q2) {
                return -1;
            } else if (b.q2 < a.q2) {
                return 1;
            }
            return 0;
        } else {
            data.sort((a,b)=> {if (a.q3 < b.q3) {
                return -1;
            } else if (b.q3 < a.q3) {
                return 1;
            }
            return 0;
        })
    }
    }
    function sortByConstructor(data) {
        data.sort((a,b)=>{
            return a.constructor.name.localeCompare(b.constructor.name);
        })
        return data;
    }
    function sortByDriver(data) {
        data.sort((a,b)=>{
           
            let aName = `${a.driver.forename} ${a.driver.surname}`;
            let bName = `${b.driver.forename} ${b.driver.surname}`;
            return aName.localeCompare(bName);
        })
        return data;
    }
    function sortByPosition(data) {
       
            data.sort((a,b)=>{
                if (a.position < b.position) {
                    return -1;
                } else if (b.position < a.position) {
                    return 1;
                }
                return 0;
            })
        return data;
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













    const Constructor = class {
        constructor(con) {
            this.name = con.name;
            this.id = con.id;
            this.nationality = con.nationality;
            this.ref = con.ref;
    
        }
        //Finish this!!!!!!!!!!!!!!!!!
        generateCard() {
            const seasonRes = resultData.filter(r => {
                if (r.driver.id == this.id) {
                    return r;
                }
            })
    
        }
       }
    const Circuit = class {
        constructor(cir) {
            this.name = cir.circuit.name;
            this.id = cir.circuit.id;
            this.country = cir.circuit.country;
            this.ref = cir.circuit.ref;
            this.url = cir.circuit.url;
            this.location = cir.circuit.location;
            this.lat = cir.circuit.lat;
            this.lng = cir.circuit.lng;
    
        }
        //Finish this!!!!!!!!!!!!!!!!!
        generateCard() {
            const h3 = document.createElement("h3");
            h3.textContent = this.name;
            let place = `Location: ${this.location}, ${this.country}, at Latitude: ${this.lat} and Longitude: ${this.lng}`
            const text = document.createTextNode(place);
            const a = document.createElement("a");
            a.setAttribute("href", this.url);
            a.textContent = "Circuit Website";
            const p = document.createElement("p");
            p.appendChild(h3);
            p.appendChild(text);
            p.appendChild(a);
           return p;
    
        }
       }
   const Driver = class {
    constructor(driv) {
        this.name = `${driv.forename} ${driv.surname}`;
        this.id = driv.id;
        this.nationality = driv.nationality;
        this.ref = driv.ref;

    }
    //Finish this!!!!!!!!!!!!!!!!!
    generateCard() {
        const seasonRes = resultData.filter(r => {
            if (r.driver.id == this.id) {
                return r;
            }
        })


    }
   }

