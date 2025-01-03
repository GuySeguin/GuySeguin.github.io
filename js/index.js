document.addEventListener('DOMContentLoaded', function () { 

    //Function wide variables
    let selectSeason;
    let resultData;
    let qualifyData;
    let raceyData;
    let driverArray = [];
    let constructorArray = [];
    let circuitArray = [];
    let favCircuit = [];
    let favDriver = [];
    let favConstructor = [];
    let currentRace;

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
        document.querySelector("#browse").style.display = "inline";
        
        //Fetching Favourites from storage if present.
        if (JSON.parse(localStorage.getItem("favCircuit"))) {

        favCircuit = JSON.parse(localStorage.getItem("favCircuit"));
        
        }

        if (JSON.parse(localStorage.getItem("favConstructor"))) {

        favConstructor = JSON.parse(localStorage.getItem("favConstructor"));
        
        }

        if (JSON.parse(localStorage.getItem("favDriver"))) {

        favDriver = JSON.parse(localStorage.getItem("favDriver"));
        
        }
        updateFavourites();
        
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
       
    
   })
    function browseView(data) {

        document.querySelector("#loading").close();
       
    
        data = sortByRound(data);

        raceTable(data);
        listeners(data);
    }

    //Printing Race data to table
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
   
    if (favCircuit.find( res => res.ref == r.circuit.ref)) {
        td3.textContent = r.circuit.name + " " + String.fromCodePoint("0x2764");
    } else {
        td3.textContent = r.circuit.name;
    }
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

        const td7 = document.createElement("td");
        const td8 = document.createElement("button");
        td8.setAttribute("id", r.id);
        td8.textContent = "Results";
        td7.appendChild(td8);
        nuTr.appendChild(td7);
        row1.appendChild(nuTr);
        }
        

    }






    //Sort and button listeners for the raceTable
    function listeners(data) {
    document.querySelector("#raceTable").addEventListener("click", (e)=> {
        if (e.target.nodeName=="BUTTON") {
            document.querySelector("#hide").style.display = "block";
            document.querySelector("#resultTable tbody").innerHTML = null;
            document.querySelector("#raceResults").style.display = "inline-flex";
            document.querySelector("#qualifyingTable tbody").innerHTML = null;
            currentRace = e.target.id;

            const raceItem = raceyData.find( r => {

                if (r.id == e.target.id) {
                    return r;
                }
            })
            
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
            printRaceInfo(raceItem);
            printTop3(resultsInfo);
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
            

        } else if (e.target.nodeName == "TD" && e.target.classList.contains("circuit")) {

            circuitPopUp(e.target.id);
        }
    })}
    
    //Event handler for qualify table
        document.querySelector("#qualifyingTable").addEventListener("click", (e) => {

            const qualifyThin = qualifyData.filter(q => {

                if (q.race.id == currentRace) {
                    return q;
                }
            })
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
        }   else if (e.target.nodeName == "TD" && e.target.classList.contains("driver")) {
            
               driverPopUp(e.target.id);

            } else if (e.target.nodeName == "TD" && e.target.classList.contains("constructor")) {
               
                constructorPopUp(e.target.id);
             }
        })

    
    function circuitPopUp(id) {
        //Check CircuitArray if item already cached.
        let cirquette;
        for (let c of circuitArray) {

            if (c.ref == id) {
                cirquette = c;
            }
        }
        //Creates object if item does not exist.
        if (!cirquette) {

        let circ;
        for (let r of raceyData) {
           
            if (r.circuit.ref == id) {
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
    function constructorPopUp(id) {

        let con;
        
        for (let c of constructorArray) {

             if (c.ref == id) {
                        con = c;
            }
        }
        //Creates new Constructor object if item does not exist.
        if (!con) {
                
            for (let r of resultData) {
    
                if (r.constructor.ref == id) {
                        con = r;
                }
            }

            const con2 = new Constructor(con);
            constructorArray.push(con2);
            displayConstructorDial(con2.generateCard(), con2);

        } else {

            displayConstructorDial(con.generateCard(), con);
        }
    }
    function driverPopUp(id) {

        let driver;
        
        for (let d of driverArray) {

             if (d.ref == id) {
                        driver = d;
                     
            }
        }
        //Creates object if item does not exist.
        if (!driver) {
                
            for (let r of resultData) {
             
                if (r.driver.ref == id) {
                        driver = r;
                }
            }
            const driver2 = new Driver(driver);
            driverArray.push(driver2);
            displayDriverDial(driver2.generateCard(), driver2);
        } else {

            displayDriverDial(driver.generateCard(), driver);
        }
       
    }
    
        //Event handler for result table. 
        document.querySelector("#resultTable").addEventListener("click", (e) => {

            const resultsThing = resultData.filter(r => {

                if (r.race.id == currentRace) {
                    return r;
                }
            })
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
            }  else if (e.target.nodeName == "TD" && e.target.classList.contains("driver")) {

                driverPopUp(e.target.id);
               

             } else if (e.target.nodeName == "TD" && e.target.classList.contains("constructor")) {

                 constructorPopUp(e.target.id);
                 
              }
            
        })
    
    function dialListeners() {
        document.querySelector("#circuitClose").addEventListener("click", (e) => {

           document.querySelector("#circuit").close();
           
        })

        document.querySelector("#driverClose").addEventListener("click", (e) => {

            document.querySelector("#dresultTable tbody").innerHTML = null;
            document.querySelector("#driver").close();
            
         })
         document.querySelector("#constructorClose").addEventListener("click", (e) => {

            document.querySelector("#conresultTable tbody").innerHTML = null;
            document.querySelector("#constructor").close();
            
         })
         for (let i of document.querySelectorAll(".dialButtons .fav")) {

            i.addEventListener("click", (e) => {

                e.target.blur();
                addFavourite(e.target.id);
               
            })
         }
         
    }

    function removeFavourite(ref) {
         //Looping through the three arrays to check where to remove from.
         let item;
        
         for (let i = 0; i < favCircuit.length; i++) {

            if (favCircuit[i].ref == ref) {
                favCircuit[i].favourited = false;
                favCircuit.splice(i, 1);
                
            }
         }
         for (let i = 0; i < favDriver.length; i++) {

            if (favDriver[i].ref == ref) {
                favDriver[i].favourited = false;
                favDriver.splice(i, 1);
            }
         }
         for (let i = 0; i < favConstructor.length; i++) {

            if (favConstructor[i].ref == ref) {
                favConstructor[i].favourited = false;
                favConstructor.splice(i, 1);
            }
         }
        
         updateFavourites();
    }
    function addFavourite(ref) {

        //Check if circuit, if so add to circuit faves.
        let item;
        
        for (let t of circuitArray) {
            if (t.ref == ref) {
                item = t;
            }
        }
        if (item && !item.favourited) {

            item.favourited = true;
            favCircuit.push(item);
            updateFavourites();
            return;
        }
        for (let t of driverArray) {
            if (t.ref == ref) {
                item = t;
            }
        }
        if (item && !item.favourited) {

            item.favourited = true;
            favDriver.push(item);
            updateFavourites();
            return;
        }
        for (let t of constructorArray) {
            if (t.ref == ref) {
                item = t;
            }
        }
        if (item && !item.favourited) {
            item.favourited = true;
            favConstructor.push(item);
        }
        updateFavourites();
    }
    function updateFavourites() {
        
        //Update local storage 
        localStorage.setItem("favDriver", JSON.stringify(favDriver));
        localStorage.setItem("favCircuit", JSON.stringify(favCircuit));
        localStorage.setItem("favConstructor", JSON.stringify(favConstructor));

        const driv = document.querySelector("#favDriver");
        const con = document.querySelector("#favConstructor");
        const cir = document.querySelector("#favCircuit");

        driv.innerHTML = null;
        con.innerHTML = null;
        cir.innerHTML = null;
       
        driv.appendChild(document.createTextNode("Drivers: "));
        con.appendChild(document.createTextNode("Constructors: "));
        cir.appendChild( document.createTextNode("Circuits: "));

        const ul1 = document.createElement("ul");
        const ul2 = document.createElement("ul");
        const ul3 = document.createElement("ul");

       
        favDriver.forEach(thingy => {
           
            const li = document.createElement("li");
            li.setAttribute("id", thingy.ref);
            li.classList.add("faveDriv")
            li.appendChild(document.createTextNode(thingy.name));
          
            const button = document.createElement("button");
            button.setAttribute("value", thingy.ref);
            button.textContent = "X";
            li.appendChild(button);
            ul1.appendChild(li);
          
        })
        favConstructor.forEach(thingy => {

            const li = document.createElement("li");
            li.setAttribute("id", thingy.ref);
            li.appendChild(document.createTextNode(thingy.name));
           
            const button = document.createElement("button");
            button.textContent = "X";
            button.setAttribute("value", thingy.ref);
            li.appendChild(button);
            li.classList.add("faveCon")

            ul2.appendChild(li);
        })
        favCircuit.forEach(thingy => {

            const li = document.createElement("li");

            li.setAttribute("id", thingy.ref);
            li.appendChild(document.createTextNode(thingy.name));
           
             const button = document.createElement("button");
             button.textContent = "X";
             button.setAttribute("value", thingy.ref);
             li.appendChild(button);
            li.classList.add("faveCir")

            ul3.appendChild(li);
        })

        driv.appendChild(ul1);
        con.appendChild(ul2);
        cir.appendChild(ul3);
    }
    //Event listener to trigger dialogs for favourites
    document.querySelector("#favourites").addEventListener("click", (e) => {

        if (e.target.nodeName == "LI") {
            
            if (e.target.classList.contains("faveDriv")) {
                driverPopUp(e.target.id);
            } else if (e.target.classList.contains("faveCon")) {
                constructorPopUp(e.target.id);
               
            } else if (e.target.classList.contains("faveCir")) {
                circuitPopUp(e.target.id);
            } 


        } else if (e.target.nodeName == "BUTTON") {
               
            removeFavourite(e.target.value);
        }
    });
    document.querySelector("#res").addEventListener("click", (e)=> {
        if (e.target.classList.contains("centre")) {
            driverPopUp(e.target.id);
        }
        
    })









    function  printRaceInfo(raceItem) {
        document.querySelector("#raceItem h3").textContent = `Results for ${raceItem.name}`
        const div = document.querySelector("#raceItem");

        const p = document.querySelector("#raceItem div");
        p.innerHTML = null;
        p.textContent = `Round: ${raceItem.round} Year: ${raceItem.year} Circuit: ${raceItem.circuit.name} Date: ${raceItem.date} Website: `
        const a = document.createElement("a");
        a.setAttribute("href", raceItem.url)
        a.textContent = " Race Website";
        p.appendChild(a);
        div.appendChild(p);
    }

    function displayCircuitDial(info, circ) {

        document.querySelector(".cirinformation").innerHTML = null;
        document.querySelector(".cirinformation").appendChild(info);
        document.querySelector("#circuit .dialButtons .fav").setAttribute("id", circ.ref);
     
        document.querySelector("#circuit").showModal();
        document.querySelector("#circuit .dialButtons .fav").blur();
    }

    function displayDriverDial(info, driv) {
      
        const resultsInfo = resultData.filter(r => {
            if (r.driver.id == driv.id) {
                return r;
            }
        })

        document.querySelector(".drinformation").innerHTML = null;
        document.querySelector(".drinformation").appendChild(info);
        document.querySelector("#driver .dialButtons .fav").setAttribute("id", driv.ref);
        
        dialResultsTable(resultsInfo, "#driver")
        document.querySelector("#driver").showModal();
        document.querySelector("#driver .dialButtons .fav").blur();
    }

    function displayConstructorDial(info, cons) {

        const resultsInfo = resultData.filter(r => {
            if (r.constructor.id == cons.id) {
                return r;
            }
        })
        
        document.querySelector(".coninformation").innerHTML = null;
        document.querySelector(".coninformation").appendChild(info);
        document.querySelector("#constructor .dialButtons .fav").setAttribute("id", cons.ref);
    

        dialResultsTable(resultsInfo, "#constructor")
        document.querySelector("#constructor").showModal();
        document.querySelector("#constructor .dialButtons .fav").blur();
    }


    function printTop3(data) {
        
        sortByPosition(data);
        const div3 = document.querySelectorAll(".top3 .centre");
        let counter = 0;
        div3.forEach( d => {
            d.innerHTML = null;
            d.textContent = `${data[counter].driver.forename} ${data[counter].driver.surname}`;
            d.setAttribute("id", data[counter].driver.ref);
            counter++;
        })

    }





    function dialResultsTable(results, tableid) {

        const row1 = document.querySelector(`${tableid} tbody`);
      row1.innerHTML = null;
        for (let r of results) {

            const nuTr = document.createElement("tr");
           const td1 = document.createElement("td");
           td1.textContent = r.race.round
           const td2 = document.createElement("td");
           td2.textContent = r.race.name
            const td3 = document.createElement("td");
            td3.textContent = r.position;
            const td4 = document.createElement("td");
            //Check if Driver or Constructor table to print correct 4th column
            if (tableid == "#constructor") {
            td4.textContent = `${r.driver.forename} ${r.driver.surname}`;
            } else {
                td4.textContent = r.constructor.name;
            }
            
            const td5 = document.createElement("td");
            td5.textContent = r.laps;
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



    function resultsTable(raceResults) {
        const row1 = document.querySelector("#resultTable tbody");
        
        for (let r of raceResults) {

            const nuTr = document.createElement("tr");
            nuTr.classList.add("raceRow");

            const td1 = document.createElement("td");
            td1.textContent = r.position;
            const td2 = document.createElement("td");
            if (favDriver.find( res => res.ref == r.driver.ref)) {
                td2.textContent = `${r.driver.forename} ${r.driver.surname}` + " " + String.fromCodePoint("0x2764");
               
            } else {
                td2.textContent = `${r.driver.forename} ${r.driver.surname}`;
            }
           
            td2.setAttribute("id", r.driver.ref);
            td2.classList.add("driver");

            const td3 = document.createElement("td");
            if (favConstructor.find( res => res.ref == r.constructor.ref)) {
                td3.textContent =  r.constructor.name + " " + String.fromCodePoint("0x2764");
               
            } else {
                td3.textContent = r.constructor.name;
            }
           
            td3.setAttribute("id", r.constructor.ref);
            td3.classList.add("constructor");
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
            if (favDriver.find( res => res.ref == r.driver.ref)) {
                ted2.textContent = `${r.driver.forename} ${r.driver.surname}` + " " + String.fromCodePoint("0x2764");
               
            } else {
                ted2.textContent = `${r.driver.forename} ${r.driver.surname}`;
            }
            ted2.setAttribute("id", r.driver.ref);
            ted2.classList.add("driver");

            const ted3 = document.createElement("td");
            if (favConstructor.find( res => res.ref == r.constructor.ref)) {
                ted3.textContent =  r.constructor.name + " " + String.fromCodePoint("0x2764");
               
            } else {
                ted3.textContent = r.constructor.name;
            }
            ted3.setAttribute("id", r.constructor.ref);
            ted3.classList.add("constructor");
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

            this.name = con.constructor.name;
            this.id = con.constructor.id;
            this.nationality = con.constructor.nationality;
            this.ref = con.constructor.ref;
            this.favourited = false;

    
        }
       
        generateCard() {
             
            const h3 = document.createElement("h3");

            if (this.favourited) {

                h3.textContent = this.name + " " + String.fromCodePoint("0x2764");

            } else {

            h3.textContent = this.name;
            }
            
            const text = document.createTextNode(`Nationality: ${this.nationality}`);
            const p = document.createElement("p");
            p.appendChild(h3);
            p.appendChild(text);
           
           return p;
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
            this.favourited = false;

    
        }
        
        generateCard() {
            const h3 = document.createElement("h3");

            if (this.favourited) {

                h3.textContent = this.name + " " + String.fromCodePoint("0x2764");

            } else {
                h3.textContent = this.name;
            }

            let place = `Location: ${this.location}, ${this.country}, at Latitude: ${this.lat} and Longitude: ${this.lng}`
            const text = document.createTextNode(place);
            const a = document.createElement("a");
            a.setAttribute("href", this.url);
            a.textContent = "Circuit Website";
            const p = document.createElement("p");
            p.appendChild(h3);
            p.appendChild(text);
            p.appendChild(document.createElement("br"));
            p.appendChild(a);

           return p;
    
        }
       }

   const Driver = class {

        constructor(driv) {
        this.name = `${driv.driver.forename} ${driv.driver.surname}`;
        this.id = driv.driver.id;
        this.nationality = driv.driver.nationality;
        this.ref = driv.driver.ref;
        this.favourited = false;

    }

    generateCard() {
        const h3 = document.createElement("h3");

            if (this.favourited) {

                h3.textContent = this.name + " " + String.fromCodePoint("0x2764");

            } else {

            h3.textContent = this.name;
            }

            const text = document.createTextNode(`Nationality: ${this.nationality}`);
            const p = document.createElement("p");
            p.appendChild(h3);
            p.appendChild(text);
           
           return p;

    }
   }

//When I try to sleep all I see is Javascript, it never ends...