// Variable declarations
var map;
var unit="m";
var unit_factor = 1.0;
var spacing=10;
var heading=null;
var horizontal_distance=null;
var vertical_distance=null;

var nb_points = [];
var point_list = [];

var center_line=null;

var bottom_terminal = {
  latitude:null,
  longitude:null,
  length:15,
  width:10,
  station:null,
  elevation:null,
  marker:null,
  offset:20,
  rectangle:null,
  description:"Bottom terminal",
};

var top_terminal = {
  latitude:null,
  longitude:null,
  length:15,
  width:10,
  station:null,
  elevation:null,
  marker:null,
  offset:20,
  rectangle:null,
  description:"Top terminal",
};

// Caching the DOM
const unit_field = document.getElementById("units");
const spacing_field = document.getElementById("spacing");

const bottom_terminal_latitude_field = document.getElementById("bot_lat");
const bottom_terminal_longitude_field = document.getElementById("bot_lon");
const bottom_terminal_elevation_field = document.getElementById("bot_elev");
const bottom_terminal_length_field = document.getElementById("bot_length");
const bottom_terminal_width_field = document.getElementById("bot_width");
const bottom_terminal_offset_field = document.getElementById("bot_offset");

const top_terminal_latitude_field = document.getElementById("top_lat");
const top_terminal_longitude_field = document.getElementById("top_lon");
const top_terminal_elevation_field = document.getElementById("top_elev");
const top_terminal_length_field = document.getElementById("top_length");
const top_terminal_width_field = document.getElementById("top_width");
const top_terminal_offset_field = document.getElementById("top_offset");


const number_points_field = document.getElementById("nb_points");
const heading_field = document.getElementById("heading");
const horizontal_distance_field = document.getElementById("Hdist");
const vertical_distance_field = document.getElementById("Vdist");

const clear_all_btn = document.getElementById("clearAllBtn");
const view_elevation_btn = document.getElementById("viewElevBtn");
const export_csv_btn = document.getElementById("csvBtn");
const export_pdf_btn = document.getElementById("pdfBtn");
const view_profile_chart_btn = document.getElementById("viewProfileBtn");
const msgBox = document.getElementById("msgBox");

// Initial values


unit_field.value = unit
spacing_field.value = Number(10).toFixed(2);

  
bottom_terminal_latitude_field.value = ""
bottom_terminal_longitude_field.value = ""
bottom_terminal_elevation_field.value = ""
bottom_terminal_length_field.value = Number(bottom_terminal.length*unit_factor).toFixed(2);
bottom_terminal_width_field.value = Number(bottom_terminal.width*unit_factor).toFixed(2);
bottom_terminal_offset_field.value = Number(bottom_terminal.offset*unit_factor).toFixed(2);

top_terminal_latitude_field.value = ""
top_terminal_longitude_field.value = ""
top_terminal_elevation_field.value = ""
top_terminal_length_field.value = Number(top_terminal.length*unit_factor).toFixed(2);
top_terminal_width_field.value = Number(top_terminal.width*unit_factor).toFixed(2);
top_terminal_offset_field.value = Number(top_terminal.offset*unit_factor).toFixed(2);

number_points_field.value =""
heading_field.value = ""
horizontal_distance_field.value = ""
vertical_distance_field.value = ""


// Event listener
unit_field.addEventListener("change", unit_change);
spacing_field.addEventListener("focusout", spacing_change);

bottom_terminal_latitude_field.addEventListener("focusout", bottom_terminal_coord_change);
bottom_terminal_longitude_field.addEventListener("focusout", bottom_terminal_coord_change);
bottom_terminal_length_field.addEventListener("focusout", bottom_terminal_geometry_change);
bottom_terminal_width_field.addEventListener("focusout", bottom_terminal_geometry_change);
bottom_terminal_offset_field.addEventListener("focusout", bottom_terminal_offset_change);

top_terminal_latitude_field.addEventListener("focusout", top_terminal_coord_change);
top_terminal_longitude_field.addEventListener("focusout", top_terminal_coord_change);
top_terminal_length_field.addEventListener("focusout", top_terminal_geometry_change);
top_terminal_width_field.addEventListener("focusout", top_terminal_geometry_change);
top_terminal_offset_field.addEventListener("focusout", top_terminal_offset_change);

clear_all_btn.addEventListener("click", clear_all);

// MAP INIT //
function initMap() {
  elevator = new google.maps.ElevationService;

  

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 53,lng: -90},
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
  });

  map.addListener('click', map_click);

  var input = document.getElementById('pac-input');
  input.value = "Search";

  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  center_line = new google.maps.Polyline({
    strokeColor: 'black',
    strokeOpacity: 0.7,
    strokeWeight: 1,
    map: map,
  });

  bottom_terminal.marker = new google.maps.Marker({

    map: map,
    draggable: true,
    icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: "blue",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "blue"
      }
    });

  top_terminal.marker = new google.maps.Marker({

    map: map,
    draggable: true,
    icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "red"
    }
  });
  
  bottom_terminal.marker.addListener('drag', drag_bottom_terminal);
  bottom_terminal.marker.addListener('dragend', dragend_bottom_terminal);
  top_terminal.marker.addListener('drag', drag_top_terminal);
  top_terminal.marker.addListener('dragend', dragend_top_terminal);

  top_terminal.rectangle = new google.maps.Polygon({
    strokeColor: '#FF0000',
    strokeOpacity: 0.4,
    strokeWeight: 0.2,
    fillColor: '#FF0000',
    fillOpacity: 0.4,
    map:map
  });
  bottom_terminal.rectangle = new google.maps.Polygon({
    strokeColor: '#0000FF',
    strokeOpacity: 0.4,
    strokeWeight: 0.2,
    fillColor: '#0000FF',
    fillOpacity: 0.4,
    map:map
  })

  clear_bottom_terminal_marker();
  clear_top_terminal_marker();
  clear_bottom_terminal_rectangle();
  clear_top_terminal_rectangle();


}