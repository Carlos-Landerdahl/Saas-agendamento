package com.rondom.quadras.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data

@Table(name = "TB_QUADRAS")
public class QuadraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToMany(mappedBy = "quadra", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("quadra")
    private List<HorarioEntity> horarios;
}
