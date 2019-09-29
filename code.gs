
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Open Input Window', functionName: 'mainFunc'}
  ];
  spreadsheet.addMenu('Iterative Input', menuItems);
}

//Simulate range cell names 
function getColumnName(col) {
  var ABC = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  if (col < 26) {
    return ABC[col];
  }
  else {
    var diff = col - 26;
    return (ABC[0].concat(ABC[diff]));
  }
}

function mainFunc() {
  var spreadsheetId = '1tXoUCQRGkMmzX9uAoUe6NdwfRp2kQ34ETuJwCXzxBMQ';  

  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var ui = SpreadsheetApp.getUi(); // Same variations
   
  var breaker = false;
  var continuer = false;
  var endcol = data[3].length;
  for (var row = 5; row < data.length; row++) { //we start writing from the 6th row
    //we initiate row values everytime we start a new row 
    var rowvalues = [];
    var startcol = 0;
    //length of columns is as much as of the data of the 4th row (titles)
    for (var col = 0; col < data[3].length; col++){
      var prompt1 = "";
      var prompt2 = "";
      //start by next blank cell
      //else move on with the loop
      var cell = data[row][col];
      Logger.log('Value of first cell is ' + cell);
      if (cell != "") {
        //start column might be the next one
        startcol = col + 1;
        continue;
        //so we store it to define scope of range
      }
      else {
        if (col == 0) {
           prompt1 = "New row";
           prompt2 = "Start by giving ESN Country Name";
        }
        else if (col == 1) {
           prompt1 = "New row";
           prompt2 = "Now give ESN Section Name";
        }
        //TODO start to define the social media columns
        else {
          //values[row][0] is the name of every section
          //values[0][col] refers to the title of each column
          var section = "";
          if (data[row][1] == "") { //if user didn't start by providing esn section name
            section = rowvalues[1];
          }
          else {
            section = data[row][1];
          }
          prompt1 = "Please enter "+ data[3][col] + " for " + section;
          prompt2 = "For example: "+ data[4][col] ;
        }
        var result = ui.prompt(
          prompt1,prompt2,
          ui.ButtonSet.OK_CANCEL);
        var button = result.getSelectedButton();
        var text = result.getResponseText();
        if (button == ui.Button.OK) {
          // User clicked "OK".
          //ui.alert('' + text + '.');
          if (continuer) {
            //if user overwrites previous value
            rowvalues.pop();
            //we extract previous value
            continuer = false;
            //and continuer is false until cancel is being hit again
          }
          //and enter the next one no matter what
          rowvalues.push(text);
        } else if (button == ui.Button.CANCEL) {
          // User clicked "Cancel".
          //ui.alert('Going back to previous cell .');
          col = col - 2;
          //we decrease two because it will be increased 
          //we only enter new value when they click okay
          continuer = true;
          continue;
        } else if (button == ui.Button.CLOSE) {
          // User clicked X in the title bar.
          //ui.alert('You closed the dialog. Values for row ');
          //break;
          breaker = true;
          endcol = col;
          break;
        }
      }
    }
   //now we enter values for the row we're at
   var valueRange = Sheets.newValueRange();       
   //if row is not occupied until the very end
   //nested array needed for range
   valueRange.values = [rowvalues];
   var range = '4.ScreeningReport_v2.0!' + (getColumnName(startcol)).toUpperCase() + (row + 1) + ':'+ (getColumnName(endcol)).toUpperCase() + (row + 1);
    var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
      valueInputOption: 'USER_ENTERED'
    });
    //( values[row][0], values[row][1],values[row][2],values[row][3],values[row][4]);
   //if the user chose to exit we have first saved and now we exit
    if (breaker) {
      //break outer loop too
      ui.alert('Goodbye' );
      break;
    }
  }
}
