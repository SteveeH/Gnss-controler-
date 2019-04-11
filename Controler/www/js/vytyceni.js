function eventyVytyceni() {
  let BTpodrobnosti = document.getElementById("BTpodrobnosti")
  let BTvytyceni = document.getElementById("BTvytyceni")
  let BTzavriBody = document.getElementById("BTzavriBody")
  let BTulozBod = document.getElementById("BTulozBod")

  BTpodrobnosti.addEventListener("click", () => {
    let podrobnosti = document.getElementById("podrobnosti")

    if (podrobnosti.style.display === "block") {
      podrobnosti.style.display = "none"
      BTpodrobnosti.innerText = "Zobraz podrobnosti"
    } else {
      podrobnosti.style.display = "block"
      BTpodrobnosti.innerText = "Skryj podrobnosti"
    }
  })

  // VYKRESLENI CANVAS
  let VYTcanvas = document.getElementById("VYTcanvas")
  let vyska = VYTcanvas.offsetHeight
  let sirka = VYTcanvas.offsetWidth
  let ctx = VYTcanvas.getContext("2d")

  // Dulezite nastavit sirku a vysku pomoci html atributu pro spravne
  // zobrazeni bez deformace
  VYTcanvas.setAttribute("width", sirka)
  VYTcanvas.setAttribute("height", vyska)

  /* sipka(ctx, sirka, vyska, 90) */
  /* intVytyceni = setInterval(() => {
    zobrazAzimuth()
  }, 1000) */

  BTvytyceni.addEventListener("click", () => {
    document.getElementById("modalBody").style.display = "block"
    document.getElementById("BTulozBod").style.display = "none"

    database.nactiBodyZakazky(idZAKAZKY, seznamBoduVytyc)
  })

  BTzavriBody.addEventListener("click", () => {
    document.getElementById("modalBody").style.display = "none"
    /* dron() */
  })

  BTulozBod.addEventListener("click", () => {
    // Potvrzeni zda chci opravdu bod ulozit (zobrazeni rozdilu souř.) nebo
    // budu pokracovat v mereni
    if (confirm("Ulozit vytycený bod??\n" + "dx: 1.532 m\n" + "dy: 1.059 m")) {
      document.getElementById("BTulozBod").style.display = "none"
      document.getElementById("VYTcisloBodu").innerText = "Vytyčení bodu: "

      // ukonceni vytycovani a ulozeni aktualni pozice a
      // presnosti vytyceni do databaze
      console.log("Bod byl uložen do databáze..")
      clearInterval(intVytyceni)
    } else {
      console.log("Pokračuji v měření..")
    }
  })
}

function sipka(ctx, sirka, vyska, uhel) {
  ctx.clearRect(0, 0, sirka, vyska)
  let maxPolomer = sirka < vyska ? sirka / 2 - 10 : vyska / 2 - 10
  // ulozeni prechozi pozice a natoceni
  ctx.save()
  // vykresleni cervene sipky
  ctx.translate(sirka / 2, vyska / 2)
  ctx.rotate((-uhel * Math.PI) / 180) //
  ctx.fillStyle = "red"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(15, 0)
  ctx.lineTo(0, -maxPolomer)
  ctx.lineTo(-15, 0)
  ctx.moveTo(0, 0)
  ctx.fill()
  // vykresleni vnitrniho kolecka
  ctx.beginPath()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 1
  ctx.arc(0, 0, maxPolomer, 0, 2 * Math.PI)
  ctx.stroke()
  // vykresleni okraje
  ctx.beginPath()
  ctx.strokeStyle = "black"
  ctx.fillStyle = "black"
  ctx.lineWidth = 2
  ctx.arc(0, 0, 10, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()

  // obnoveni natoceni
  ctx.restore()

  // ulozeni prechozi pozice a natoceni
  ctx.save()
  // zobrazeni popisku
  ctx.translate(sirka / 2, vyska / 2)
  ctx.font = "20px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("N", 0, -maxPolomer + 20)
  ctx.fillText("S", 0, +maxPolomer - 20)
  ctx.fillText("W", -maxPolomer + 20, 0)
  ctx.fillText("E", +maxPolomer - 20, 0)
  ctx.restore()
}

function zobrazAzimuth() {
  function onSuccess(heading) {
    let VYTcanvas = document.getElementById("VYTcanvas")
    let vyska = VYTcanvas.offsetHeight
    let sirka = VYTcanvas.offsetWidth
    let ctx = VYTcanvas.getContext("2d")
    sipka(ctx, sirka, vyska, heading.magneticHeading)
  }

  function onError(error) {
    console.log("CompassError: " + error.code)
  }

  navigator.compass.getCurrentHeading(onSuccess, onError)
}

function seznamBoduVytyc(data) {
  let pocet = data.length
  let modalBodySeznam = document.getElementById("modalBodySeznam")
  let htmlSeznam = ""

  for (let i = 0; i < pocet; i++) {
    htmlSeznam +=
      '<div class="bod">' +
      '<div class="info">' +
      "<p><b>" +
      data[i].nazevBodu +
      "</b></p>" +
      "<p>Zem. šířka: " +
      Round(data[i].lat, 9) +
      "°</p>" +
      "<p>Zem. délka: " +
      Round(data[i].lon, 9) +
      "°</p>" +
      "<p>Výška : " +
      Round(data[i].alt, 4) +
      " m</p>" +
      "</div>" +
      '<button class="vytycBod" value="' +
      data[i].id +
      '"><img src="img/pointer.svg"/></button></div>'
  }

  modalBodySeznam.innerHTML = htmlSeznam

  eventyVytycBod()
}

function eventyVytycBod() {
  let body = document.getElementsByClassName("vytycBod")

  for (var i = 0; i < body.length; i++) {
    body[i].addEventListener(
      "click",
      function() {
        vytycBod(this)
      },
      false
    )
  }
}

function vytycBod(tlac) {
  document.getElementById("BTulozBod").style.display = "block"
  document.getElementById("modalBody").style.display = "none"

  database.vytycBod(tlac.value, sour => {
    BodVytyc = sour
    document.getElementById("VYTcisloBodu").innerText =
      "Vytyčení bodu: " + BodVytyc.nazevBodu
    intVytyceni = setInterval(() => {
      vytycuj()
    }, 1000)
  })
}

function vytycuj() {
  console.log("vytyčuji bod: " + BodVytyc.nazevBodu)
}
