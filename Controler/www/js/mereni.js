function eventyMereni() {
  let SLdobaMereni = document.getElementById("SliderDobaMereni")
  let BTmereni = document.getElementById("BTmereni")
  let MERvyskaAnteny = document.getElementById("MERvyskaAnteny")
  let MERnazevBodu = document.getElementById("MERnazevBodu")

  // Elementy tabulky
  let MERcas = document.getElementById("MERcas")
  let MERzemSirka = document.getElementById("MERzemSirka")
  let MERzemDelka = document.getElementById("MERzemDelka")
  let MERvyska = document.getElementById("MERvyska")
  let MERpdop = document.getElementById("MERpdop")
  let MERlatP = document.getElementById("MERlatP")
  let MERlonP = document.getElementById("MERlonP")
  let MERaltP = document.getElementById("MERaltP")

  // Nastaveni hodnot podle predchozich
  MERvyskaAnteny.value = uloziste.getItem("vyskaAnteny")
  database.posledniBodZakazky(idZAKAZKY, cb => {
    MERnazevBodu.value = cb[0]["nazevBodu"] + 1
  })

  zobrazPosledniCisloBodu()
  zobrazDobuMereni()

  intInfoMereni = setInterval(function() {
    zobrazInfoMereni()
  }, 1000)

  SLdobaMereni.addEventListener("change", () => {
    zobrazDobuMereni()
  })

  BTmereni.addEventListener("click", () => {
    let text = BTmereni.innerText

    text === "MĚŘ" ? zacniMerit() : ulozMereni()
  })

  MERvyskaAnteny.addEventListener("change", () => {
    uloziste.setItem("vyskaAnteny", MERvyskaAnteny.value)
    vyskaAnteny = parseFloat(MERvyskaAnteny.value)
  })
}

function zobrazDobuMereni() {
  let slider = document.getElementById("SliderDobaMereni")
  let zobrazCas = document.getElementById("MERzobrazCas")
  let doba = slider.value

  zobrazCas.innerText = delkaMereniSTR(doba)
}

function zacniMerit() {
  let MERnazevBodu = document.getElementById("MERnazevBodu")
  let MERvyskaAnteny = document.getElementById("MERvyskaAnteny")
  let MERcas = document.getElementById("MERcas")
  let BTmereni = document.getElementById("BTmereni")

  // kontrola vstupnich dat a pripojeni prijimace
  if (gnnsPripojeno) {
    if (MERnazevBodu.value === "" || MERvyskaAnteny.value === "") {
      udelejToast("Vyplň název bodu a výšku antény.")
    } else {
      console.log("Měřím")
      BTmereni.innerText = "ULOŽ"
      BTmereni.style.backgroundColor = "red"

      MERENI = [] // prazdny objekt pro ulozeni merenych dat
      var delkaMereni = 0

      intMereni = setInterval(function() {
        delkaMereni++
        MERENI.push(DATA)
        MERcas.innerText = delkaMereniSTR(delkaMereni)

        if (delkaMereni > document.getElementById("SliderDobaMereni").value) {
          BTmereni.style.backgroundColor = "green"
        } else {
          BTmereni.style.backgroundColor = "red"
        }
      }, 1000)
    }
  } else {
    udelejToast("Gnss přijimač není připojen..", 500)
  }
}

function ulozMereni() {
  let MERnazevBodu = document.getElementById("MERnazevBodu")
  let MERvyskaAnteny = document.getElementById("MERvyskaAnteny")
  let MERcas = document.getElementById("MERcas")
  let noveCislo, stareCislo, vyskaAnteny

  // změna popisku
  BTmereni.innerText = "MĚŘ"
  BTmereni.style.backgroundColor = "orange"
  MERcas.innerText = delkaMereniSTR(0)

  vyskaAnteny = MERvyskaAnteny.value
  stareCislo = MERnazevBodu.value
  noveCislo = isNaN(parseInt(MERnazevBodu.value))
    ? MERnazevBodu + 1
    : parseInt(MERnazevBodu.value) + 1
  MERnazevBodu.value = noveCislo
  // ukonceni zaznamenavani dat
  clearInterval(intMereni)

  // analyza namerenych dat + ulozeni
  ulozZmerenyBod(MERENI, stareCislo, vyskaAnteny)
}

function ulozZmerenyBod(data, nazevBodu, vyskaAnteny) {
  let lat = 0
  let lon = 0
  let alt = 0
  let sep = 0
  let ctr = 0

  data.forEach(el => {
    // kontrola pozadovane konfigurace PDOP, fix typ
    if (true) {
      // pridani dat k vypoctu prumeru
      lat += parseFloat(el.GGA.LAT)
      lon += parseFloat(el.GGA.LON)
      alt += parseFloat(el.GGA.ALT)
      sep += parseFloat(el.GGA.SEP)
      ctr++
    }
  })

  database.ulozBod(
    idZAKAZKY,
    nazevBodu,
    lat / ctr,
    lon / ctr,
    alt / ctr,
    sep / ctr,
    vyskaAnteny
  )
}

function zobrazInfoMereni() {
  if (gnnsPripojeno && window.location.hash === "#mereni") {
    MERzemSirka.innerText = DATA.GGA.LAT + "°"
    MERlatP.innerText = "(" + DATA.GST.DEVlat + " m)"
    MERzemDelka.innerText = DATA.GGA.LON + "°"
    MERlonP.innerText = "(" + DATA.GST.DEVlon + " m)"
    MERvyska.innerText = DATA.GGA.ALT + " m"
    MERaltP.innerText = "(" + DATA.GST.DEValt + " m)"
    MERpdop.innerText = DATA.GSA.PDOP
  } else {
    clearInterval(intInfoMereni)
  }
}

function delkaMereniSTR(vteriny) {
  //
  let hodiny = Math.floor(vteriny / 3600)
  let minuty = Math.floor((vteriny - hodiny * 3600) / 60)
  let sec = vteriny - hodiny * 3600 - minuty * 60

  let str = ""
  str += hodiny + ":"
  str += minuty < 10 ? "0" + minuty : minuty
  str += ":"
  str += sec < 10 ? "0" + sec : sec

  return str
}
function zobrazPosledniCisloBodu() {
  //
}
