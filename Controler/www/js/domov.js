var htmlDomov = "";
function aktualniDatum() {
  var ad = new Date();

  var datum =
    ad.getYear() -
    100 +
    2000 +
    "-" +
    (ad.getMonth() + 1 < 10 ? "0" + (ad.getMonth() + 1) : ad.getMonth() + 1) +
    "-" +
    (ad.getDate() < 10 ? "0" + ad.getDate() : ad.getDate());

  return datum;
}

function eventyDomov() {
  var BTplus = document.getElementById("BTpridejZakazku");
  var BTzavri = document.getElementById("BTzavri");
  var BTzalozZakazku = document.getElementById("BTzalozZakazku");

  var INPnazevZakazky = document.getElementById("INPnazevZakazky");
  var INPdatum = document.getElementById("INPdatum");
  var INPpopis = document.getElementById("INPpopis");

  BTplus.addEventListener("click", () => {
    document.getElementById("modalZakazka").style.display = "block";
  });

  BTzavri.addEventListener("click", () => {
    document.getElementById("modalZakazka").style.display = "none";
  });

  BTzalozZakazku.addEventListener("click", () => {
    console.log("Název zakázky: " + INPnazevZakazky.value);
    console.log("Datum zakázky: " + INPdatum.value);
    console.log("Popis zakázky: " + INPpopis.value);
  });
}
