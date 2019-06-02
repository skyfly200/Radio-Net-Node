function selectHandler(e) {
  var selection = table.getSelection()[0].row;
  alert(JSON.stringify(data.getValue(selection,1)+" - "+data.getValue(selection,0)));
}

// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart() {
  playQueue( function(resp, stat) {
    // Create the data table.
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Artist');
    data.addColumn('string', 'Title');

    console.log(resp);

    $.each(resp, function(i, x) {
      data.addRow([x.artist, x.title]);
    });

    // Instantiate our chart
    let table = new google.visualization.Table(document.getElementById('queue_table'));

    google.visualization.events.addListener(table, 'select', selectHandler);

    table.draw(data, options);
  });
}

function updateDisplay() {
  displayCurrent('#current_info_string', drawChart);
}

$(document).ready( function() {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['table']});

  // Set chart options
  options = {
    'showRowNumber': true,
    'title':'Upcoming Tracks',
    'width':400,
    'height':350
  };

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // get current track and display
  displayCurrent('#current_info_string');

  // update current song title and queue every n seconds
  var interval = 1000;
  setInterval(updateDisplay, interval);

});
