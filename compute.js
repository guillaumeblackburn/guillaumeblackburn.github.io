function compute_all(){
  
  compute_horizontal_distance();
  compute_nb_elev_points();
  compute_heading();
  compute_bs_geometry();
  compute_ts_geometry();
  //compute_vertical_distance();
}

function compute_horizontal_distance(){
  PROFILE.Horizontal_distance = google.maps.geometry.spherical.computeDistanceBetween(BS.marker.position, TS.marker.position); 
}

/* Désuet
function compute_vertical_distance(){
  PROFILE.Vertical_distance = TS.elevation - BS.elevation;
}*/
  
function compute_heading(){
  PROFILE.Heading = google.maps.geometry.spherical.computeHeading(BS.marker.position, TS.marker.position);
}
  
function compute_nb_elev_points(){
   
    let d1 = BS.offset;
    let d2 = PROFILE.Horizontal_distance;
    let d3 = TS.offset;
    let TL = d1+d2+d3;
    let s = PROFILE.Spacing
    let nb = Math.ceil(TL/s)+1
    PROFILE.nb_elev_points = Math.min(500,nb)
    //if (nb>500){
    //  alert("The maximum of elevation points is exceeded, only 500 points will be retrieved!")
    //} 
}
  
function compute_bs_geometry(){
    h = PROFILE.Heading;
    pos = BS.marker.position;
    L = BS.length;
    B = BS.width;
    p1 = google.maps.geometry.spherical.computeOffset(pos, L, 180 + h);
    p2 = google.maps.geometry.spherical.computeOffset(pos, 0.5*B, 90 + h);
    p3 = google.maps.geometry.spherical.computeOffset(pos, -0.5*B, 90 + h);
    p4 = google.maps.geometry.spherical.computeOffset(p1, 0.5*B, 90 + h);
    p5 = google.maps.geometry.spherical.computeOffset(p1, -0.5*B, 90 + h);
    BS.rectangle.setPaths([p2,p3,p5,p4,p2]);
    //BS.rectangle.setVisible(true); ->Update map
  }
  
function compute_ts_geometry(){
    h = PROFILE.Heading;
    pos = TS.marker.position;
    L = TS.length;
    B = TS.width;
    p1 = google.maps.geometry.spherical.computeOffset(pos, L, h);
    p2 = google.maps.geometry.spherical.computeOffset(pos, 0.5*B, 90 + h);
    p3 = google.maps.geometry.spherical.computeOffset(pos, -0.5*B, 90 + h);
    p4 = google.maps.geometry.spherical.computeOffset(p1, 0.5*B, 90 + h);
    p5 = google.maps.geometry.spherical.computeOffset(p1, -0.5*B, 90 + h);
    TS.rectangle.setPaths([p2,p3,p5,p4,p2]);
    //TS.rectangle.setVisible(true); -> Update map
  }