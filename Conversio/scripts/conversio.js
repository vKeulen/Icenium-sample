// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// Variable to handle if user is already logged in
// Login should be handled in webservice/api
LoggedIn = false;

// Datasource for the messages listview
var ds;

// PhoneGap is ready
function onDeviceReady() {
    initMessages();
}

function initMessages() {   

    // Create empty datasource for the messages listview
    ds = new kendo.data.DataSource();

    // Initial read of the items in to the data source
    ds.read();

    $("#listview").kendoMobileListView({
         dataSource: ds,
         template: $("#listview-template").html() //"#:message# #:senddate#"
    });

    // Let the user login first
    app.navigate("#login")
};    
  

//=======================Login Operations=======================//
// Is now handled locally but should be handled in a webservice/api
function DoLogin() {
    var UsrName = document.getElementById('txtUserinput').value;
    Passwd = document.getElementById('txtPasswordinput').value;

    if (UsrName=="test" && Passwd=="test")
    {
        document.getElementById('WrongLogin').innerHTML = "";
        LoggedIn = true;
        app.navigate("#messages");  
    } 
    else 
    {
        document.getElementById('WrongLogin').innerHTML = "Wrong username and/or password";        
//        console.log("login fout");
    }
}

function DoReset() {
    var txtLoginName = document.getElementById('txtUserinput');
    var txtPassword = document.getElementById('txtPasswordinput');

    txtLoginName.value = '';
    txtPassword.value = '';
}

function DoSend() {
    
    var MessToSend = document.getElementById('txtSendinput').value,
    m_names = new Array("jan", "feb", "mar", "apr", "mei", "jun", "jul", "aug", "sep", 
      "okt", "now", "dec");
    d = new Date();
    currday = d.getDate();
    currmonth = d.getMonth();
    curryear = d.getFullYear();
    currhours = d.getHours();
    currminutes = d.getMinutes();
    // Get current datetime
    MessSend = d.getDate() + " " + m_names[d.getMonth()] + " " + d.getFullYear() + " " + d.getHours() + ":" + ('0' + d.getMinutes()).slice(-2);
    
    // Extra check if user is logged in
    if (!LoggedIn) {
        app.navigate("#login");
    }
    // If message is entered send the message
    if (MessToSend != "") {
    
        // Create datasource for getting random message
        // The datasource read a json file from a remote server
        // to simulate remote access
        // This can also be a webservice that generates json output
        // to use on the listview
        var datasource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://www.excaliber.nl/messages.JSON",
                    dataType: "json"
                },
                model: {
                  id: "ID",
                  fields: {
                        id: {
                            type: "string"
                        },
                        message: {
                            type: "string"
                        },
                        senddate: {
                            type: "string"
                        }
                  }
                }
            }
        });
    
        // Get the actual random message
        datasource.fetch(function(){
          var rndm = Math.floor((Math.random()*datasource.total())+1);
          randommessage = datasource.view()[rndm];
        });

        //add message to the listview datasource
        ds.add({
          ID: "null",
          message: MessToSend,
          senddate: MessSend
        });
        //add random message to the listview datasource
        ds.add({
          id: randommessage.id,
          message: randommessage.message,
          senddate: randommessage.senddate
        });
        
    }
   
}