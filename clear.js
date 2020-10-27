function clear_all(){
    clear_bs_marker();
    clear_ts_marker();
    clear_rectangle();
    clear_elev_points();
    clear_cl();
    BS.state=false;
    TS.state=false;
    clear_all_fields();
    check_state();
  }
  
  function clear_cl(){CL.setVisible(false);}

  function clear_bs_marker(){
    BS.marker.setVisible(false);
    BS.state=false;
  }

  function clear_ts_marker(){
    TS.marker.setVisible(false);
    TS.state=false;
  }

  function clear_rectangle(){
    clear_bs_rectangle();
    clear_ts_rectangle();
  }


  function clear_bs_rectangle(){BS.rectangle.setVisible(false);}

  function clear_ts_rectangle(){TS.rectangle.setVisible(false);}

  function clear_elev_points(){
    if (ELEV.state==true){
    ELEV.pts.forEach(i => {i.marker.setVisible(false);});
    ELEV.pts = []
    ELEV.state = false;}
  }


  function clear_all_fields(){

    unit_field.value = CONFIG.UNIT
    spacing_field.value = PROFILE.Spacing;
    
    bs_latitude_field.value = "";
    bs_longitude_field.value = "";
    bs_elevation_field.value = "";
    bs_length_field.value = "";
    bs_width_field.value = "";
    bs_offset_field.value = "";
    
    ts_latitude_field.value ="";
    ts_longitude_field.value = "";
    ts_elevation_field.value = "";
    ts_length_field.value = "";
    ts_width_field.value = "";
    ts_offset_field.value = "";
    
    number_points_field.value =""
    heading_field.value = ""
    horizontal_distance_field.value = ""
    vertical_distance_field.value = ""
  }

  