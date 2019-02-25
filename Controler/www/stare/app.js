document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        //var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
        console.log("Zařízení je připraveno!")
    }


    var db = window.openDatabase("pp", "1.0", "Test DB", 1000000);

    db.transation(insertDB,errorDB);

    function insertDB(tx){
        tx.executeSql("INSERT INTO pp (jmeno, primeni) VALUES (?,?)", ["stepan","hodik"],sucess, error);
    }

    function errorDB(er) {
        console.log("error : " + er);
    }

    function sucess(e){
        console.log("NICE");
        }


    function error(er) {
        console.log("error : " + er);
    }