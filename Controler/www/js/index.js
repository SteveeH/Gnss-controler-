/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* GLOBALNI PROMENNE */

// informacni panel
var INFsatelity = document.getElementById("INFsatelity")
var INFbaterka = document.getElementById("INFbaterka")
var INFfix = document.getElementById("INFfix")
var INFble = document.getElementById("INFble")

var zprava =
  "$GPGSV,4,1,13,01,03,011,23,06,06,113,43,10,12,288,13,12,51,245,21*7C"
var gnnsPripojeno = false

var BLUETOOTH
var database = new Databaze()
var idZAKAZKY = 1 // zde se bude nacitat posledni nactena zakazka

var DATA = {
  GGA: { LAT: 0, LON: 0, ALT: 0, SEP: 0, NUMSAT: 0 },
  GSV: { GP: [], GL: [] },
  GSA: { GP: [], GL: [], HDOP: 0, PDOP: 0, VDOP: 0 }
}

var DRUZICE = {
  GP: [],
  GL: []
}

// globalni promena pro ukonceni intervalu funkce
var sky
var pozadi = false

var app = {
  // kontruktor aplikace
  initialize: function() {
    document.addEventListener("deviceready", app.init)
  },
  init: function() {
    eventy()
    database.initDB()
    database.vytvorTabulky()

    domov()
    aktivOkno("domov")

    /* nahrajHodnoty(); //tohle uz nepotrebuji*/
    /*  pripojArduino() */
    var intt = setInterval(function() {
      nactiData(gnnsPripojeno)
    }, 1000)
    document.addEventListener("pause", app.paused)
    document.addEventListener("resume", app.resumed)
  },
  paused: function(ev) {
    console.log(ev)

    //window.BackgroundService.start(function() { pozadi=true;pozadi();},function() { console.log('err') });
  },
  resumed: function(ev) {
    //pozadi=false;
    console.log(ev)
  },
  history: ["#domov"]
}

app.initialize()

/* cordova.plugins.notification.local.schedule({
    title: "GNNS-CVUT",
    message: "Bod byl změřen.",
    sound: "sound/tuut.mp3",
    icon: "img/home.svg"
}); */

/* function pozadi(){
    var counter=0;

    while(pozadi){
        console.log("aa");
    }
} */

function nactiData(pripojeno) {
  // tato funkce zkontroluje pripojeni k arduinu/gnns prijimaci a pokud je pripojen, zacne
  // ukladat data prijata v nmea zpravach..
  if (pripojeno) {
    bluetoothSerial.subscribe(
      "\n",
      function(data) {
        //console.log(data);
        prekladNMEA(data, ulozeniGnnsDat)
      },
      false
    )
  } else {
    /* console.log("nepripojeno")
    pripojArduino() */
  }
}

function prekladNMEA(veta, ulozeni) {
  // V teto podmince se rozhoduje zda se jedna o vetu, kterou chceme prelozit nebo nikoliv
  if (veta.slice(3, 6) === "ZDA" || veta.slice(3, 6) === "RCM") {
    // nic
  } else if (veta.slice(3, 6) === "ARD") {
    // informace poslane arduinem : stav baterie, pripojeni/odpojeni wifi atd.
  } else {
    var preklad = nmeaParse(veta)
    ulozeni(preklad)
  }
}

