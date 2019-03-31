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
        /*  console.log("Table zakazky been created.") */
      },
      function(sqlTransaction, sqlError) {
        console.log("Table zakazky err: " + sqlError)
      }
    )
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS body (id  INTEGER PRIMARY KEY AUTOINCREMENT, idZakazky INTEGER, nazevBodu INT UNIQUE, lat FLOAT, lon FLOAT, alt FLOAT, sep FLOAT, vyska FLOAT, date_added TIMESTAMP DEFAULT (datetime('now','localtime')))",
      [],
      function(sqlTransaction, sqlResultSet) {
        /* console.log("Table body been created.") */
      },
      function(sqlTransaction, sqlError) {
        console.log("Table body err: " + sqlError)
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

        /* console.log(tx)
        console.log(rs) */
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
      "INSERT INTO body (idZakazky, nazevBodu, lat, lon, alt, sep,vyska) VALUES (?,?,?,?,?,?,?)",
      [idZakazky, nazev, lat, lon, alt, sep, vyska],
      function(tx, rs) {
        console.log(rs)
        console.log(tx)
      },
      function(tx, e) {
        console.log("Error: " + e.message)
      }
    )
  })
}

Databaze.prototype.nactiBody = function(idZakazky) {
  this.mydb.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT * FROM body WHERE idZakazky=?",
      [idZakazky],
      function(tx, rs) {
        console.log(JSON.stringify(rs.rows))
        return rs.rows
      },
      function(tx, er) {
        console.log(er)
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
  let INFOpocetLetu = document.getElementById("INFOpocetLetu")

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
