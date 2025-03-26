var app = (function () {

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    
    const socket = new SockJS("http://localhost:8080/stompendpoint");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Conectado: " + frame);
        stompClient.subscribe("/topic/someTopic", function (message) {
            console.log("Mensaje recibido: " + message.body);
        });
    });

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    };

    var getMousePosition = function (evt) {
        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    var connectAndSubscribe = function () {
        console.info("Connecting to WS...");
        var socket = new SockJS("/stompendpoint");

        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log("Connected: " + frame);

            stompClient.subscribe("/topic/newpoint", function (message) {
                var theObject = JSON.parse(message.body);
                drawPoint(point.x, point.y);
            });

        }, function (error) {
            console.error("Error al conectar con STOMP:", error);
        });
    };

    var drawPoint = function (x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    };



    return {
        init: function () {
            var can = document.getElementById("canvas");

            document.getElementById("sendButton").addEventListener("click", function () {
                var x = parseInt(document.getElementById("xValue").value);
                var y = parseInt(document.getElementById("yValue").value);
                app.publishPoint(x, y);
            });

            can.addEventListener("click", function (event) {
                var pos = getMousePosition(event);
                app.publishPoint(pos.x, pos.y);
            });

            connectAndSubscribe();
        },

        publishPoint: function (px, py) {
            var pt = new Point(px, py);
            console.info("Publishing point at", pt);
            addPointToCanvas(pt);

            if (stompClient !== null) {
                stompClient.send("/app/newpoint", {}, JSON.stringify(pt));
            }
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        }
    };

})();
