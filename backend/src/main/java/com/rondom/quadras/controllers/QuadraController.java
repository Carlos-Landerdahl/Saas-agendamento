package com.rondom.quadras.controllers;

import com.rondom.quadras.dto.QuadraHorariosDto;
import com.rondom.quadras.entities.QuadraEntity;
import com.rondom.quadras.services.QuadraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/quadras")
public class QuadraController {

    private final QuadraService quadraService;

    @Autowired
    public QuadraController(QuadraService quadraService) {
        this.quadraService = quadraService;
    }

    @GetMapping
    public ResponseEntity<List<QuadraEntity>> listarQuadras() {
        List<QuadraEntity> quadras = quadraService.listarQuadras();
        return ResponseEntity.ok(quadras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuadraEntity> buscarQuadraPorId(@PathVariable Long id) {
        QuadraEntity quadra = quadraService.buscarQuadraPorId(id);
        if (quadra != null) {
            return ResponseEntity.ok(quadra);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<QuadraEntity> salvarQuadra(@RequestBody QuadraEntity quadra) {
        QuadraEntity quadraSalva = quadraService.salvarQuadra(quadra);
        return ResponseEntity.status(HttpStatus.CREATED).body(quadraSalva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarQuadra(@PathVariable Long id) {
        quadraService.deletarQuadra(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/horarios")
    public ResponseEntity<List<QuadraHorariosDto>> buscarHorariosPorData(
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data) {
        List<QuadraHorariosDto> quadraHorarios = quadraService.buscarHorariosPorData(data);
        return ResponseEntity.ok(quadraHorarios);
    }
}
