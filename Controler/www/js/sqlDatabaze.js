// DATABAZE

function Databaze() {
  this.mydb = false
}

Databaze.prototype.initDB = function() {
  try {
    if (!window.openDatabase) {
      alert("Databáze není podporována")
    } else {
      var shortName = "DB"
      var version = "1.0"
      var displayName = "DB gnns"
      var maxSize = 2 * 1024 * 1024 // bajt
      this.mydb = openDatabase(shortName, version, displayName, maxSize)
    }
  } catch (e) {
    console.log(e)
  }
}

Databaze.prototype.vytvorTabulky = function() {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS zakazky (id  INTEGER PRIMARY KEY AUTOINCREMENT, nazev UNIQUE NOT NULL, datum CHAR, popis TEXT)",
      [],
      function(sqlTransaction, sqlResultSet) {
        /*  console.log("Tabulka zakazky byla zalozena.") */
      },
      function(sqlTransaction, sqlError) {
        console.log("Table zakazky err: " + sqlError.message)
      }
    )
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS body (id INTEGER PRIMARY KEY AUTOINCREMENT, idZakazky INTEGER, nazevBodu INT NOT NULL, lat FLOAT, lon FLOAT, alt FLOAT, sep FLOAT, vyska FLOAT, datum TIMESTAMP DEFAULT (datetime('now','localtime')), typ CHAR)",
      [],
      function(sqlTransaction, sqlResultSet) {
        /* console.log("Tabulka body byla zalozena.") */
      },
      function(sqlTransaction, sqlError) {
        console.log("Table body err: " + sqlError.message)
      }
    )
    tx.executeSql(
      "INSERT INTO zakazky (id,nazev,datum) SELECT 1,'Testovaci zakazka',datetime('now','localtime') WHERE NOT EXISTS (SELECT * FROM zakazky)",
      [],
      function(tx, rs) {
        if (rs.rowsAffected) {
          // 1 - kdyz bylo nutne zakazku vytvorit / 0 - kdyz ne
          console.log(
            "Zadne zakazky nenalezeny -> vytvorena testovaci zakazka."
          )
        } else {
          console.log("Zakazky jsou v pořádku načteny.. ")
        }
      },
      function(tx, e) {
        console.log("Vytvoreni testovaci zakazky err : " + e.message)
      }
    )
    /* tx.executeSql(
      "CREATE TABLE IF NOT EXISTS let (idLetu INTEGER PRIMARY KEY , idZakazky INTEGER, nazevLetu TEXT, lat FLOAT, lon FLOAT, alt FLOAT, sep FLOAT, datum CHAR, popis TEXT)",
      [],
      function(sqlTransaction, sqlResultSet) {
        console.log("Table let been created.")
      },
      function(sqlTransaction, sqlError) {
        console.log("Table let err: " + sqlError.message)
      }
    ) */
  })
}

Databaze.prototype.vytvorZakazku = function(jmenoZakazky, datum, popis) {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      "INSERT INTO zakazky (nazev, datum, popis) VALUES (?,?,?)",
      [jmenoZakazky, datum, popis],
      function(tx, rs) {
        var Select = document.getElementById("seznamZakazek")

        database.infoZakazka(rs.insertId)
        Select.value = rs.insertId
        idZAKAZKY = rs.insertId
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.zobrazTabulky = function() {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      'SELECT tbl_name from sqlite_master WHERE type = "table"',
      [],
      function(tx, rs) {
        console.log(tx)
        console.log(rs)
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.vytycBod = function(idBodu, funkce) {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      "SELECT * from body WHERE id = ?",
      [idBodu],
      function(tx, rs) {
        funkce(rs.rows[0])
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.ulozBod = function(
  idZakazky,
  nazev,
  lat,
  lon,
  alt,
  sep,
  vyska
) {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      "INSERT INTO body (idZakazky, nazevBodu, lat, lon, alt, sep,vyska,typ) VALUES (?,?,?,?,?,?,?,?)",
      [idZakazky, nazev, lat, lon, alt, sep, vyska, "mer"],
      function(tx, rs) {
        /*  console.log(rs)
        console.log(tx) */
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.importujBod = function(idZakazky, nazev, lat, lon, alt) {
  this.mydb.transaction(function(tx) {
    tx.executeSql(
      "INSERT INTO body (idZakazky, nazevBodu, lat, lon, alt,vyska,typ) VALUES (?,?,?,?,?,?,?)",
      [idZakazky, nazev, lat, lon, alt, 0, "imp"],
      function(tx, rs) {
        console.log(rs)
        /*console.log(tx) */
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.nactiBodyZakazky = function(idZakazky, funkce) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT * FROM body WHERE idZakazky=? ORDER BY nazevBodu",
      [idZakazky],
      function(tx, rs) {
        funkce(rs.rows)
      },
      function(tx, er) {
        console.log(er)
      }
    )
  })
}

Databaze.prototype.posledniBodZakazky = function(idZakazky, funkce) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT * FROM body WHERE idZakazky=? ORDER BY datum DESC LIMIT 1",
      [idZakazky],
      function(tx, rs) {
        funkce(rs.rows)
      },
      function(tx, er) {
        console.log(er)
      }
    )
  })
}

Databaze.prototype.exportujZakazku = function(idZakazky) {
  let txt = ""
  let nazevZak = ""

  var DB = this.mydb

  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT nazev,datum FROM zakazky WHERE id=?",
      [idZakazky],
      function(tx, rs) {
        txt += "Název zakázky : " + rs.rows[0]["nazev"] + "\n"
        txt += "Datum vytvoření : " + rs.rows[0]["datum"] + "\n"

        nazevZak = rs.rows[0]["nazev"]

        DB.transaction(function(transaction) {
          transaction.executeSql(
            "SELECT * FROM body WHERE idZakazky=?",
            [idZakazky],
            function(tx, rs) {
              let pocetBodu = rs.rows.length

              txt += "Počet bodů : " + pocetBodu + "\n"
              txt += "==========================================\n"
              txt += "|nazev b.|lat|lon|alt|sep|vyska ant.|datum\n"
              txt += "==========================================\n"

              for (let i = 0; i < pocetBodu; i++) {
                let nazev = rs.rows[i]["nazevBodu"]
                let lat = rs.rows[i]["lat"]
                let lon = rs.rows[i]["lon"]
                let alt = rs.rows[i]["alt"]
                let sep = rs.rows[i]["sep"]
                let vyska = rs.rows[i]["vyska"]
                let datum = rs.rows[i]["datum"]

                txt +=
                  nazev +
                  "," +
                  lat +
                  "," +
                  lon +
                  "," +
                  alt +
                  "," +
                  sep +
                  "," +
                  vyska +
                  "," +
                  datum +
                  "\n"
              }

              exportujMereni(nazevZak, txt)
            },
            function(tx, er) {
              console.log(er)
            }
          )
        })
      },
      function(tx, er) {
        console.log(er.message)
      }
    )
  })
}

Databaze.prototype.vymazBod = function(id) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "DELETE FROM body WHERE id=?",
      [id],
      function(tx, rs) {
        console.log(rs)
      },
      function(tx, er) {
        console.log(er)
      }
    )
  })
}

