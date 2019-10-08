const dotenv = require('dotenv').config({path:"../.env"});
const moment = require('moment');
const Gpio = require('onoff').Gpio;
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
 
// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet(process.env.SHEET_ID);
var sheet;

let CurrentState, LastState = -1; // -1 = unkown, 0 = not active, 1 = active (douching)
let DoorState, LastDoorstate; // false = Door not Open, true = Door opened;
let LastChangeTimestamp = null; // Latest Door change



let WriteStateToSheet = (val = null) => {
    if(val == null) val = CurrentState;
    if(sheet !== undefined){
        sheet.addRow({
            "ID":"=ROW()-1", 
            "value":val,
            "timestamp": moment().format("D-M-Y HH:mm:ss")
        }, (err,data)=>{
            if(err){
                throw err;
            }else{
                console.log("✅ Last State Written ::: " + ((val) ? "DOUCHING" : "AVAILABLE"));
            }
        });
    }else{
        initialLoad();
    }
}

let InActiveChecker = setInterval(()=>{
    if(CurrentState == 1 && moment().diff(LastChangeTimestamp,'minutes') > 20){
        CurrentState = 0;
        WriteStateToSheet();
    }
}, 1000 * 30); // check every 30 sec for 20+ min. inactivity

let handleDoorStateChange = (newDoorState)=>{
    if(LastDoorstate !== newDoorState){
        // only when state changes (to prevent thro(tt)ling)
        DoorState = newDoorState;
        
        console.log("🚪 Doorstate Changed ::: " + (DoorState ? 'open' : 'closed'));

        // Trigger in specific situations when the door OPENS

        if(CurrentState == 1 && DoorState && moment().diff(LastChangeTimestamp,'minutes') < 20){
            // someone was douching and walks out
            console.log("👀 Someone was douching and walks out");
            CurrentState = 0;
            WriteStateToSheet();
            
        }else if(CurrentState !== 1 && DoorState){
            // someone walks in
            console.log("👀 Someone walks in, waiting for doorclose");
            setTimeout(()=>{
                // wait 10 seconds for the door to close
                if(!DoorState){
                    CurrentState = 1;
                    WriteStateToSheet();
                }
            }, 1000 * 10);
        }

        
        LastChangeTimestamp = moment();
        LastDoorstate = DoorState;
    }

}

let GPIOLoad = () =>{

    try {
        
        const microswitch = new Gpio(233, 'in', 'both'); 
        microswitch.watch((err, newDoorState) => {
            if (err) {
                throw err;
            } else{
                handleDoorStateChange(newDoorState);
            }
        });

        
        process.on('SIGINT', _ => {
            microswitch.unexport();
        });


    } catch (error) {
        console.log(error);
    }

}


let initialLoad = () => {
    async.series([
        function setAuth(step) {
            var creds = require('./credentials.json');
            doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                if(err){
                    throw err
                }else{
                    sheet = info.worksheets[0];
                    console.log("🚀 Database Worksheet Loaded");
                    // setTimeout(()=>{
                    //     handleDoorStateChange(true); 
                    //     setTimeout(()=>{
                    //         handleDoorStateChange(false);
                    //     },8000);
                    // },2000)
                    GPIOLoad();
                    step();
                }
            });
        }
    ], function(err){
        if( err ) {
            console.log('🚨 Error: '+err);
        }
    });
}

initialLoad();