var ulozeniGnnsDat = function(objekt) {
  var typVety = objekt.sentence
  var mluvci = objekt.talker_id
  if (typVety === "GGA") {
    DATA.GGA.LAT = parseLatitude(objekt.lat, objekt.latPole)
    DATA.GGA.LON = parseLongitude(objekt.lon, objekt.lonPole)
    DATA.GGA.ALT = objekt.alt
    DATA.GGA.SEP = objekt.geoidalSep
    DATA.GGA.NUMSAT = objekt.numSat
  } else if (typVety === "GSA") {
    if (objekt.satellites[0] < 33) {
      // GP satelity
      DATA.GSA.HDOP = objekt.HDOP
      DATA.GSA.PDOP = objekt.PDOP
      DATA.GSA.VDOP = objekt.VDOP
      DATA.GSA.GP = objekt.satellites
      INFsatelity.innerText = DATA.GSA.GP.length + "/" + DATA.GSA.GL.length
    } /* else if (32 < objekt.satellites[0] < 65) {
      // SBAS satelity
    } */ else {
      // GLONASS satelity
      DATA.GSA.GL = objekt.satellites
      INFsatelity.innerText = DATA.GSA.GP.length + "/" + DATA.GSA.GL.length
    }
  } else if (typVety === "GSV") {
    if (mluvci === "GL") {
      if (objekt.msgNum == 1) {
        DATA.GSV.GL = []
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GL.push(satelit)
        })
      } else {
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GL.push(satelit)
        })

        if (objekt.msgNum == objekt.numMsgs) {
          DRUZICE.GL = DATA.GSV.GL
        }
      }
    } else if (mluvci === "GP") {
      if (objekt.msgNum == 1) {
        DATA.GSV.GP = []
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GP.push(satelit)
        })
      } else {
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GP.push(satelit)
        })
        if (objekt.msgNum == objekt.numMsgs) {
          DRUZICE.GP = DATA.GSV.GP
        }
      }
    } else {
      // pokud bychom prijmali data z jinych druzic nez GLONASS a GPS
      // console.log(objekt.talker_id);
    }
  }
}

function udelejToast(text) {
  window.simpleToastPlugin.show(
    text,
    0,
    function(e) {
      //success callback
    },
    function(e) {
      //error callback
      alert("neco je spatne" + e)
    }
  )
  navigator.vibrate(500)
}

function pripojArduino() {
  bluetoothSerial.connect(
    "98:D3:32:31:1C:8D",
    function() {
      console.log("Arduino připojeno..")
      gnnsPripojeno = true
    },
    function() {
      console.log("Někde nastala chyba..")
      gnnsPripojeno = false
    }
  )
}

function eventy() {
  document.getElementById("domov").addEventListener(
    "click",
    function() {
      domov()
      aktivOkno("domov")
    },
    false
  )
  document.getElementById("mereni").addEventListener(
    "click",
    function() {
      mereni()
      aktivOkno("mereni")
    },
    false
  )
  document.getElementById("dron").addEventListener(
    "click",
    function() {
      dron()
      aktivOkno("dron")
    },
    false
  )
  document.getElementById("skyplot").addEventListener(
    "click",
    function() {
      skyplot()
      aktivOkno("skyplot")
    },
    false
  )
  document.getElementById("nastaveni").addEventListener(
    "click",
    function() {
      nastaveni()
      aktivOkno("nastaveni")
    },
    false
  )

  //document.getElementById("tlacitko").addEventListener("click", function() {});
  //document.getElementById("tlacitko").addEventListener("click",function (){var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
  //db.transaction(populateDB, errorCB, successCB);},false);

  // Prehravani zvuku - musi byt zavedena uplna cesta k souborum
  /* var troubeni = new Media(
    "/android_asset/www/sound/tuut.mp3",
    function() {
      console.log("hraji");
    },
    function(err) {
      console.log("nehraji:" + JSON.stringify(err));
    }
  );
  troubeni.play(); */

  document.addEventListener(
    "backbutton",
    function(e) {
      if (window.location.hash === "#domov") {
        e.preventDefault()
        navigator.app.exitApp()
      } else {
        zpet()
      }
    },
    false
  )
}

function zpet() {
  var totoOkno = app.history.pop()
  var predchoziOkno = app.history.pop()

  switch (predchoziOkno) {
    case "#domov":
      domov()
      aktivOkno("domov")
      break
    case "#mereni":
      mereni()
      aktivOkno("mereni")
      break
    case "#dron":
      dron()
      aktivOkno("dron")
      break
    case "#skyplot":
      skyplot()
      aktivOkno("skyplot")
      break
  }
}

function domov() {
  app.history.push("#domov")
  window.location.hash = "domov"
  var rodic = document.getElementById("plocha")

  vymazPlochu(rodic)
  rodic.innerHTML = HTMLdomov

  database.seznamZakazek()
  database.infoZakazka(idZAKAZKY)
  eventyDomov()
}

function mereni() {
  app.history.push("#mereni")
  window.location.hash = "mereni"
  var rodic = document.getElementById("plocha")
  vymazPlochu(rodic)
  rodic.innerText = "Měření"
}

