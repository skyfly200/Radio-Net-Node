'use strict';

$(document).ready(function () {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', { 'packages': ['table'] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  var eventID = -1;
  var selection = -1;
});

function displaySelected(e) {
  selection = table.getSelection();
  if (selection[0]) {
    eventID = data.getValue(selection[0].row, 0);
    getEvent(eventID, function (resp, stat) {
      if (resp != undefined) {
        var x = resp[0];
        displayEventInfo(x);
      }
    });
  }
}

function displayEventInfo(x) {
  $('#event_name').text(x.name);
  $('#event_type').text(event_run_types[x.type]);
  $('#event_datetime').text(formatDateTime(x));
  $('#event_category').text(x.category);
  $('#event_enabled').text("Enabled: " + x.enabled);
  $('#event_ID').text("ID: " + x.ID);
  $('#event_data').text(x.data);
}

function deleteSelected() {
  // propt for verify
  var selected = table.getSelection()[0].row;
  //console.log(selected);
  if (selected >= 0) {
    var title = data.getValue(selected, 0);
    var conf = confirm("Are you shure you want to delete event " + title + "?");
  } else {
    var conf = false;
  }
  if (conf) {
    deleteEvent(eventID, function (resp, stat) {
      drawChart();
      refreshEvents();
      $('#event_info').text('');
    });
  }
}

function editEvent() {
  var id = data.getValue(table.getSelection()[0].row, 0);
  loadEvent(id);
}

function copyEvent() {
  var id = data.getValue(table.getSelection()[0].row, 0);
  loadEvent(id, true);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  getEvents(function (resp, stat) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'ID');
    data.addColumn('string', 'Title');
    data.addColumn('string', 'Time & Date');
    data.addColumn('string', 'Category');
    data.addColumn('string', 'Enabled');

    // Set chart options
    var options = {
      'title': 'Events',
      'height': 19
    };

    // dynamicly set height by number of items up to max
    var heightMax = 600;
    var itemHeight = 40;

    $.each(resp, function (i, x) {
      data.addRow([x.ID, x.name, formatDateTime(x), x.category, x.enabled]);
      if (options.height + itemHeight <= heightMax) {
        options.height += itemHeight;
      }
    });

    // Instantiate our chart
    var table = new google.visualization.Table(document.getElementById('queue_table'));

    google.visualization.events.addListener(table, 'select', displaySelected);

    table.draw(data, options);
  });
}
