var map;
var d;
var esp;
var intermediate_pts = [];

function radians(n) {return n * (Math.PI / 180);}
function degrees(n) {return n * (180 / Math.PI);}

function initMap() {
	clearField();
	document.getElementById("exportDataBtn").disabled = true;
	document.getElementById("clearAll").disabled = true;
	document.getElementById("getElevationBtn").disabled = true;
	var myCenter = new google.maps.LatLng(53, -90);
	var myOptions = {zoom: 4,mapTypeId: google.maps.MapTypeId.SATELLITE,center: myCenter};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	polyLine = new google.maps.Polyline({map: null});
	startMarker = new google.maps.Marker({map:null});
	endMarker = new google.maps.Marker({map:null});
	bottomHub = new google.maps.Marker({map:null});
	topHub = new google.maps.Marker({map:null});
	startPoint = null;
	endPoint = null;
	elevator = new google.maps.ElevationService;
	map.addListener('click', mapClick );
	var input = document.getElementById('pac-input');
	input.value="";
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
	map.addListener('bounds_changed', function(){searchBox.setBounds(map.getBounds());});
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
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
}




var mapClick  =function(e) {

	var lat = e.latLng.lat();
	var lng = e.latLng.lng();
	var position = {lat: lat, lng: lng};
	if(! startPoint) {
		startPoint = position;
		startMarker = makeMarker(position,5,true,"blue");
		startMarker.addListener('drag', dragMarker);
		startMarker.addListener('dragend', dragendMarker);
		document.getElementById("clearAll").disabled = false;
		document.getElementById("instructions").innerHTML = "2) Click on the map to position the top terminal" 
	}
	else if(! endPoint) {
		endPoint = position;
		endMarker = makeMarker(position,5,true,"red");

		endMarker.addListener('drag', dragMarker);
		endMarker.addListener('dragend', dragendMarker);
		drawHub();
		computeProfilSpec();
		writeField();
		polyLine = makePolyline([bottomHub.position, topHub.position]);
		document.getElementById("getElevationBtn").disabled = false;
		document.getElementById("instructions").innerHTML =`3) Adjust the number of points and the offset distance from the terminals. 
		Terminal positions can also be adjusted by dragging the markers. 
		Once you're done click on the Get Elevations button.` ;

	}
}

function dragMarker(){
	clearHubMarker();
	clearElevationMarkers();
	document.getElementById("exportDataBtn").disabled = true;
	clearPolyline();
	clearField();
	var s = {lat: startMarker.position.lat(), lng: startMarker.position.lng()};
	var e = {lat: endMarker.position.lat(), lng: endMarker.position.lng()};
}

function dragendMarker(){
	computeProfilSpec();
	writeField();
	drawHub();
	polyLine = makePolyline([bottomHub.position, topHub.position]);
}

function offset_change(){
	if (startMarker && endMarker){
		clearHubMarker();
		clearPolyline();
		clearElevationMarkers();
		clearField();
		drawHub();
		computeProfilSpec();
		polyLine = makePolyline([bottomHub.position, topHub.position]);
		writeField();
		document.getElementById("exportDataBtn").disabled = true;
		document.getElementById("instructions").innerHTML =`3) Adjust the number of points and the offset distance from the terminals. 
		Terminal positions can also be adjusted by dragging the markers. 
		Once you're done click on the Get Elevations button.` ;	
	}
}

function nbpts_change(){
	if (startMarker && endMarker){
		clearField();
		clearElevationMarkers();
		document.getElementById("exportDataBtn").disabled = true;
		document.getElementById("instructions").innerHTML =`3) Adjust the number of points and the offset distance from the terminals. 
		Terminal positions can also be adjusted by dragging the markers. 
		Once you're done click on the Get Elevations button.` ;
		computeProfilSpec();
		writeField();
	}
}
function clear_all(){
	startPoint = null;
	endPoint = null;
	clearMarker();
	clearPolyline();
	clearField();
	clearElevationMarkers();
	document.getElementById("exportDataBtn").disabled = true;
	document.getElementById("clearAll").disabled = true;
	document.getElementById("getElevationBtn").disabled = true;
	document.getElementById("instructions").innerHTML = "1) Click on the map to position the bottom terminal"
	
}



function makeMarker(pos,s,d,c){
	return new google.maps.Marker({
		position: pos,
		map: map,
		draggable:d,
		icon: {path: google.maps.SymbolPath.CIRCLE,
			scale: s,
			fillColor: c,
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: c,
			labelOrigin: new google.maps.Point(18,0)
		}
	});
}

