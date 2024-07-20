package com.rondom.quadras.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuadraHorariosDto {
    private Long quadraId;
    private String nome;
    private List<HorarioDto> horarios;
}
