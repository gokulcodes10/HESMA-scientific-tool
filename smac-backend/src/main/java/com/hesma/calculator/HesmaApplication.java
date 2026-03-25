package com.hesma.calculator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HesmaApplication {

    public static void main(String[] args) {
        SpringApplication.run(HesmaApplication.class, args);
        System.out.println("HESMA Engine is online and listening on port 8080...");
    }
}