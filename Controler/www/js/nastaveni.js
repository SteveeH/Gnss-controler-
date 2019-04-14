function eventyNastaveni() {
  let BTbleHledej = document.getElementById("ble_hledej")
  let BTblePripoj = document.getElementById("ble_pripoj")
  let SELble = document.getElementById("ble_seznam")

  let NTRIPip = document.getElementById("NTRIPip")
  let NTRIPport = document.getElementById("NTRIPport")
  let NTRIPuziv = document.getElementById("NTRIPuziv")
  let NTRIPheslo = document.getElementById("NTRIPheslo")
  let NTRIPmntp = document.getElementById("NTRIPmntp")
  let NTRIPpripoj = document.getElementById("NTRIPpripoj")
  let MNTPseznam = document.getElementById("mount_seznam")

  // kontrola zapnuti BLE
  BLEzobrazSparovanaZarizeni()
  // vlozeni predchozich hodnot
  NTRIPip.value = uloziste.getItem("NTRIPip")
  NTRIPport.value = uloziste.getItem("NTRIPport")
  NTRIPuziv.value = uloziste.getItem("NTRIPuziv")
  NTRIPheslo.value = uloziste.getItem("NTRIPheslo")

  NTRIPip.addEventListener("change", () => {
    uloziste.setItem("NTRIPip", NTRIPip.value)
  })

  NTRIPport.addEventListener("change", () => {
    uloziste.setItem("NTRIPport", NTRIPport.value)
  })

  NTRIPuziv.addEventListener("change", () => {
    uloziste.setItem("NTRIPuziv", NTRIPuziv.value)
  })
  NTRIPheslo.addEventListener("change", () => {
    uloziste.setItem("NTRIPheslo", NTRIPheslo.value)
  })

  NTRIPpripoj.addEventListener("click", () => {
    // kontrola vstupu
    if (NTRIPpripoj.innerText === "Připoj") {
      NTRIPClient(
        NTRIPip.value,
        NTRIPport.value,
        MNTPseznam.options[MNTPseznam.selectedIndex].text, // vzit ze ZDtabulka
        NTRIPuziv.value,
        NTRIPheslo.value
      )

      NTRIPpripoj.innerText = "Odpoj"
    } else {
      NTRIPpripoj.innerText = "Připoj"
      client.close()
    }
  })

  NTRIPmntp.addEventListener("click", () => {
    // kontrola vstupu
    zdrojovaTabulka(NTRIPip.value, NTRIPport.value)
  })

  BTbleHledej.addEventListener("click", () => {
    BTbleHledej.className = "rotate_slow"
    BLEzobrazNEsparovanaZarizeni()
  })

  BTblePripoj.addEventListener("click", () => {
    BLEpripojZarizeni(SELble.value)
  })
}
