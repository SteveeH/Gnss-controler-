var zarizeni = {
  class: [],
  id: [],
  address: [],
  name: []
}

zz = []

var strZarizeni

function BLEzobrazSparovanaZarizeni() {
  bluetoothSerial.list(
    function(devices) {
      let SELble = document.getElementById("ble_seznam")
      let BTbleHledej = document.getElementById("ble_hledej")
      let pocet = devices.length
      let html = ""

      if (pocet > 0) {
        for (let i = 0; i < pocet; i++) {
          html += "<option value="
          html += devices[i]["address"]
          html += ">"
          html += devices[i].hasOwnProperty("name")
            ? devices[i]["name"]
            : devices[i]["id"]
          html += "</option>"
        }

        SELble.innerHTML = html
        BTbleHledej.className = ""
      }
    },
    function(er) {
      alert(er)
    }
  )
}

function BLEzobrazNEsparovanaZarizeni() {
  bluetoothSerial.discoverUnpaired(
    function(devices) {
      let SELble = document.getElementById("ble_seznam")
      let BTbleHledej = document.getElementById("ble_hledej")
      let pocet = devices.length
      let html = ""

      if (pocet > 0) {
        for (let i = 0; i < pocet; i++) {
          html += "<option value="
          html += devices[i]["address"]
          html += ">"
          html += devices[i].hasOwnProperty("name")
            ? devices[i]["name"]
            : devices[i]["id"]
          html += "</option>"
        }
        SELble.innerHTML = html
        BTbleHledej.className = ""
      }
      udelejToast("Počet nalezených zařízení: " + pocet, 500)
    },
    function(er) {
      alert(er)
    }
  )
}

function BLEpripojZarizeni(adresa) {
  bluetoothSerial.connect(
    adresa,
    function() {
      console.log("Zařízení připojeno..")
      gnnsPripojeno = true
      INFble.src = "img/ble_connected.svg"
      udelejToast("Zařízení připojeno..", 500)
    },
    function() {
      console.log("Zařízení se nepodařilo připojit..")
      gnnsPripojeno = false
      INFble.src = "img/ble_disconnected.svg"
      udelejToast("Zařízení se nepodařilo připojit..", 500)
    }
  )
}

//bluetoothSerial.discoverUnpaired(function(devices)
function dostupnaBleZarizeni() {
  var zarList = []

  bluetoothSerial.list(
    function(devices) {
      var countDevices = devices.length
      var counter = 1

      devices.forEach(function(device) {
        zarList.push(device)
        counter++
        if (counter > countDevices) {
          var BTbleHledej = document.getElementById("ble_hledej")
          BTbleHledej.className = ""
          console.log("Uvnitr BLE: " + zarList)
        }
      })
    },
    function(er) {
      alert(er)
    }
  )
  console.log("Uvnitr zarizeni: " + zarList)
  return zarList
}

function zobrazBle(zz) {}

/* function BLE(){
    bluetoothSerial.list(function(devices) {
        devices.forEach(function(device) { 
            //alert("BLE function \n" + device.name +"\n"+device.address + "\n"+device.id + "\n"+device.class); // jmeno a mac adresa dostupnych zarizeni
            /* zarizeni.class.push(device.class);
            zarizeni.id.push(device.id);
            zarizeni.address.push(device.address);
            zarizeni.name.push(device.name); */
/*var dd={
                name: device.name,
                id: device.id,
                address: device.address
            }
            zz.push(dd);
            //alert(zz);
            //alert(JSON.stringify(dd));  
        })
    }, function(er){
        alert(er)
    }); 
}  */

function aalert(obj) {
  alert(JSON.stringify(obj))
}

function bleAlert() {
  BLE2()

  /* bluetoothSerial.enable(
        function() {
            udelejToast("Bluetooth je zaplé.",500);
        },
        function() {
            udelejToast("Bluetooth je vypnuté.",500);
        }
    ); */
}

/*
function bleList(){
    strZarizeni="";
    //vymazZarizeni();

    bluetoothSerial.list(function(devices) {
        devices.forEach(function(device) {
            zarizeni.class.push(device.class);
            zarizeni.id.push(device.id);
            zarizeni.address.push(device.address);
            zarizeni.name.push(device.name);
        })
    }, function(er){
        alert(er)
    });  
    strZarizeni=JSON.stringify(zarizeni);
    //alert(JSON.stringify(zarizeni));
}


function vypisBleList(){
    //bleList();
    var pocet=zarizeni.name.length;

    if (pocet<1){
        udelejToast("K dispozici nejsou žádná zařízení!",500)
    }
    else{
         var t="";
        for(i=1;i<=pocet;i++){
            t+=` <br> Zařizení: <b>${zarizeni.name[i]}</b> MAC adresa: <b>${zarizeni.address[i]}</b> </br> `;
        } 

        document.getElementById("bleList").innerHTML=t;
        //document.getElementById("bleList").innerHTML=strZarizeni; 
    }
}

function vymazZarizeni(){
    zarizeni.class=[];
    zarizeni.id=[];
    zarizeni.address=[];
    zarizeni.name=[];
}*/
