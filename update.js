function check_state(){
  if (BS.state==true && TS.state==true && ELEV.state == true){CONFIG.STATE=3;}
  else if (BS.state==true && TS.state==true && ELEV.state == false){CONFIG.STATE=2;}
  else if (BS.state==true && TS.state==false && ELEV.state == false){CONFIG.STATE=1;}
  else if (BS.state==false && TS.state==true && ELEV.state == false){CONFIG.STATE=1;}
  else if (BS.state==false && TS.state==false && ELEV.state == false){CONFIG.STATE=0;}
  //console.log("STATE: " + CONFIG.STATE);
  update();
}

function update(){

  if (CONFIG.STATE == 0){
    // No station define, no elevation points retrieved


    // buttons disabled: Clear all, Get elevations, Export to CSV
    clear_all_btn.disabled = true;
    get_elevation_btn.disabled = true;
    export_csv_btn.disabled = true;
    // buttons enabled: None

    update_config_fields();
  }
  else if (CONFIG.STATE == 1){
    // At least one station defined, no elevation points retrieved


    // buttons disabled: Get elevations, Export to CSV
    get_elevation_btn.disabled = true;
    export_csv_btn.disabled = true;
    // buttons enabled: Clear all
    clear_all_btn.disabled = false;

    update_config_fields();
    if (BS.state ==true && TS.state == false){
      update_bs_fields();
    }else if(BS.state == false && TS.state == true){
      update_ts_fields();
    }

    // Update station field that is define

  }
  else if (CONFIG.STATE == 2){
    // Both stations defined, no elevation points retrieved
    // buttons disabled: Export to CSV
    export_csv_btn.disabled = true;
    // buttons enabled: Clear all, Get elevations
    clear_all_btn.disabled = false;
    get_elevation_btn.disabled = false;
    
    // Do computation of profile
    compute_all();

    //update profile fields
    update_profile_fields();
    update_config_fields();
    update_bs_fields();
    update_ts_fields();
    //draw CL
    draw_cl();


    //draw Station rectangle
    draw_station_geometry();
  }
  else if (CONFIG.STATE == 3){
    // Both stations defined, Elevation points retrieved
    update_profile_fields();
    update_config_fields();
    update_bs_fields();
    update_ts_fields();

    // buttons disabled: Get elevations
    get_elevation_btn.disabled = true;
    // buttons enabled: Clear all, Export to CSV
    clear_all_btn.disabled = false;
    export_csv_btn.disabled = false;


  }
}

function initial_state(){
  CONFIG = {
    STATE:0,
    UNIT:"m",
    UNIT_FACTOR: 1,
  }
  
  // Profile data
  PROFILE = {
    Spacing : 10,
    Heading : null,
    Horizontal_distance : null,
    Vertical_distance : null,
    nb_elev_points : null,
  }
  
  // List of the elevation points
  ELEV = {
    state:false,
    pts : [],
  }
  
  // Center-line
  CL=null; 
  
  // Bottom station
  BS = {
    state:false,
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
  
  // Top station
  TS = {
    state:false,
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
}

function update_all_fields(){
  update_config_fields();
  update_bs_fields();
  update_ts_fields();
  update_profile_fields();
}

function update_config_fields(){
  uf = CONFIG.UNIT_FACTOR
  unit_field.value = CONFIG.UNIT
  spacing_field.value = Number(PROFILE.Spacing*uf).toFixed(3);
}

function update_bs_fields(){
  uf = CONFIG.UNIT_FACTOR
  bs_latitude_field.value = Number(BS.latitude).toFixed(5);
  bs_longitude_field.value = Number(BS.longitude).toFixed(5);
  bs_elevation_field.value = Number(BS.elevation*uf).toFixed(3);
  bs_length_field.value = Number(BS.length*uf).toFixed(3);
  bs_width_field.value = Number(BS.width*uf).toFixed(3);
  bs_offset_field.value = Number(BS.offset*uf).toFixed(3);
}

function update_ts_fields(){
  uf = CONFIG.UNIT_FACTOR
  ts_latitude_field.value = Number(TS.latitude).toFixed(5);
  ts_longitude_field.value = Number(TS.longitude).toFixed(5);
  ts_elevation_field.value = Number(TS.elevation*uf).toFixed(3);
  ts_length_field.value = Number(TS.length*uf).toFixed(3);
  ts_width_field.value = Number(TS.width*uf).toFixed(3);
  ts_offset_field.value = Number(TS.offset*uf).toFixed(3);
}

function update_profile_fields(){
  uf = parseFloat(CONFIG.UNIT_FACTOR);
  //console.log(uf)
  number_points_field.value =PROFILE.nb_elev_points;
  heading_field.value = Number(PROFILE.Heading).toFixed(3);
  horizontal_distance_field.value = Number(PROFILE.Horizontal_distance*uf).toFixed(3);
  PROFILE.Vertical_distance = TS.elevation - BS.elevation;
  vertical_distance_field.value = Number((PROFILE.Vertical_distance)*uf).toFixed(3);
}

function update_bs(pos){
    BS.latitude = pos.lat();
    BS.longitude = pos.lng();
    BS.marker.setPosition(pos);
    draw_bs_marker();
    BS.state=true;
    get_bs_elevation(pos)
  }
  
function update_ts(pos){
    TS.latitude = pos.lat();
    TS.longitude = pos.lng();
    TS.marker.setPosition(pos);
    draw_ts_marker();
    TS.state=true;
    get_ts_elevation(pos);
  }

  function get_ts_elevation(pos){
    elevator.getElevationForLocations({
        'locations': [pos]
    }, function (results, status) {
        TS.elevation = Number(results[0].elevation.toFixed(3));
        update_ts_fields();
        check_state();
    });   
  }

  function get_bs_elevation(pos){
    elevator.getElevationForLocations({
        'locations': [pos]
    }, function (results, status) {
        BS.elevation = Number(results[0].elevation.toFixed(3));
        update_bs_fields();
        check_state();
        
    });
  }

  function get_elevation_points(){
    botHub = CL.getPath().getArray()[0];
    topHub = CL.getPath().getArray()[1];
    let params = {'path': [botHub,topHub],'samples':PROFILE.nb_elev_points,}
    elevator.getElevationAlongPath(params, draw_elev_points)
  }
