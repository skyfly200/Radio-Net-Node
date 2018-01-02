'use strict';


$(document).ready(function () {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', { 'packages': ['table'] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
});

function selectHandler(e) {
  var selection = table.getSelection()[0].row;
  alert(JSON.stringify(data.getValue(selection, 1) + " - " + data.getValue(selection, 0)));
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  playHistory(function (resp, stat) {
    // Set chart options
    let options = {
      showRowNumber: true,
      'title': 'Past Tracks',
      'height': 19
    };

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Artist');
    data.addColumn('string', 'Title');
    data.addColumn('string', 'Album');
    data.addColumn('string', 'Date Played');

    // dynamicly set height by number of items up to max
    var heightMax = 500;
    var itemHeight = 20;

    $.each(resp, function (i, x) {
      data.addRow([x.artist, x.title, x.album, moment(x.date_played).from(moment())]);
      if (options.height + itemHeight <= heightMax) {
        options.height += itemHeight;
      }
    });

    // Instantiate our chart
    var table = new google.visualization.Table(document.getElementById('queue_table'));

    //google.visualization.events.addListener(table, 'select', selectHandler);

    table.draw(data, options);
  });
}
