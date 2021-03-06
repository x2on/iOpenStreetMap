window.onresize = changeSize;
function changeSize() {
	var  height =  window.innerHeight ||  (window.document.documentElement.clientHeight || window.document.body.clientHeight);
	var  width =  window.innerWidth ||  (window.document.documentElement.clientWidth || window.document.body.clientWidth);
	height = height - 40;
	height += "px";
	width += "px";
	var target=document.getElementById("map");
	target.style.height = height;
	target.style.width = width;
}
function init(mapMode){
	changeSize();

	map=new kmap(document.getElementById("map"));
	map.setMapType('0');
	var center=new kPoint(48.2,15.633);
	map.setCenter(center,9);
}
function geoloc(){
	navigator.geolocation.getCurrentPosition(callback,geoerror);
}

function geoerror(error) {
	alert("Unable to locate your position!");
}

function callback(position) {
	var center=new kPoint(position.coords.latitude, position.coords.longitude);
	map.setCenter(center,16);
	setFlag(position);
}

function setFlag(position) {
    var flagcenter1=new kPoint(position.coords.latitude, position.coords.longitude);
    var img=document.createElement("img");
    img.setAttribute("src","images/dot_green.png");
    img.style.position="absolute";
    img.style.top="-3px";
    img.style.left="-4px";
    img.style.width="18px";
    img.style.height="18px";
    img2=img.cloneNode(true);

    var m=new kMarker(flagcenter1,img);
    map.addOverlay(m);
}

function error(error){
	alert(error);
}
function search(){
	var target=document.getElementById("searchresults");
	target.style.zIndex = "999";

	while(target.firstChild){target.removeChild(target.firstChild)};
	
	target.innerHTML = '<ul class="pageitem"><li class="textbox"><span class="header"><img src="images/loading.gif">searching...</span></li></ul>';

	//Remove Focus from Search-Field to hide Keyboard
	document.getElementById("search").blur();
	
	var xmlHttp=new XMLHttpRequest();
	if (xmlHttp) {
		var place=document.getElementById('search').value;
		if(place=="")return;
		xmlHttp.open('GET', 'http://nominatim.openstreetmap.org/search?format=xml&accept-language=de-De,de;q=0.5&q='+place, true);
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
				render(xmlHttp.responseXML);
				return;	
			}
		};
		xmlHttp.send(null);
	}else{
		alert("Sorry, your browser does not support this.");
	}
}
function render(dom){
	var target=document.getElementById("searchresults");
	while(target.firstChild){target.removeChild(target.firstChild)};
	var names=dom.getElementsByTagName("place");
	if(names.length==0){
		target.innerHTML = '<ul class="pageitem"><li class="textbox"><span class="header">Leider kein passender Ort gefunden.<div id="bluerightbutton"><a href="javascript:closeSearchBox();">Close</a></div></span></li></ul>';
		return;
	}
	if(names.length > 0) {
		var ul=document.createElement("ul");
		ul.className="pageitem";
		var liTop=document.createElement("li");
		liTop.className="textbox";
		ul.appendChild(liTop);
		var spanTop=document.createElement("span");
		spanTop.className="header";
		liTop.appendChild(spanTop);
		var textTop=document.createTextNode("Suchergebnisse");
		spanTop.appendChild(textTop);
		var closeDiv=document.createElement("div");
		var attcloseDiv = document.createAttribute('id');
	   	attcloseDiv.nodeValue = 'bluerightbutton';
	   	closeDiv.setAttributeNode(attcloseDiv);
		closeDiv.innerHTML='<a href="javascript:closeSearchBox();">Close</a>'
		spanTop.appendChild(closeDiv);
	}
	for(var i=0; i < names.length;i++){
		var name=names.item(i);
		if(name.nodeType==1){
			try{
				var nameText=name.getAttribute("display_name");
			}catch(e){
				var nameText="no";
			}
			countryName="nix";
			var lat=name.getAttribute("lat");
			var lng=name.getAttribute("lon");
			var span=document.createElement("span");
			var spanarrow=document.createElement("span");
			var li=document.createElement("li");
			li.className="menu";
			ul.appendChild(li);
			var a=document.createElement("a");
			li.appendChild(a);
			
			a.appendChild(span);
			a.appendChild(spanarrow);
			span.style.fontSize="12px";
			span.style.marginBottom="2px";
			var nameDiv=document.createElement("div");
			var countryNameDiv=document.createElement("div");
			var nameTextNode=document.createTextNode(nameText);
			var countryNameTextNode=document.createTextNode(" in "+countryName);
			nameDiv.appendChild(nameTextNode);
			countryNameDiv.appendChild(countryNameTextNode);
			span.appendChild(nameDiv);
			var zoom=14;
			var value="map.setCenter(new kPoint("+lat+","+lng+"),"+zoom+");";
			a.setAttribute("href","javascript:executeSearch('"+value+"')");
			target.appendChild(ul);
			span.className="name";
			spanarrow.className="arrow";
			nameDiv.className="itemname";
			countryNameDiv.className="itemcountry";
		}
	}
	return;		
}

function closeSearchBox(){
	var target = document.getElementById("searchresults");
	target.style.zIndex = "-1";
	target.innerHTML = '';
}
function executeSearch(value) {
	eval(value);
	iBox.hide();
}
function changeMapType(value) {
	//0 = Mapnik, 1 = Cycle, 2 = Night
	//TO-DO: Refresh Map
	map.setMapType(value);
		switch (value) {
			case "0":
				document.getElementById("normal").className = "pressed";
				document.getElementById("fahrrad").className = "unpressed";
				document.getElementById("nacht").className = "unpressed";
				break;
			case "1":
				document.getElementById("normal").className = "unpressed";
				document.getElementById("fahrrad").className = "pressed";
				document.getElementById("nacht").className = "unpressed";
				break;
			case "2":
				document.getElementById("normal").className = "unpressed";
				document.getElementById("fahrrad").className = "unpressed";
				document.getElementById("nacht").className = "pressed";
				break;
	}
}