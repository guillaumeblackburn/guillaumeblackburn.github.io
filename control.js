function update_bottom_terminal(pos){
    bottom_terminal.latitude = pos.lat();
    bottom_terminal.longitude = pos.lng();
    bottom_terminal.marker.setPosition(pos);
    bottom_terminal.marker.setVisible(true);
    bottom_terminal_latitude_field.value = Number(bottom_terminal.latitude).toFixed(5);
    bottom_terminal_longitude_field.value = Number(bottom_terminal.longitude).toFixed(5);
    get_bottom_terminal_elevation(pos);
    compute_profile();
}

function update_top_terminal(pos){
    top_terminal.latitude = pos.lat();
    top_terminal.longitude = pos.lng();
    top_terminal.marker.setPosition(pos);
    top_terminal.marker.setVisible(true);
    top_terminal_latitude_field.value = Number(top_terminal.latitude).toFixed(5);
    top_terminal_longitude_field.value = Number(top_terminal.longitude).toFixed(5);
    get_top_terminal_elevation(pos);
    compute_profile();
}


function unit_change(){
    if(unit_field.value=="m"){
        unit="m";
        unit_factor=1;
    }
    else if (unit_field.value=="ft"){
        unit="ft";
        unit_factor=3.28084;
    }
    //console.log(unit);
    //console.log(unit_factor);

    x=document.getElementsByClassName("unit");
    for(var i = 0; i < x.length; i++){
        x[i].innerText="("+unit+")";    // Change the content
        }    

    spacing_field.value = Number(spacing*unit_factor).toFixed(2);
    bottom_terminal_offset_field.value = Number(bottom_terminal.offset*unit_factor).toFixed(2);
    top_terminal_offset_field.value = Number(top_terminal.offset*unit_factor).toFixed(2);
    horizontal_distance_field.value = Number(horizontal_distance*unit_factor).toFixed(2);
    vertical_distance_field.value = Number(vertical_distance*unit_factor).toFixed(2);
}
function spacing_change(){
    let s = spacing_field.value

    if (s>0){
        spacing = s/unit_factor;
        console.log("Spacing changed")
        //clear_survey_points();
        compute_points();
        //draw_survey_points();
    }
}

// Modification of parameters in the control fields

function bottom_terminal_coord_change(){
    console.log("bottom terminal coordinates modified")
    lat = Number(bottom_terminal_latitude_field.value)
    lng = Number(bottom_terminal_longitude_field.value)
    pos =new google.maps.LatLng({lat: lat, lng: lng});
    update_bottom_terminal(pos);
}

function top_terminal_coord_change(){
    console.log("top terminal coordinates modified")
    lat = Number(top_terminal_latitude_field.value)
    lng = Number(top_terminal_longitude_field.value)
    pos =new google.maps.LatLng({lat: lat, lng: lng});
    update_top_terminal(pos);

}









function bottom_terminal_offset_change(){
    bottom_terminal.offset = bottom_terminal_offset_field.value/unit_factor;
    clear_center_line();
    draw_center_line();
    compute_points();
}

function top_terminal_offset_change(){
    top_terminal.offset = top_terminal_offset_field.value/unit_factor;
    clear_center_line();
    draw_center_line();
    compute_points();
}

function bottom_terminal_geometry_change(){
    bottom_terminal.length = bottom_terminal_length_field.value;
    bottom_terminal.width = bottom_terminal_width_field.value;
    compute_bottom_terminal_geometry();
    
}

function top_terminal_geometry_change(){
    top_terminal.length = top_terminal_length_field.value;
    top_terminal.width = top_terminal_width_field.value;
    compute_top_terminal_geometry();
}


function clear_all_btn_click(){}
function get_elevation_btn_click(){}
function export_csv_btn_click(){}
function view_elevation_btn_click(){}
function pdf_report_btn_click(){}






function export_csv(){}
function export_pdf(){}
function export_json(){}
function import_json(){}

function hide_control(){}
function show_control(){}

function hide_profile_chart(){}
function show_profile_chart(){}
