/*
Events:

  ############ Map interactions #################
  1-Map click
  2-Drag/Dragend top station dot
  3-Drag/Dragend bottom station dot

  ############ CONFIG change ##################
  4-Unit change
  5-Spacing change

  6-Bottom station coordinate change
  7-Top station coordinate change

  8-Bottom station geometry change
  9-Top station geometry change

  10-Bottom station offset change
  11-Top station offset change

  ############# buttons click ########################
  12-Clear all button click
  13-Get elevations button click
  14-Export to csv button click


  ########## Next version ############################
  15-Print PDF button click (version 3)
  16-View elevation table button click (version 3)
  17-View profile button click (version 3)
  18-Export to kml button click (version 3) 


*/

function map_click(e) {
    let pos = e.latLng;
    if (BS.state == false) {
        update_bs(pos);
    } else if (BS.state == true && TS.state == false) {
        update_ts(pos);
    }
  }

  function drag() {
    clear_cl();
    clear_bs_rectangle();
    clear_ts_rectangle();
    clear_elev_points();
  }
  
  function dragend_ts(e) {
    let pos = e.latLng;
    update_ts(pos);
  }
  
  function dragend_bs(e) {
    let pos = e.latLng;
    update_bs(pos);
  }

  function unit_change(){
    if(unit_field.value=="m"){
        CONFIG.UNIT="m";
        CONFIG.UNIT_FACTOR=1;
    }
    else if (unit_field.value=="ft"){
      CONFIG.UNIT="ft";
      CONFIG.UNIT_FACTOR=3.28084;
    }

  
    x=document.getElementsByClassName("unit");
    for(var i = 0; i < x.length; i++){
        x[i].innerText="("+CONFIG.UNIT+")";    // Change the content
        }

    check_state();
  }
  
  function spacing_change(){
    clear_elev_points();
    let s = spacing_field.value
    if (s>0){
        PROFILE.Spacing = s/CONFIG.UNIT_FACTOR;
    }
    check_state();
  }
  
  function bs_coord_change(){
    clear_elev_points();
    clear_rectangle();
    clear_cl();
    lat = Number(bs_latitude_field.value)
    lng = Number(bs_longitude_field.value)
    if (lat !=0.0 && lng != 0.0){
      pos =new google.maps.LatLng({lat: lat, lng: lng});
      update_bs(pos);
    }
  }
  
  function ts_coord_change(){
    clear_elev_points();
    clear_rectangle();
    clear_cl();
    lat = Number(ts_latitude_field.value)
    lng = Number(ts_longitude_field.value)
    if (lat !=0.0 && lng != 0.0){
      pos =new google.maps.LatLng({lat: lat, lng: lng});
      update_ts(pos);
    }
  }
  
  
  function bs_offset_change(){
    clear_elev_points();
    BS.offset = bs_offset_field.value/CONFIG.UNIT_FACTOR;
    check_state();
  }
  
  function ts_offset_change(){
    clear_elev_points();
    TS.offset = ts_offset_field.value/CONFIG.UNIT_FACTOR;
    check_state();
  }
  
  function bs_geometry_change(){
    BS.length = bs_length_field.value/CONFIG.UNIT_FACTOR;
    BS.width = bs_width_field.value/CONFIG.UNIT_FACTOR;
    check_state();
  }
  
  function ts_geometry_change(){
    TS.length = ts_length_field.value/CONFIG.UNIT_FACTOR;
    TS.width = ts_width_field.value/CONFIG.UNIT_FACTOR;
    check_state();
  }
  
  
  function export_csv_btn_click(){
    u = CONFIG.UNIT_FACTOR;
    let aa = ELEV.pts[0].location;
    let bb = BS.marker.position;
    let cc = TS.marker.position;
    BS.station = Number(google.maps.geometry.spherical.computeDistanceBetween(aa, bb)*u).toFixed(3);
    TS.station = Number(google.maps.geometry.spherical.computeDistanceBetween(aa, cc)*u).toFixed(3);
    let csv_data = []
    csv_data.push([BS.station,Number(BS.elevation*u).toFixed(3),"0","0","0","0","Bottom Station "+bb.toString()])
    csv_data.push([TS.station,Number(TS.elevation*u).toFixed(3),"0","0","0","0","Top Station "+cc.toString()])
    ELEV.pts.forEach(e => {
      s = Number(e.station*u).toFixed(3);
      elev = Number(e.elevation*u).toFixed(3);
      csv_data.push([s,elev,"0","0","0","0",e.description])
    })
    csv_data.sort((a,b)=>{return a[0] - b[0]});
    //console.log(csv_data);

    let text_data='PointNo;X;Z;HSMax;HSMin;Ql;Qr;Description\r\n';
    for (i = 0; i < csv_data.length; i++) {
      t = Number(i+1)+";"+csv_data[i].join(";")+"\r\n";
      text_data += t
    }

    var blob = new Blob([text_data],{ type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "Ground Profile.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    //text_data = "data:text/csv;charset=utf-8," + text_data;
    //let encodedUri = encodeURI(text_data);
    //window.open(encodedUri);


}