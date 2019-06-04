'use strict';

$(document).ready(function () {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', { 'packages': ['table'] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // get current track and display
  displayCurrent('#current_info_string');

  // update current song title and queue every n seconds
  var interval = 1000;
  setInterval(updateDisplay, interval);

  // get streams and draw select
  songsByType(5, function (resp, stat){
    console.log(resp);
    $.each(resp, function( index, value ) {
      $('#stream_selector').append('<option value="' + value.ID + '">' + value.title + '</option>');
    });
  });
});

function loadStream() {
  loadFile($( "#stream_selector" ).val());
}

function selectHandler(e) {
  var selection = table.getSelection()[0].row;
  alert(JSON.stringify(data.getValue(selection, 1) + " - " + data.getValue(selection, 0)));
}

// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart() {
  playQueue(function (resp, stat) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Artist');
    data.addColumn('string', 'Title');

    // Set chart options
    var options = {
      showRowNumber: true,
      'title': 'Upcoming Tracks',
      'height': 19
    };

    // dynamicly set height by number of items up to max
    var heightMax = 600;
    var itemHeight = 40;

    $.each(resp, function (i, x) {
      data.addRow([x.artist, x.title]);
      if (options.height + itemHeight <= heightMax) {
        options.height += itemHeight;
      }
    });

    // Instantiate our chart
    var table = new google.visualization.Table(document.getElementById('queue_table'));

    google.visualization.events.addListener(table, 'select', selectHandler);

    table.draw(data, options);
  });
}

function updateDisplay() {
  displayCurrent('#current_info_string', drawChart);
}
