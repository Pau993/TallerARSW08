var app = (function () {
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var stompClient = null;
    var drawingId = null; 
    var canvas = null;
    var ctx = null;

    var connectAndSubscribe = function () {
        drawingId = document.getElementById("drawingId").value.trim();
        if (!drawingId) {
            alert("Por favor, ingrese un identificador de dibujo.");
            return;
        }
    
        console.info("Conectando al WebSocket para el dibujo ID:", drawingId);
        var socket = new SockJS("http://localhost:8080/stompendpoint");
        stompClient = Stomp.over(socket);
    
        stompClient.connect({}, function (frame) {
            console.log("Conectado: " + frame);
            var topic = "/topic/newpoint." + drawingId;
    
            stompClient.subscribe(topic, function (message) {
                var theObject = JSON.parse(message.body);
                alert("Nuevo punto recibido: X = " + theObject.x + ", Y = " + theObject.y);
                addPointToCanvas(new Point(theObject.x, theObject.y));
            });
    
            alert("Conectado al dibujo #" + drawingId);
        }, function (error) {
            console.error("Error al conectar con STOMP:", error);
        });
    };
    
    var publishPoint = function (px, py) {
        if (!stompClient || !drawingId) {
            alert("Debe conectarse primero a un dibujo.");
            return;
        }
    
        var pt = new Point(px, py);
        console.info("📱 Enviando punto:", pt);
        addPointToCanvas(pt);
    
        var topic = "/app/newpoint." + drawingId;
        stompClient.send(topic, {}, JSON.stringify(pt));
    };

    var addPointToCanvas = function (point) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    };

    var getMousePosition = function (evt) {
        var rect = canvas.getBoundingClientRect();
        return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
    };

    var init = function () {
        canvas = document.getElementById("canvas");
        if (!canvas) {
            console.error("No se encontró el canvas en el DOM.");
            return;
        }
        ctx = canvas.getContext("2d");

        canvas.addEventListener("click", function (event) {
            if (!stompClient || !drawingId) {
                alert("Debe conectarse primero a un dibujo.");
                return;
            }

            var pos = getMousePosition(event);
            console.log(" Punto capturado en canvas:", pos);
            app.publishPoint(pos.x, pos.y);
        });

        console.log("Aplicación inicializada.");
    };

    return {
        connect: function () {
            connectAndSubscribe();
        },
        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            drawingId = null;
            console.log("Desconectado");
            alert("Desconectado del WebSocket.");
        },
        init: init,
        publishPoint: publishPoint
    };

})();

document.addEventListener("DOMContentLoaded", function () {
    app.init();
});

document.getElementById("connectButton").addEventListener("click", function () {
    app.connect();
});
