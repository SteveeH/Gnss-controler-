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

var zprava =
  "$GPGSV,4,1,13,01,03,011,23,06,06,113,43,10,12,288,13,12,51,245,21*7C";
var gnnsPripojeno = false;

var DATA = {
  GSV: { GP: [], GL: [] }
};

var DRUZICE = {
  GP: [],
  GL: []
};

// globalni promena pro ukonceni intervalu funkce
var sky;
var pozadi = false;

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener("deviceready", app.init);
  },
  init: function() {
    eventy();
    nahrajHodnoty();
    pripojArduino();
    aktivOkno("domov");
    var intt = setInterval(function() {
      nactiData(gnnsPripojeno);
    }, 1000);
    document.addEventListener("pause", app.paused);
    document.addEventListener("resume", app.resumed);
  },
  paused: function(ev) {
    console.log(ev);

    //window.BackgroundService.start(function() { pozadi=true;pozadi();},function() { console.log('err') });
  },
  resumed: function(ev) {
    //pozadi=false;
    console.log(ev);
  },
  history: ["#domov"]
};

app.initialize();

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

//var intt = setInterval(function(){(interval)?tikani(interval):clearInterval(intt);},1000);

function nactiData(pripojeno) {
  // tato funkce zkontroluje pripojeni k arduinu/gnns prijimaci a pokud je pripojen, zacne
  // ukladat data prijata v nmea zpravach..
  if (pripojeno) {
    bluetoothSerial.subscribe(
      "\n",
      function(data) {
        //console.log(data);
        prekladNMEA(data, ulozeniGnnsDat);
      },
      false
    );
  } else {
    console.log("nepripojeno");
    pripojArduino();
  }
}

function prekladNMEA(veta, ulozeni) {
  // V teto podmince se rozhoduje zda se jedna o vetu, kterou chceme prelozit nebo nikoliv
  if (veta.slice(3, 6) === "ZDA") {
  } else {
    var preklad = nmeaParse(veta);
    ulozeni(preklad);
  }
}

var ulozeniGnnsDat = function(objekt) {
  var typVety = objekt.sentence;
  var mluvci = objekt.talker_id;
  if (typVety == "GGA") {
    var LAT = parseLatitude(objekt.lat, objekt.latPole);
    var LON = parseLongitude(objekt.lon, objekt.lonPole);
    var ALT = objekt.alt;

    //console.log("Pozice: "+LAT+"° ; "+LON+"° ; "+ALT+" m!");
  } else if (typVety == "GSV") {
    if (mluvci == "GL") {
      if (objekt.msgNum == 1) {
        DATA.GSV.GL = [];
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GL.push(satelit);
        });
      } else {
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GL.push(satelit);
        });

        if (objekt.msgNum == objekt.numMsgs) {
          DRUZICE.GL = DATA.GSV.GL;
        }
      }
    } else if (mluvci === "GP") {
      if (objekt.msgNum == 1) {
        DATA.GSV.GP = [];
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GP.push(satelit);
        });
      } else {
        objekt.satellites.forEach(satelit => {
          DATA.GSV.GP.push(satelit);
        });
        if (objekt.msgNum == objekt.numMsgs) {
          DRUZICE.GP = DATA.GSV.GP;
        }
      }
    } else {
      // pokud bychom prijmali data z jinych druzic nez GLONASS a GPS
      // console.log(objekt.talker_id);
    }
  }
};

function udelejToast(text) {
  window.simpleToastPlugin.show(
    text,
    0,
    function(e) {
      //success callback
    },
    function(e) {
      //error callback
      alert("neco je spatne" + e);
    }
  );
  navigator.vibrate(500);
}

function pripojArduino() {
  bluetoothSerial.connect(
    "98:D3:32:31:1C:8D",
    function() {
      console.log("Arduino připojeno..");
      gnnsPripojeno = true;
    },
    function() {
      console.log("Někde nastala chyba..");
      gnnsPripojeno = false;
    }
  );
}

function nahrajHodnoty() {
  document.getElementById("platform").innerHTML =
    "Platforma:  " + device.platform;
  document.getElementById("model").innerHTML = "Model:  " + device.model;
  document.getElementById("serial").innerHTML =
    "Seriové číslo:  " + device.serial;
}