function makePolyline(points) {
	return new google.maps.Polyline({
		path: points,
		strokeColor: 'black',
		strokeOpacity: 0.7,
		strokeWeight: 1,
		map: map
	});
};

var drawHub = function(){
	var offset = document.getElementById("offset").value
	computeBearing();
	topHubPosition = google.maps.geometry.spherical.computeOffset(endMarker.position,offset,heading);
	bottomHubPosition = google.maps.geometry.spherical.computeOffset(startMarker.position,offset,180+heading);
	topHub = makeMarker(topHubPosition,5,false,"yellow");
	bottomHub = makeMarker(bottomHubPosition,5,false,"yellow");
}



var computeProfilSpec = function(){
	nbPts = Number(document.getElementById("nb_pts").value);
	computeLength();
	computeSpacing();
	
}

var computeLength = function(){
	var R = 6378137; // Earth’s mean radius in meter
	var dLat = radians(topHub.position.lat() - bottomHub.position.lat());
	var dLong = radians(topHub.position.lng() - bottomHub.position.lng());
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(radians(bottomHub.position.lat())) * Math.cos(radians(topHub.position.lat())) *
	Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	d = R * c;
	d = d.toFixed(2);
}

var computeSpacing = function(){
	esp = d/(nbPts-1);	
}

var computeBearing = function(){
	heading = google.maps.geometry.spherical.computeHeading(startMarker.position, endMarker.position);
}



var writeField = function(){
	document.getElementById("bot_lat").value = Number(startMarker.position.lat()).toFixed(5);
	document.getElementById("bot_lng").value = Number(startMarker.position.lng()).toFixed(5);
	document.getElementById("top_lat").value = Number(endMarker.position.lat()).toFixed(5);
	document.getElementById("top_lng").value = Number(endMarker.position.lng()).toFixed(5);
	document.getElementById("botHub_lat").value = Number(bottomHub.position.lat()).toFixed(5);
	document.getElementById("botHub_lng").value = Number(bottomHub.position.lng()).toFixed(5);
	document.getElementById("topHub_lat").value = Number(topHub.position.lat()).toFixed(5);
	document.getElementById("topHub_lng").value = Number(topHub.position.lng()).toFixed(5);
	document.getElementById("profil_length").value = Number(d).toFixed(2);
	document.getElementById("spacing").value = Number(esp).toFixed(2);
}

var clearMarker = function(){
	startMarker.setMap(null);
	endMarker.setMap(null);
	clearHubMarker();
}

var clearHubMarker = function(){
	topHub.setMap(null);
	bottomHub.setMap(null);	
}

var clearElevationMarkers = function(){
	var i;
	for(i=0;i < intermediate_pts.length; i++) {
		intermediate_pts[i].setMap(null);
	}
	intermediate_pts = []	
}

var clearPolyline = function(){
	polyLine.setMap(null);
}

var clearField = function(){
	document.getElementById("data_output").value = "";
	document.getElementById("bot_lat").value = "";
	document.getElementById("bot_lng").value = "";
	document.getElementById("top_lat").value = "";
	document.getElementById("top_lng").value = "";
	document.getElementById("botHub_lat").value = "";
	document.getElementById("botHub_lng").value = "";
	document.getElementById("topHub_lat").value = "";
	document.getElementById("topHub_lng").value = "";
	document.getElementById("profil_length").value = "";
	document.getElementById("spacing").value = "";
}


function getElevation(){
	elevator.getElevationAlongPath({'path': [bottomHub.position,topHub.position],'samples': nbPts}, plotElevation);
	document.getElementById("exportDataBtn").disabled = false;
	document.getElementById("instructions").innerHTML = `4) Elevations are avalaible to download by pressing on the Export to csv button or copy/paste the data.`
}

function plotElevation(elevations, status) {
	var i;
	var t;
	text_data='PointNo;X;Z;HSMax;HSMin;Ql;Qr;Description\r\n';
	for (i = 0; i < elevations.length; i++) { 
		lat = elevations[i]['location'].lat();
		lng = elevations[i]['location'].lng();
		elev = elevations[i]['elevation'];
		t = i+';'+Number(i*esp).toFixed(3)+';'+Number(elev).toFixed(3)+';0;0;0;0;\r\n'
		text_data += t;
		if (i != 0 && i !=elevations.length-1){
			var j = makeMarker(elevations[i]['location'],2,false,"black");
			intermediate_pts.push(j);
		} 
	}
	document.getElementById("data_output").value = text_data;
}	

function downloadCSV(){
	var csvData = "data:text/csv;charset=utf-8," + text_data;
	var encodedUri = encodeURI(csvData);
	window.open(encodedUri);
}