function dron() {
  app.history.push("#dron")
  window.location.hash = "dron"
  //aktivOkno("vytycovani");
  var rodic = document.getElementById("plocha")
  vymazPlochu(rodic)
  rodic.innerText = "Dron...."
}

function skyplot() {
  app.history.push("#skyplot")
  window.location.hash = "skyplot"
  //aktivOkno("skyplot");
  var rodic = document.getElementById("plocha")
  vymazPlochu(rodic)
  ;[maxPolomer, sirka, vyska, ctx, canvas] = vytvorSkyplot()

  sky = setInterval(function() {
    SKY()
  }, 1000)
}

function nastaveni() {
  app.history.push("#nastav")
  window.location.hash = "nastav"
  var rodic = document.getElementById("plocha")
  vymazPlochu(rodic)
  rodic.innerHTML = HTMLnastaveni

  eventyNastaveni()

  /* var BTvytvorSoubor = document.getElementById("BTvytvorSoubor");
  var BTbleHledej = document.getElementById("ble_hledej");
  var bleIkona = document.getElementById("ble_ikon");
  console.log("Nastaveni: " + dostupnaBleZarizeni());

  BTvytvorSoubor.addEventListener(
    "click",
    function() {
      createFile();
    },
    false
  );

  BTbleHledej.addEventListener(
    "click",
    function() {
      BTbleHledej.className = "rotate_slow";
      bleIkona.src = "img/ble_finding.svg";
      BLUETOOTH = dostupnaBleZarizeni();
    },
    false
  ); */
}

/* function createFile() {
  var type = window.PERSISTENT //PERSISTENT
  var size = 5 * 1024 * 1024
  window.requestFileSystem(type, size, successCallback, errorCallback)

  function successCallback(fs) {
    console.log(fs)
    console.log(fs.root)
    fs.root.getFile(
      "mojeAPP.txt",
      { create: true, exclusive: true },
      function(fileEntry) {
        alert("File creation successfull! " + fileEntry)
        console.log("File creation successfull! " + fileEntry)
      },
      errorCallback
    )
  }

  function errorCallback(error) {
    alert("ERROR: " + error.code)
  }
} */

function vymazPlochu(rodic) {
  // tato funkce vymaze vsechny potomky daneho oddilu
  while (rodic.firstChild) {
    rodic.removeChild(rodic.firstChild)
  }
}

function aktivOkno(okno) {
  var zmacknuto = "rgb(50,50,50)"
  var nezmacknuto = "rgb(79,79,79)"
  var BtDomov = document.getElementById("domov")
  var BtMereni = document.getElementById("mereni")
  var BtDron = document.getElementById("dron")
  var BtSkyplot = document.getElementById("skyplot")
  var BtNastaveni = document.getElementById("nastaveni")

  switch (okno) {
    case "domov":
      // zmena barvy
      BtDomov.style.backgroundColor = zmacknuto
      BtMereni.style.backgroundColor = nezmacknuto
      BtDron.style.backgroundColor = nezmacknuto
      BtSkyplot.style.backgroundColor = nezmacknuto
      BtNastaveni.className = ""
      return
    case "mereni":
      // zmena barvy
      BtDomov.style.backgroundColor = nezmacknuto
      BtMereni.style.backgroundColor = zmacknuto
      BtDron.style.backgroundColor = nezmacknuto
      BtSkyplot.style.backgroundColor = nezmacknuto
      BtNastaveni.className = ""
      return
    case "dron":
      // zmena barvy
      BtDomov.style.backgroundColor = nezmacknuto
      BtMereni.style.backgroundColor = nezmacknuto
      BtDron.style.backgroundColor = zmacknuto
      BtSkyplot.style.backgroundColor = nezmacknuto
      BtNastaveni.className = ""
      return
    case "skyplot":
      // zmena barvy
      BtDomov.style.backgroundColor = nezmacknuto
      BtMereni.style.backgroundColor = nezmacknuto
      BtDron.style.backgroundColor = nezmacknuto
      BtSkyplot.style.backgroundColor = zmacknuto
      BtNastaveni.className = ""
      return
    case "nastaveni":
      // zmena barvy
      BtDomov.style.backgroundColor = nezmacknuto
      BtMereni.style.backgroundColor = nezmacknuto
      BtDron.style.backgroundColor = nezmacknuto
      BtSkyplot.style.backgroundColor = nezmacknuto
      BtNastaveni.className = "rotate_slow"
      return
  }
}

