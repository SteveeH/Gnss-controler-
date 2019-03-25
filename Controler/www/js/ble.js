var zarizeni = {
  class: [],
  id: [],
  address: [],
  name: []
};

zz = [];

var strZarizeni;

function BLE() {
  bluetoothSerial.list(
    function(devices) {
      var countDevices = devices.length;
      var counter = 1;
      zz = [];
      devices.forEach(function(device) {
        zz.push(device);
        counter++;
        if (counter > countDevices) {
          aalert(zz);
        }
      });
    },
    function(er) {
      alert(er);
    }
  );
}

//bluetoothSerial.discoverUnpaired(function(devices)
function dostupnaBleZarizeni() {
  var zarList = [];

  bluetoothSerial.list(
    function(devices) {
      var countDevices = devices.length;
      var counter = 1;

      devices.forEach(function(device) {
        zarList.push(device);
        counter++;
        if (counter > countDevices) {
          var BTbleHledej = document.getElementById("ble_hledej");
          BTbleHledej.className = "";
          console.log("Uvnitr BLE: " + zarList);
        }
      });
    },
    function(er) {
      alert(er);
    }
  );
  console.log("Uvnitr zarizeni: " + zarList);
  return zarList;
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
  alert(JSON.stringify(obj));
}

function bleAlert() {
  BLE2();

  /* bluetoothSerial.enable(
        function() {
            udelejToast("Bluetooth je zaplé.");
        },
        function() {
            udelejToast("Bluetooth je vypnuté.");
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
        udelejToast("K dispozici nejsou žádná zařízení!")
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
