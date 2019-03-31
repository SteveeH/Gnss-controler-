function SKY() {
  if (location.hash === "#skyplot") {
    vykresliSkyplot(maxPolomer, sirka, vyska)
    vykresliPopisky(maxPolomer, sirka, vyska)
    vykresliSatelity(DRUZICE.GL, maxPolomer, sirka, vyska, 0)
    vykresliSatelity(DRUZICE.GP, maxPolomer, sirka, vyska, 1)
  } else {
    clearInterval(sky)
  }
}

function vytvorSkyplot() {
  var plocha = document.getElementById("plocha")
  var canvas = document.createElement("canvas")
  var sirka = plocha.offsetWidth
  var vyska = plocha.offsetHeight

  canvas.setAttribute("id", "skyPlot")
  canvas.setAttribute("class", "skyplot")
  canvas.setAttribute("width", sirka)
  canvas.setAttribute("height", vyska)
  plocha.appendChild(canvas)

  // urceni maximalni polomeru Skyplotu
  var maxPolomer = sirka < vyska ? sirka / 2 - 15 : vyska / 2 - 15

  var ctx = canvas.getContext("2d")

  return [maxPolomer, sirka, vyska, ctx, canvas]
}

function vykresliSatelity(objekt, maxPolomer, sirka, vyska, typ) {
  // vyhledani aktivnich satelitu v GSA zprave
  var aktivniSatelity = []

  aktivniSatelity.concat(DATA.GSA.GP)
  aktivniSatelity.concat(DATA.GSA.GL)

  /*  console.log("AKTIV: " + aktivniSatelity); */

  objekt.forEach(el => {
    // kazdy el (element) ma tyto parametry :
    // id : identifikacni cislo satelitu
    // elevationDeg: elevace druzice
    // azimuthTrue: azimut druzice
    // SNRdB: kvalita signalu druzice (Signal Noice Ratio)

    // vzdalenost druzice od stredu skyplotu - uvazujeme linearni vztah
    var R = maxPolomer * (1 - el.elevationDeg / 90)
    var pozSatX = sirka / 2 + R * Math.cos(toRad(el.azimuthTrue - 90))
    var pozSatY = vyska / 2 + R * Math.sin(toRad(el.azimuthTrue - 90))

    if (typ == 0) {
      ctx.beginPath()
      ctx.strokeStyle = "black"
      /*  console.log(el);
      console.log(aktivniSatelity.includes(parseInt(el.id))); */
      ctx.fillStyle = "green"
      ctx.lineWidth = 2
      ctx.arc(pozSatX, pozSatY, maxPolomer / 15, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    } else {
      var diff = maxPolomer / 8
      ctx.beginPath()
      ctx.strokeStyle = "black"
      /* console.log(el.id); */
      ctx.fillStyle = aktivniSatelity.includes(parseInt(el.id))
        ? "green"
        : "red"
      ctx.lineWidth = 1
      ctx.rect(pozSatX - diff / 2, pozSatY - diff / 2, diff, diff)
      ctx.fill()
      ctx.stroke()
    }

    ctx.font = "12px Arial"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(el.id, pozSatX, pozSatY + 2)
  })
}

/* function vykresliSatelity(
  objekt,
  maxPolomer,
  sirka,
  vyska,
  barvaVypln,
  barvaText
) {
  objekt.forEach(el => {
    // kazdy el (element) ma tyto parametry :
    // id : identifikacni cislo satelitu
    // elevationDeg: elevace druzice
    // azimuthTrue: azimut druzice
    // SNRdB: kvalita signalu druzice (Signal Noice Ratio)

    // vzdalenost druzice od stredu skyplotu - uvazujeme linearni vztah
    var R = maxPolomer * (1 - el.elevationDeg / 90);
    var pozSatX = sirka / 2 + R * Math.cos(toRad(el.azimuthTrue - 90));
    var pozSatY = vyska / 2 + R * Math.sin(toRad(el.azimuthTrue - 90));

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = barvaVypln;
    ctx.lineWidth = 1.2;
    //ctx.fillStyle = barva;
    ctx.arc(pozSatX, pozSatY, maxPolomer / 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.font = "12px Arial";
    ctx.fillStyle = barvaText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(el.id, pozSatX, pozSatY + 2);
  });
} */

function vykresliSkyplot(maxPolomer, sirka, vyska) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  var barva1 = "rgb(221, 221, 211)"
  var barva2 = "rgb(99, 99, 99)"

  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.fillStyle = i % 2 ? barva1 : barva2
    ctx.arc(sirka / 2, vyska / 2, maxPolomer * ((6 - i) / 6), 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.translate(sirka / 2, vyska / 2)

  for (let uhel = 0; uhel < 360; uhel += 45) {
    var uuhel = uhel * (Math.PI / 180)

    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(0, 0)
    ctx.lineTo(maxPolomer * Math.sin(uuhel), maxPolomer * Math.cos(uuhel))
    ctx.stroke()
  }
  ctx.translate(-(sirka / 2), -(vyska / 2))
}

function vykresliPopisky(maxPolomer, sirka, vyska) {
  var elev = ["75°", "60°", "45°", "30°", "15°"]
  var azim = ["N", "45°", "E", "135°", "S", "225°", "W", "315°"]

  for (let j = 0; j < 8; j++) {
    var xx =
      sirka / 2 +
      (maxPolomer + (j % 2 ? 15 : 10)) * Math.cos(toRad(j * 45 - 90))
    var yy =
      vyska / 2 +
      (maxPolomer + (j % 2 ? 15 : 10)) * Math.sin(toRad(j * 45 - 90))

    ctx.font = "12px Arial"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(azim[j], xx, yy)
  }
}

/* function vykresliSkyplot(maxPolomer, sirka, vyska) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1.2;
  ctx.arc(sirka / 2, vyska / 2, maxPolomer, 0, 2 * Math.PI);
  ctx.arc(sirka / 2, vyska / 2, maxPolomer * (5 / 6), 0, 2 * Math.PI);
  ctx.arc(sirka / 2, vyska / 2, maxPolomer * (4 / 6), 0, 2 * Math.PI);
  ctx.arc(sirka / 2, vyska / 2, maxPolomer * (3 / 6), 0, 2 * Math.PI);
  ctx.arc(sirka / 2, vyska / 2, maxPolomer * (2 / 6), 0, 2 * Math.PI);
  ctx.arc(sirka / 2, vyska / 2, maxPolomer * (1 / 6), 0, 2 * Math.PI);
  ctx.stroke();

  ctx.translate(sirka / 2, vyska / 2);

  for (let uhel = 0; uhel < 360; uhel += 30) {
    var uuhel = uhel * (Math.PI / 180);

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, 0);
    ctx.lineTo(maxPolomer * Math.sin(uuhel), maxPolomer * Math.cos(uuhel));
    ctx.stroke();
  }
  ctx.translate(-(sirka / 2), -(vyska / 2));
}

function vykresliPopisky(maxPolomer, sirka, vyska) {
  var elev = ["75°", "60°", "45°", "30°", "15°"];
  var azim = [
    "N",
    "30°",
    "60°",
    "E",
    "120°",
    "150°",
    "S",
    "210°",
    "240°",
    "W",
    "300°",
    "330°"
  ];

  for (let i = 0; i < 5; i++) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
      elev[i],
      sirka / 2 + 2,
      vyska / 2 - (i + 1) * (maxPolomer / 6)
    );
  }

  for (let j = 0; j < 12; j++) {
    var xx = sirka / 2 + (maxPolomer + 10) * Math.cos(toRad(j * 30 - 90));
    var yy = vyska / 2 + (maxPolomer + 10) * Math.sin(toRad(j * 30 - 90));

    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(azim[j], xx, yy);
  }
} */

function toRad(uhel) {
  // funkce prevadi stupne na radiany
  return uhel * (Math.PI / 180)
}

function toDeg(uhel) {
  // funkce prevadi radiany na stupne
  return uhel * (180 / Math.PI)
}
