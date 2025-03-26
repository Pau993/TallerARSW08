package edu.eci.arsw.collabpaint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"edu.eci.arsw.collabpaint.CollabPaintWebSocketConfig"})
public class CollabPaintApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollabPaintApplication.class, args);
	}
}