Databaze.prototype.upravBod = function(id, nazev, vyska) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "UPDATE body SET nazevBodu = " +
        nazev +
        ",vyska = " +
        vyska +
        " WHERE id=?",
      [id],
      function(tx, rs) {
        console.log(rs)
      },
      function(tx, er) {
        console.log(er)
      }
    )
  })
}

Databaze.prototype.seznamZakazek = function() {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT id,nazev FROM zakazky ORDER BY id",
      [],
      function(tx, rs) {
        let Select = document.getElementById("seznamZakazek")
        let pocet = rs.rows.length
        let html = ""

        if (pocet > 0) {
          for (let i = 0; i < pocet; i++) {
            html +=
              "<option value=" +
              rs.rows[i].id +
              ">" +
              rs.rows[i].nazev +
              "</option>"
          }
        }
        Select.innerHTML = html
        Select.value = idZAKAZKY
      },
      function(tx, er) {
        console.log(er.message)
      }
    )
  })
}

Databaze.prototype.vymazZakazku = function(idZakazky) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "DELETE FROM body WHERE idZakazky=?",
      [idZakazky],
      function(tx, rs) {
        /* console.log(rs)
        console.log("Bylo úspěšně vymazáno ?? bodů..") */
      },
      function(tx, er) {}
    )

    transaction.executeSql(
      "DELETE FROM zakazky WHERE id=?",
      [idZakazky],
      function(tx, rs) {
        console.log(rs)
        console.log("Zakázka byla vymazána..")
      },
      function(tx, er) {}
    )
  })
}

Databaze.prototype.infoZakazka = function(idZakazky) {
  let INFOnazevZakazky = document.getElementById("INFOnazevZakazky")
  let INFOdatumVytvoreni = document.getElementById("INFOdatumVytvoreni")
  let INFOpocetBodu = document.getElementById("INFOpocetBodu")

  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT nazev,datum FROM zakazky WHERE id=?",
      [idZakazky],
      function(tx, rs) {
        INFOnazevZakazky.innerText = "Název zakázky : " + rs.rows[0]["nazev"]
        INFOdatumVytvoreni.innerText =
          "Datum vytvoření : " + rs.rows[0]["datum"]
      },
      function(tx, er) {
        console.log(er.message)
      }
    )

    transaction.executeSql(
      "SELECT COUNT(*) FROM body WHERE idZakazky=?",
      [idZakazky],
      function(tx, rs) {
        INFOpocetBodu.innerText =
          "Počet změřených bodů : " + rs.rows[0]["COUNT(*)"]
      },
      function(tx, er) {
        console.log("pocet bodu chyba " + er.message)
      }
    )
  })
}

function importDat(data) {
  // urci pocet bodu
  let pocet = Object.keys(data).length

  for (let i = 0; i < pocet; i++) {
    let nazevBodu = data[i][0]
    let lat = parseFloat(data[i][1])
    let lon = parseFloat(data[i][2])
    let alt = parseFloat(data[i][3])
    console.log("Imp:")
    console.log("Nazev bodu: " + nazevBodu)
    console.log("sirka: " + lat)
    console.log("delka: " + lon)
    console.log("vyska: " + alt)
    console.log("========================")
    database.importujBod(idZAKAZKY, nazevBodu, lat, lon, alt)
  }

  udelejToast("Počet importovaných bodů : " + pocet, 500)
  database.infoZakazka(idZAKAZKY)
}
