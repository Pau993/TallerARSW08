package edu.eci.arsw.collabpaint.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class CollabPaintController {
    @MessageMapping("/newpoint") // Se espera recibir mensajes en "/app/newpoint"
    @SendTo("/topic/newpoint")   // Se envían a todos los suscriptores en "/topic/newpoint"
    
    public Point handleNewPoint(Point point) {
        System.out.println("Nuevo punto recibido: " + point);
        return new Point(point.getX(), point.getY());
    }
}
