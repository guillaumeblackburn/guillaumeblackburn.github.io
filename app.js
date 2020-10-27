// Gloabal Variables declarations
var MAP;     //Map
var CONFIG;  // App configuration
var PROFILE; // Profile data
var ELEV;    // List of the elevation points
var CL;      // Center-line
var BS;      // Bottom station
var TS;       // Top station



// Caching the DOM
const unit_field = document.getElementById("units");
const spacing_field = document.getElementById("spacing");

const bs_latitude_field = document.getElementById("bot_lat");
const bs_longitude_field = document.getElementById("bot_lon");
const bs_elevation_field = document.getElementById("bot_elev");
const bs_length_field = document.getElementById("bot_length");
const bs_width_field = document.getElementById("bot_width");
const bs_offset_field = document.getElementById("bot_offset");

const ts_latitude_field = document.getElementById("top_lat");
const ts_longitude_field = document.getElementById("top_lon");
const ts_elevation_field = document.getElementById("top_elev");
const ts_length_field = document.getElementById("top_length");
const ts_width_field = document.getElementById("top_width");
const ts_offset_field = document.getElementById("top_offset");


const number_points_field = document.getElementById("nb_points");
const heading_field = document.getElementById("heading");
const horizontal_distance_field = document.getElementById("Hdist");
const vertical_distance_field = document.getElementById("Vdist");

const clear_all_btn = document.getElementById("clearAllBtn");
const get_elevation_btn = document.getElementById("getElevBtn");
//const view_elevation_btn = document.getElementById("viewElevBtn");
const export_csv_btn = document.getElementById("csvBtn");
//const export_pdf_btn = document.getElementById("pdfBtn");
//const view_profile_chart_btn = document.getElementById("viewProfileBtn");
//const msgBox = document.getElementById("msgBox");

// Event listener
unit_field.addEventListener("change", unit_change);
spacing_field.addEventListener("focusout", spacing_change);

bs_latitude_field.addEventListener("focusout", bs_coord_change);
bs_longitude_field.addEventListener("focusout", bs_coord_change);
bs_length_field.addEventListener("focusout", bs_geometry_change);
bs_width_field.addEventListener("focusout", bs_geometry_change);
bs_offset_field.addEventListener("focusout", bs_offset_change);

ts_latitude_field.addEventListener("focusout", ts_coord_change);
ts_longitude_field.addEventListener("focusout", ts_coord_change);
ts_length_field.addEventListener("focusout", ts_geometry_change);
ts_width_field.addEventListener("focusout", ts_geometry_change);
ts_offset_field.addEventListener("focusout", ts_offset_change);

clear_all_btn.addEventListener("click", clear_all);
get_elevation_btn.addEventListener("click", get_elevation_points);
export_csv_btn.addEventListener("click",export_csv_btn_click);


// MAP INIT //
function initMap() {
  initial_state();
  clear_all_fields();
  elevator = new google.maps.ElevationService;  
  MAP = new google.maps.Map(document.getElementById('map'), {
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

  MAP.addListener('click', map_click);

  var input = document.getElementById('pac-input');
  input.value = "Search";

  var searchBox = new google.maps.places.SearchBox(input);
  MAP.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

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
    MAP.fitBounds(bounds);
  });

  CL = new google.maps.Polyline({
    strokeColor: 'yellow',
    strokeOpacity: 0.7,
    strokeWeight: 3,
    map: MAP,
  });

  BS.marker = new google.maps.Marker({

    map: MAP,
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

  TS.marker = new google.maps.Marker({

    map: MAP,
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
  
  BS.marker.addListener('drag', drag);
  BS.marker.addListener('dragend', dragend_bs);
  TS.marker.addListener('drag', drag);
  TS.marker.addListener('dragend', dragend_ts);

  TS.rectangle = new google.maps.Polygon({
    strokeColor: '#FF0000',
    strokeOpacity: 0.4,
    strokeWeight: 0.2,
    fillColor: '#FF0000',
    fillOpacity: 0.4,
    map:MAP
  });

  BS.rectangle = new google.maps.Polygon({
    strokeColor: '#0000FF',
    strokeOpacity: 0.4,
    strokeWeight: 0.2,
    fillColor: '#0000FF',
    fillOpacity: 0.4,
    map:MAP
  })
  check_state();  
}
