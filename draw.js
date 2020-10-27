 
  function draw_cl(){
    let bot = google.maps.geometry.spherical.computeOffset(BS.marker.position, BS.offset, 180 + PROFILE.Heading);
    let top = google.maps.geometry.spherical.computeOffset(TS.marker.position, TS.offset, PROFILE.Heading);
    CL.setPath([bot,top]);
    CL.setVisible(true);
  }


  function draw_elev_points(results,status){
    //console.log(status);
    //console.log(results);
  
    if (status == "OK"){
        ELEV.state=true;
        ELEV.pts = results;
        ELEV.pts.forEach(e => {
          e.marker = new google.maps.Marker({
            position: e.location,
            map: MAP,
            draggable: false,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 2,
                fillColor: "black",
                fillOpacity: 1,
                strokeWeight: 0,
                strokeColor: "black"
            }
          });
          // Calculating the station and storing a description of the point
          e.station = google.maps.geometry.spherical.computeDistanceBetween(ELEV.pts[0].location, e.location);
          e.description = e.location.toString();
        });
    }else{
      ELEV.state=false; 
        console.log("error")
    }
  check_state();
  }


function draw_bs_marker(){
    BS.marker.setVisible(true);
  }
  
function draw_ts_marker(){
    TS.marker.setVisible(true);
  }

function draw_station_geometry(){
  BS.rectangle.setVisible(true);
  TS.rectangle.setVisible(true);
}


