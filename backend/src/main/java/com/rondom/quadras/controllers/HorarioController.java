package com.rondom.quadras.controllers;

import com.rondom.quadras.entities.HorarioEntity;
import com.rondom.quadras.services.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorarioController {

    private final HorarioService horarioService;

    @Autowired
    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping
    public ResponseEntity<List<HorarioEntity>> listarHorarios() {
        List<HorarioEntity> horarios = horarioService.listarHorarios();
        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioEntity> buscarHorarioPorId(@PathVariable Long id) {
        HorarioEntity horario = horarioService.buscarHorarioPorId(id);
        if (horario != null) {
            return ResponseEntity.ok(horario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<HorarioEntity> salvarHorario(@RequestBody HorarioEntity horario) {
        try {
            HorarioEntity horarioSalvo = horarioService.salvarHorario(horario);
            return ResponseEntity.status(HttpStatus.CREATED).body(horarioSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarHorario(@PathVariable Long id) {
        horarioService.deletarHorario(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/rentals")
    public ResponseEntity<List<HorarioService.RentalData>> getRentals(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<HorarioService.RentalData> rentalData = horarioService.getRentals(startDate, endDate);
        return ResponseEntity.ok(rentalData);
    }
}