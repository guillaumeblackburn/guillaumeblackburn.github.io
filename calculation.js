


function compute_horizontal_distance(){
    // Horizontal Distance between the top and bottom terminal
    let btm = bottom_terminal;
    let ttm = top_terminal;

    if (btm.latitude !=null && ttm.latitude !=null){    
        horizontal_distance = google.maps.geometry.spherical.computeDistanceBetween(btm.marker.position, ttm.marker.position);
        horizontal_distance_field.value = Number(horizontal_distance).toFixed(2);
    }
}

function compute_vertical_distance(){
    // Vertical distance between the top and bottom terminal
    if (bottom_terminal.elevation !=null && top_terminal.elevation !=null){
        vertical_distance = top_terminal.elevation - bottom_terminal.elevation;
        top_terminal_elevation_field.value = Number(top_terminal.elevation*unit_factor).toFixed(2);
        bottom_terminal_elevation_field.value = Number(bottom_terminal.elevation*unit_factor).toFixed(2);
        vertical_distance_field.value = Number(vertical_distance*unit_factor).toFixed(2);

    }
}

function compute_heading(){
    // Orientation of the line between the bottom terminal and the top terminal
    let btm = bottom_terminal;
    let ttm = top_terminal;

    if (btm.latitude !=null && ttm.latitude !=null){
        heading = google.maps.geometry.spherical.computeHeading(btm.marker.position, ttm.marker.position);
        heading_field.value = Number(heading).toFixed(2);
        draw_center_line();
        compute_points();
        compute_bottom_terminal_geometry();
        compute_top_terminal_geometry();
    }

    
}

function compute_profile(){
    compute_horizontal_distance();
    compute_heading()
}


function get_bottom_terminal_elevation(pos){
    elevator.getElevationForLocations({
        'locations': [pos]
    }, function (results, status) {
        //console.log(status);
        //console.log(results[0].elevation.toFixed(3));
        bottom_terminal.elevation = Number(results[0].elevation.toFixed(3));
        compute_vertical_distance();
    });
}


function get_top_terminal_elevation(pos){
    elevator.getElevationForLocations({
        'locations': [pos]
    }, function (results, status) {
        //console.log(status);
        //console.log(results[0].elevation.toFixed(3));
        top_terminal.elevation = Number(results[0].elevation.toFixed(3));
        compute_vertical_distance();
    });   
}







function get_elevation(){
    point_list = [];
    botStn = bottom_terminal.marker.position
    topStn = top_terminal.marker.position
    botHub = center_line.getPath().g[0]
    topHub = center_line.getPath().g[1]

    elevator.getElevationAlongPath({
        'path': [botHub,botStn],
        'samples':nb_points[0]+1,
    }, function (results, status) {
        for (var r=0; r<results.length-1;r++){point_list.push(results[r]);}
        elevator.getElevationAlongPath({
            'path': [botStn,topStn],
            'samples':nb_points[1],
        }, function (results) {


            for (var r=0; r<results.length-1;r++){point_list.push(results[r]);}
            elevator.getElevationAlongPath({
                'path': [topStn,topHub],
                'samples':nb_points[2]+1,
            }, function (results, status) {
                for (var r=0; r<results.length;r++){point_list.push(results[r]);}
                draw_points()
            });                   
        });       
    });

}


function draw_points(){
    for (var i=0; i<point_list.length;i++){
        let a = new google.maps.Marker({
            position: point_list[i].location,
            map: map,
            draggable: false,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1,
                fillColor: "black",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "black"
            }
          });
    }
}


function compute_points(){

    let s = spacing;
    let bot_offset = bottom_terminal.offset;
    let top_offset = top_terminal.offset;
    let h = horizontal_distance;

     // Points before bottom terminal
    let n1 = Math.ceil(bot_offset/s);
    console.log(n1);

     //Points between terminal
    let n2 = Math.ceil(h/s)+1;
    console.log(n2);

     //Points above terminal
     let n3 = Math.ceil(top_offset/s);
     console.log(n3);

     number_points_field.value = (n1+n2+n3)*unit_factor;

     nb_points = [n1,n2,n3];
}
function compute_bottom_terminal_geometry(){
    h = heading;
    pos = bottom_terminal.marker.position;
    L = bottom_terminal.length;
    B = bottom_terminal.width;
    p1 = google.maps.geometry.spherical.computeOffset(pos, L, 180 + heading);
    p2 = google.maps.geometry.spherical.computeOffset(pos, 0.5*B, 90 + heading);
    p3 = google.maps.geometry.spherical.computeOffset(pos, -0.5*B, 90 + heading);
    p4 = google.maps.geometry.spherical.computeOffset(p1, 0.5*B, 90 + heading);
    p5 = google.maps.geometry.spherical.computeOffset(p1, -0.5*B, 90 + heading);
    bottom_terminal.rectangle.setPaths([p2,p3,p5,p4,p2]);
    bottom_terminal.rectangle.setVisible(true);
}
function compute_top_terminal_geometry(){
    h = heading;
    pos = top_terminal.marker.position;
    L = top_terminal.length;
    B = top_terminal.width;
    p1 = google.maps.geometry.spherical.computeOffset(pos, L, heading);
    p2 = google.maps.geometry.spherical.computeOffset(pos, 0.5*B, 90 + heading);
    p3 = google.maps.geometry.spherical.computeOffset(pos, -0.5*B, 90 + heading);
    p4 = google.maps.geometry.spherical.computeOffset(p1, 0.5*B, 90 + heading);
    p5 = google.maps.geometry.spherical.computeOffset(p1, -0.5*B, 90 + heading);
    top_terminal.rectangle.setPaths([p2,p3,p5,p4,p2]);
    top_terminal.rectangle.setVisible(true);
}







