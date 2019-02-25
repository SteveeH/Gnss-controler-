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

/* var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        nahrajHodnoty();
        alert("Tohle zařízení je ready... ;)");
        window.simpleToastPlugin.show("hello world", 0, function(e){
            //success callback
            }, function(e){
            //error callback
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize(); */



document.addEventListener('deviceready', zacatekAplikace);

function zacatekAplikace(){
    nahrajHodnoty();
    //udelejToast("ahoj!!");
    //BLE();
    //bleList();
    eventy();
    //alert("strZarizeni \n"+ strZarizeni);
}


function udelejToast(text){
    window.simpleToastPlugin.show(text, 0, function(e){
        //success callback
        }, function(e){
        //error callback
        alert("neco je spatne" + e);
    });
    navigator.vibrate(500); 
}


function nahrajHodnoty(){
    document.getElementById("platform").innerHTML="Platforma:  "+device.platform;
    document.getElementById("model").innerHTML="Model:  "+device.model;
    document.getElementById("serial").innerHTML="Seriové číslo:  "+device.serial;
    //window.plugins.toast.showShort("Tvl ono to funguje....");
}


/* function BLE(){
    bluetoothSerial.list(function(devices) {
        devices.forEach(function(device) {
            alert(device.name);
        })
    }, function(er){
        alert(er)
    });  
} */


function eventy(){
    document.getElementById("domov").addEventListener("click",function (){udelejToast("Domov!")},false);
    document.getElementById("mereni").addEventListener("click",function (){udelejToast("Mereni!")},false);
    document.getElementById("vytyceni").addEventListener("click",function (){udelejToast("Vytyceni!")},false);
    document.getElementById("skyplot").addEventListener("click",function (){udelejToast("Skyplot!")},false);
    document.getElementById("settings").addEventListener("click",function (){bleAlert();},false);
    document.getElementById("tlacitko").addEventListener("click",function (){aalert(zz)},false);
}