/* function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function populateDB2(tx) {
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "heureka")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (4, "cjiejcie")');
}

// Transaction error callback.
    //
    function errorCB(tx, err) {
        alert("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        alert("success!");
    } */

var HTMLnastaveni =
  '<div class="nast"> <p>Nastavení bluetooth připojení:</p><div> <button id="ble_hledej" class=""> <img src="img/refresh.svg"/> </button> <select id="ble_seznam"> <option value="bt1">BT1</option> <option value="bt2">BT2</option> <option value="bt3">BT3ceeceeceecececece</option> <option value="bt4">BT4</option> <option value="bt1">BT1</option> <option value="bt2">BT2</option> <option value="bt3">BT3ceeceeceecececece</option> <option value="bt4">BT4</option> <option value="bt1">BT1</option> <option value="bt2">BT2</option> <option value="bt3">BT3ceeceeceecececece</option> <option value="bt4">BT4</option> </select> <button id="ble_pripoj"> PŘIPOJ BLE </button> </div></div><hr/> <div class="nast"> <p>Nastavení hotspot připojení</p><input type="text" placeholder="Název přístupového bodu"/> <input type="text" placeholder="Heslo"/> </div><hr/> <div class="nast"> <p>Nastavení NTRIP připojení:</p><input type="text" placeholder="Ip adresa serveru..."/> <input type="text" placeholder="port..."/> <br/> <button>MoutnPointy</button> <br/> <select id="mount_seznam"> <option value="mount1">M1</option> <option value="mount2">M2</option> <option value="mount3">M3</option> </select> <br/> <input type="text" placeholder="Uživatelské jméno"/> <input type="password" placeholder="Heslo"/> <button>Připoj</button> </div><hr/> <div class="nast"> <p>Nastavení zvuku</p></div>'

var HTMLdomov =
  '<div class="domov"> <div class="zakazkaInfo"> <b>Informace o aktuální zakázce</b><br/> <p id="INFOnazevZakazky">Název zakázky :</p><p id="INFOdatumVytvoreni">Datum vytvoření :</p><p id="INFOpocetBodu">Počet změřených bodů :</p><p id="INFOpocetLetu">Počet letů :</p></div><hr/> <div> <div class="BTselect"> <button class="plus" id="BTpridejZakazku">+</button> <select name="zakazky" id="seznamZakazek"> <option value="">Vytvoř zakázku</option> </select> </div><button>Zobraz uložené body</button> </div><hr/> <div> <button id="BTexportMereni">Exportuj měření</button> <button id="BTimportBodu">Importuj body</button> <button id="BTvymazZakazku">Vymaž zakázku</button> </div><div class="modal" id="modalZakazka"> <button class="close" id="BTzavri"> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 51.976 51.976" style="enable-background:new 0 0 51.976 51.976;" xml:space="preserve" > <g> <path d="M44.373,7.603c-10.137-10.137-26.632-10.138-36.77,0c-10.138,10.138-10.137,26.632,0,36.77s26.632,10.138,36.77,0C54.51,34.235,54.51,17.74,44.373,7.603z M36.241,36.241c-0.781,0.781-2.047,0.781-2.828,0l-7.425-7.425l-7.778,7.778c-0.781,0.781-2.047,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l7.778-7.778l-7.425-7.425c-0.781-0.781-0.781-2.048,0-2.828c0.781-0.781,2.047-0.781,2.828,0l7.425,7.425l7.071-7.071c0.781-0.781,2.047-0.781,2.828,0c0.781,0.781,0.781,2.047,0,2.828l-7.071,7.071l7.425,7.425C37.022,34.194,37.022,35.46,36.241,36.241z"/> </g> </svg> </button> <p>Název zakázky</p><input type="text" id="INPnazevZakazky"/> <p>Datum</p><input type="date" id="INPdatum"/> <p>Popis</p><textarea id="INPpopis" class="popis"></textarea> <button id="BTzalozZakazku">Založ zakázku</button> </div></div>'

var HTMLmereni = '<div class="domov"></div>'
