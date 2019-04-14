// TODO:
// klienta hodit jako glob. promeny
// moznost ukonceni streamu
// pridelat promene
// odesilani pres BLE
// funkce pro ulozeni sourceTable

function zdrojovaTabulka(adresa, port) {
  let ODPOVED = ""

  client.open(adresa, port, function() {
    var dataString =
      "GET / HTTP/1.0\r\n" +
      "Host: 195.245.209.181\r\n" +
      "User-Agent: NTRIPClient for Arduino v1.0\r\n" +
      "Connection: close\r\n\r\n"

    var data = new Uint8Array(dataString.length)
    for (var i = 0; i < data.length; i++) {
      data[i] = dataString.charCodeAt(i)
    }

    client.write(
      data,
      () => {
        console.log("poslano..")
      },
      message => {
        console.log("Err: " + JSON.stringify(message))
      }
    )
  })

  client.onData = function(data) {
    let str = ""

    data.forEach(el => {
      str += String.fromCharCode(el)
    })

    ODPOVED += str
  }

  client.onError = function(errorMessage) {
    // zavola se pokud probehne najaka chyba v prubehu komunikace
    console.log(errorMessage)
  }
  client.onClose = function(hasError) {
    // zavola se po ukonceni spojeni

    vysledkyTabulky(ODPOVED.split("\n"))

    //console.log("Byl error? :" + hasError)
  }
}

function NTRIPClient(adresa, port, mountpoint, uzivatel, heslo) {
  // podminka : pokud je potreba poslat aktualni pozici -- lastGGA
  client.open(adresa, port, function() {
    var dataString =
      "GET / " +
      mountpoint +
      " HTTP/1.0\r\n" +
      "Host: " +
      adresa +
      "\r\n" +
      "User-Agent: NTRIPClient for Arduino v1.0\r\n" +
      "Authorization: Basic " +
      utf8_to_b64(uzivatel + ":" + heslo) +
      "\r\n\r\n"

    console.log(dataString)
    var data = new Uint8Array(dataString.length)
    for (var i = 0; i < data.length; i++) {
      data[i] = dataString.charCodeAt(i)
    }

    client.write(
      data,
      () => {
        console.log("poslano..")
      },
      message => {
        console.log("Err: " + JSON.stringify(message))
      }
    )
  })

  client.onData = function(data) {
    //console.log(data.length)
    let str = ""

    data.forEach(el => {
      str += String.fromCharCode(el)
    })
    // poslani korekcnich dat pres BLE
    bluetoothSerial.write(data)
  }

  client.onError = function(errorMessage) {
    // invoked after error occurs during connection
    console.log(errorMessage)
  }
  client.onClose = function(hasError) {
    // invoked after connection close

    //console.log(ODPOVED.split("\n")) // tady se to posle k ulozeni do tabulky
    console.log("Byl error? :" + hasError)
  }
}

function stringFromArray(data) {
  var count = data.length
  var str = ""

  for (var index = 0; index < count; index += 1)
    str += String.fromCharCode(data[index])

  return str
}

function vysledkyTabulky(tabulka) {
  let delka = tabulka.length
  let str = ""
  ZDtabulka = []

  for (let i = 0; i < delka; i++) {
    if (tabulka[i].slice(0, 3) === "STR") {
      let mntp = tabulka[i].split(";")
      //
      str += '<option value="' + i + '">' + mntp[1] + "</option>"
      // ulozeni do globalni promene
      ZDtabulka.push(mntp)
    }
  }

  // vyplneni select MountPointu
  document.getElementById("mount_seznam").innerHTML = str
}

// kodovani base64
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)))
}
