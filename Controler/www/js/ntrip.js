// TODO:
// klienta hodit jako glob. promeny
// moznost ukonceni streamu
// pridelat promene
// odesilani pres BLE
// funkce pro ulozeni sourceTable

function zdrojovaTabulka(adresa, port) {
  let client = new Socket()
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
    console.log(data.length)
    let str = ""

    data.forEach(el => {
      str += String.fromCharCode(el)
    })

    ODPOVED += str
    // invoked after new batch of data is received (typed array of bytes Uint8Array)
    /* Object.keys(data).forEach(function(key) {
      console.log(data[key])
      console.log(String.fromCharCode(data[key]))
    }) */
  }

  client.onError = function(errorMessage) {
    // invoked after error occurs during connection
    console.log(errorMessage)
  }
  client.onClose = function(hasError) {
    // invoked after connection close

    console.log(ODPOVED.split("\n")) // tady se to posle k ulozeni do tabulky
    console.log("Byl error? :" + hasError)
  }
}

function NTRIPClient(adresa, port) {
  // adresa , port , mountpoint , user , password
  let client = new Socket()

  client.open(adresa, port, function() {
    var dataString =
      "GET / CPRG3 HTTP/1.0\r\n" +
      "Host: czeposr.cuzk.cz\r\n" +
      "User-Agent: NTRIPClient for Arduino v1.0\r\n" +
      "Authorization: Basic " +
      "Y3Z1dHZ5dWthOmsxNTVkcmVtZWpha29rb25l" +
      "\r\n\r\n"

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
    console.log(data.length)
    let str = ""

    data.forEach(el => {
      str += String.fromCharCode(el)
    })

    // poslani korekcnich dat pres BLE
    console.log(str)
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
