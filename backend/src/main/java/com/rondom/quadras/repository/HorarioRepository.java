package com.rondom.quadras.repository;

import com.rondom.quadras.entities.HorarioEntity;
import com.rondom.quadras.entities.QuadraEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HorarioRepository extends JpaRepository<HorarioEntity, Long> {
    @Query("SELECT h FROM HorarioEntity h " +
            "WHERE h.quadra = :quadra " +
            "AND (:inicioReserva < h.fimReserva AND :fimReserva > h.inicioReserva)")
    List<HorarioEntity> findByQuadraAndHorario(
            @Param("quadra") QuadraEntity quadra,
            @Param("inicioReserva") LocalDateTime inicioReserva,
            @Param("fimReserva") LocalDateTime fimReserva);

    @Query("SELECT h FROM HorarioEntity h WHERE h.quadra = :quadra AND h.inicioReserva BETWEEN :start AND :end")
    List<HorarioEntity> findByQuadraAndData(
            @Param("quadra") QuadraEntity quadra,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}