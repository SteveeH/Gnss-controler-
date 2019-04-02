/* var htmlDomov = "" */
function aktualniDatum() {
  var ad = new Date()

  var datum =
    ad.getYear() -
    100 +
    2000 +
    "-" +
    (ad.getMonth() + 1 < 10 ? "0" + (ad.getMonth() + 1) : ad.getMonth() + 1) +
    "-" +
    (ad.getDate() < 10 ? "0" + ad.getDate() : ad.getDate())

  return datum
}

function eventyDomov() {
  var BTplus = document.getElementById("BTpridejZakazku")
  var BTzavri = document.getElementById("BTzavri")
  var BTexportMereni = document.getElementById("BTexportMereni")
  var BTzalozZakazku = document.getElementById("BTzalozZakazku")
  var BTvymazZakazku = document.getElementById("BTvymazZakazku")
  var BTimportBodu = document.getElementById("BTimportBodu")
  var Select = document.getElementById("seznamZakazek")

  var INPnazevZakazky = document.getElementById("INPnazevZakazky")
  var INPdatum = document.getElementById("INPdatum")
  var INPpopis = document.getElementById("INPpopis")

  // EVENTY
  BTplus.addEventListener("click", () => {
    document.getElementById("modalZakazka").style.display = "block"
  })

  BTzavri.addEventListener("click", () => {
    document.getElementById("modalZakazka").style.display = "none"
  })

  BTzalozZakazku.addEventListener("click", () => {
    if (INPnazevZakazky.value === "") {
      udelejToast("Vyplň název zakázky..")
    } else {
      database.vytvorZakazku(
        INPnazevZakazky.value,
        INPdatum.value,
        INPpopis.value
      )

      INPnazevZakazky.value = ""
      INPdatum.value = aktualniDatum()
      INPpopis.value = ""

      database.seznamZakazek()

      document.getElementById("modalZakazka").style.display = "none"
    }
  })

  BTvymazZakazku.addEventListener("click", () => {
    let Select = document.getElementById("seznamZakazek")

    let odpoved = confirm(
      "Opravdu chcete vymazat zakázku - " +
        Select.options[Select.selectedIndex].innerText +
        " ??"
    )

    if (odpoved) {
      database.vymazZakazku(Select.value)
      database.seznamZakazek()
      Select.selectedIndex = 0
      idZAKAZKY = Select.value
      domov()
    }
  })

  BTexportMereni.addEventListener("click", () => {
    database.exportujZakazku(idZAKAZKY)
  })

  BTimportBodu.addEventListener("click", () => {
    // Otevreni nativni aplikace, kde se vybere soubor, ktery se ma
    // souradnice bodu

    // link:
    //https://ourcodeworld.github.io/cordova/cordova-filebrowser.html
    window.OurCodeWorld.Filebrowser.filePicker.single({
      success: function(data) {
        if (!data.length) {
          // Zadny soubor neni vybran
          return
        }
        //
        //  Zde se budou nahrávat data do databaze
        //

        console.log(data)
        // Pole s cestou k souboru
        // ["file:///storage/emulated/0/CVUT_gnss/2/2_body.txt"]
      },
      error: function(err) {
        console.log(err)
      }
    })
  })

  Select.addEventListener("change", () => {
    console.log("Zvolena zakázka: " + Select.value)
    idZAKAZKY = Select.value
    database.infoZakazka(Select.value)
  })

  // NASTAVENI

  INPdatum.value = aktualniDatum()
}
