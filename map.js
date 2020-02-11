function map_click(e) {
    //console.log(typeof(e.latLng))
    let pos = e.latLng;
    if (bottom_terminal.latitude == null) {
        update_bottom_terminal(pos);
    } else if (bottom_terminal.latitude != null && top_terminal.latitude == null) {
        update_top_terminal(pos);
    }
}




function drag_top_terminal() {
    console.log("top terminal is being drag!");
    clear_center_line();
    clear_bottom_terminal_rectangle();
    clear_top_terminal_rectangle();
    //clear_survey_points();
    //clear_top_terminal_marker();
    //clear_bottom_terminal_marker();
}

function dragend_top_terminal(e) {
    console.log("top terminal has been dragged!");
    let pos = e.latLng;
    update_top_terminal(pos);
}

function drag_bottom_terminal(e) {
    console.log("bottom terminal is being drag!");
    clear_center_line();
    clear_bottom_terminal_rectangle();
    clear_top_terminal_rectangle();
    //clear_survey_points();
    //clear_top_terminal_marker();
    //clear_bottom_terminal_marker();
}

function dragend_bottom_terminal(e) {
    console.log("bottom terminal has been dragged!");
    let pos = e.latLng;
    update_bottom_terminal(pos);
}

function draw_center_line(){
    let botStn = bottom_terminal;
    let topStn = top_terminal;

    let bot = google.maps.geometry.spherical.computeOffset(botStn.marker.position, botStn.offset, 180 + heading);
    let top = google.maps.geometry.spherical.computeOffset(topStn.marker.position, topStn.offset, heading);

    center_line.setPath([bot,top]);
    center_line.setVisible(true);

}





function clear_all(){}

function clear_center_line(){
    center_line.setVisible(false);

}

function clear_bottom_terminal_marker(){
    bottom_terminal.marker.setVisible(false);
}

function clear_top_terminal_marker(){
    top_terminal.marker.setVisible(false);
}

function clear_bottom_terminal_rectangle(){
    bottom_terminal.rectangle.setVisible(false);
}

function clear_top_terminal_rectangle(){
    top_terminal.rectangle.setVisible(false);
}




function clear_survey_points(){}