function eventy() {
  document.getElementById("domov").addEventListener(
    "click",
    function() {
      domov();
    },
    false
  );
  document.getElementById("mereni").addEventListener(
    "click",
    function() {
      mereni();
    },
    false
  );
  document.getElementById("vytyceni").addEventListener(
    "click",
    function() {
      vytycovani();
    },
    false
  );
  document.getElementById("skyplot").addEventListener(
    "click",
    function() {
      skyplot();
    },
    false
  );
  document.getElementById("nastaveni").addEventListener(
    "click",
    function() {
      bleAlert();
    },
    false
  );
  document.getElementById("tlacitko").addEventListener("click", function() {});
  //document.getElementById("tlacitko").addEventListener("click",function (){var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
  //db.transaction(populateDB, errorCB, successCB);},false);

  document.addEventListener(
    "backbutton",
    function(e) {
      if (window.location.hash === "#domov") {
        e.preventDefault();
        navigator.app.exitApp();
      } else {
        zpet();
      }
    },
    false
  );
}

function zpet() {
  var totoOkno = app.history.pop();
  var predchoziOkno = app.history.pop();

  switch (predchoziOkno) {
    case "#domov":
      domov();
      break;
    case "#mereni":
      mereni();
      break;
    case "#vytyc":
      vytycovani();
      break;
    case "#skyplot":
      skyplot();
      break;
  }
}

function domov() {
  app.history.push("#domov");
  window.location.hash = "domov";
  aktivOkno("domov");
  var rodic = document.getElementById("plocha");
  vymazPlochu(rodic);
  rodic.innerText = "Domov";
}

function mereni() {
  app.history.push("#mereni");
  window.location.hash = "mereni";
  aktivOkno("mereni");
  var rodic = document.getElementById("plocha");
  vymazPlochu(rodic);
  rodic.innerText = "Měření";
}

function vytycovani() {
  app.history.push("#vytyc");
  window.location.hash = "vytyc";
  aktivOkno("vytycovani");
  var rodic = document.getElementById("plocha");
  vymazPlochu(rodic);
  rodic.innerText = "Vytyčování";
}

function skyplot() {
  app.history.push("#skyplot");
  window.location.hash = "skyplot";
  aktivOkno("skyplot");
  var rodic = document.getElementById("plocha");
  vymazPlochu(rodic);

  [maxPolomer, sirka, vyska, ctx, canvas] = vytvorSkyplot();

  sky = setInterval(function() {
    SKY();
  }, 1000);
}

function vymazPlochu(rodic) {
  // tato funkce vymaze vsechny potomky daneho oddilu
  while (rodic.firstChild) {
    rodic.removeChild(rodic.firstChild);
  }
}

function aktivOkno(okno) {
  var zmacknuto = "rgb(50,50,50)";
  var nezmacknuto = "rgb(79,79,79)";
  var domov = document.getElementById("domov");
  var mereni = document.getElementById("mereni");
  var vytyceni = document.getElementById("vytyceni");
  var sp = document.getElementById("skyplot");
  var nastaveni = document.getElementById("nataveni");

  switch (okno) {
    case "domov":
      /* domov.disabled = true;
            mereni.disabled = false;
            vytyceni.disabled = false;
            skyplot.disabled = false;
            nastaveni.disabled = false; */
      // zmena barvy
      domov.style.backgroundColor = zmacknuto;
      mereni.style.backgroundColor = nezmacknuto;
      vytyceni.style.backgroundColor = nezmacknuto;
      sp.style.backgroundColor = nezmacknuto;
      break;
    case "mereni":
      /* domov.disabled = false;
            mereni.disabled = true;
            vytyceni.disabled = false;
            skyplot.disabled = false;
            nastaveni.disabled = false; */
      // zmena barvy
      domov.style.backgroundColor = nezmacknuto;
      mereni.style.backgroundColor = zmacknuto;
      vytyceni.style.backgroundColor = nezmacknuto;
      sp.style.backgroundColor = nezmacknuto;
      break;
    case "vytycovani":
      /* domov.disabled = false;
            mereni.disabled = false;
            vytyceni.disabled = true;
            skyplot.disabled = false;
            nastaveni.disabled = false; */
      // zmena barvy
      domov.style.backgroundColor = nezmacknuto;
      mereni.style.backgroundColor = nezmacknuto;
      vytyceni.style.backgroundColor = zmacknuto;
      sp.style.backgroundColor = nezmacknuto;
      break;
    case "skyplot":
      /*  domov.disabled = false;
            mereni.disabled = false;
            vytyceni.disabled = false;
            skyplot.disabled = true;
            nastaveni.disabled = false; */
      // zmena barvy
      domov.style.backgroundColor = nezmacknuto;
      mereni.style.backgroundColor = nezmacknuto;
      vytyceni.style.backgroundColor = nezmacknuto;
      sp.style.backgroundColor = zmacknuto;
      break;
    /* TODO 
        case "nastaveni":
        
        break; */
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

// Transaction error callback
    //
    function errorCB(tx, err) {
        alert("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        alert("success!");
    } */
