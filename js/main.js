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
xhr.onload = () => data = xhr.response;
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
    draw();
};


function draw() {
    ctx.clearRect(canvas.width / 2 * -1, canvas.height / 2 * -1, canvas.width, canvas.height);
    var station = [];
    for (d1 in data) {
        ctx.fillStyle = data[d1]["color"];
        ctx.strokeStyle = data[d1]["color"];
        for (d2 in data[d1]["point"]) {
            ctx.beginPath();
            ctx.moveTo(map_x + data[d1]["point"][d2][0]["coord"][0], map_y + data[d1]["point"][d2][0]["coord"][1]);
            for (d3 in data[d1]["point"][d2]) {
                if ("station" in data[d1]["point"][d2][d3]) {
                    ctx.fillRect(map_x + data[d1]["point"][d2][d3]["coord"][0] - 10, map_y + data[d1]["point"][d2][d3]["coord"][1] - 10, 20, 20);
                    station.push([d1, d2, d3]);
                };
                if (!(data[d1]["point"][d2].length == Number(d3) + 1)) {
                    ctx.lineTo(map_x + data[d1]["point"][d2][Number(d3) + 1]["coord"][0], map_y + data[d1]["point"][d2][Number(d3) + 1]["coord"][1]);
                };
            };
            ctx.stroke();
        };
    };
    ctx.fillStyle = "#000";
    for (s in station) {
        ctx.fillText(data[station[s][0]]["point"][station[s][1]][station[s][2]]["station"], map_x + data[station[s][0]]["point"][station[s][1]][station[s][2]]["coord"][0], map_y + data[station[s][0]]["point"][station[s][1]][station[s][2]]["coord"][1] - 15)
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
    init();
};
onresize = init;
