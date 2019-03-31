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
    udelejToast("Měření exportováno...")
  })

  Select.addEventListener("change", () => {
    console.log("Zvolena zakázka: " + Select.value)
    idZAKAZKY = Select.value
    database.infoZakazka(Select.value)
  })

  // NASTAVENI

  INPdatum.value = aktualniDatum()
}
