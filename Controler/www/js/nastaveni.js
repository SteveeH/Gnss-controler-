function eventyNastaveni() {
  let BTbleHledej = document.getElementById("ble_hledej")
  let BTblePripoj = document.getElementById("ble_pripoj")
  let SELble = document.getElementById("ble_seznam")

  // kontrola zapnuti BLE

  BLEzobrazSparovanaZarizeni()

  BTbleHledej.addEventListener("click", () => {
    BTbleHledej.className = "rotate_slow"
    BLEzobrazNEsparovanaZarizeni()
  })

  BTblePripoj.addEventListener("click", () => {
    BLEpripojZarizeni(SELble.value)
  })
}
