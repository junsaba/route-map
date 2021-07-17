// グローバル変数
var data;
var canvas;
var ctx;
var map_x = 0;
var map_y = 0;
var mouse_x;
var mouse_y;


// data.json
var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.onload = function() {
    data = xhr.response;
    init();
    draw();
}
xhr.open("GET", "data.json");
xhr.send();


// 関数
function init() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx.translate(document.body.clientWidth / 2, document.body.clientHeight / 2);
    ctx.lineWidth = 5;
    ctx.font = "0.75rem sans-serif";
    ctx.textAlign = "center";
};


function draw() {
    ctx.clearRect(canvas.width / 2 * -1, canvas.height / 2 * -1, canvas.width, canvas.height);
    var stations = [];
    for (d1 in data) {
        CompanyData = data[d1];
        ctx.fillStyle = CompanyData["color"];
        ctx.strokeStyle = CompanyData["color"];
        linesData = CompanyData["point"];

        for (d2 in linesData) {
            routeData = linesData[d2];
            ctx.beginPath();
            ctx.moveTo(map_x + routeData[0]["coord"][0], map_y + routeData[0]["coord"][1]);

            for (d3 in routeData) {
                pointData = routeData[d3];
                coord = pointData["coord"];
                if ("station" in pointData) {
                    ctx.fillRect(map_x + coord[0] - 10, map_y + coord[1] - 10, 20, 20);
                    stations.push([pointData["station"], map_x + coord[0], map_y + coord[1] - 15]);
                };
                if (Number(d3) < routeData.length - 1) {
                    nextCoord = routeData[Number(d3) + 1]["coord"];
                    ctx.lineTo(map_x + nextCoord[0], map_y + nextCoord[1]);
                };
            };
            ctx.stroke();
        };
    };
    ctx.fillStyle = "#000";
    for (d1 in stations) {
        ctx.fillText(stations[d1][0], stations[d1][1], stations[d1][2]);
    };
};


// イベント
onload = () => {
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");
    canvas.onmousedown = e => {
        mouse_x = e.offsetX;
        mouse_y = e.offsetY;
        canvas.onmousemove = e => {
            map_x += e.offsetX - mouse_x;
            map_y += e.offsetY - mouse_y;
            draw();
            mouse_x = e.offsetX;
            mouse_y = e.offsetY;
        };
    };
    canvas.onmouseup = () => canvas.onmousemove = null;
};
onresize = init;