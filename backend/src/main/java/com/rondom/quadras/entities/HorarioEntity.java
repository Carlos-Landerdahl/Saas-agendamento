package com.rondom.quadras.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Data

@Table(name = "TB_HORARIOS")
public class HorarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quadra_id", nullable = false)
    private QuadraEntity quadra;

    @JsonProperty("quadra")
    public Long getQuadraId() {
        return quadra.getId();
    }

    private LocalDateTime inicioReserva;

    private LocalDateTime fimReserva;
}
