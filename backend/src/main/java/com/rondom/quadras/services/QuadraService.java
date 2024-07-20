package com.rondom.quadras.services;

import com.rondom.quadras.dto.HorarioDto;
import com.rondom.quadras.dto.QuadraHorariosDto;
import com.rondom.quadras.entities.HorarioEntity;
import com.rondom.quadras.entities.QuadraEntity;
import com.rondom.quadras.repository.HorarioRepository;
import com.rondom.quadras.repository.QuadraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class QuadraService {

    private final QuadraRepository quadraRepository;
    private final HorarioRepository horarioRepository;

    @Autowired
    public QuadraService(QuadraRepository quadraRepository, HorarioRepository horarioRepository) {
        this.quadraRepository = quadraRepository;
        this.horarioRepository = horarioRepository;
    }

    public List<QuadraEntity> listarQuadras() {
        return quadraRepository.findAll();
    }

    public QuadraEntity buscarQuadraPorId(Long id) {
        return quadraRepository.findById(id).orElse(null);
    }

    public QuadraEntity salvarQuadra(QuadraEntity quadra) {
        return quadraRepository.save(quadra);
    }

    public void deletarQuadra(Long id) {
        quadraRepository.deleteById(id);
    }

    public List<QuadraHorariosDto> buscarHorariosPorData(LocalDateTime data) {
        List<QuadraEntity> quadras = quadraRepository.findAll();
        List<QuadraHorariosDto> quadraHorariosDtos = new ArrayList<>();

        for (QuadraEntity quadra : quadras) {
            QuadraHorariosDto quadraHorariosDto = new QuadraHorariosDto();
            quadraHorariosDto.setQuadraId(quadra.getId());
            quadraHorariosDto.setNome(quadra.getNome());

            LocalDateTime startOfDay = data.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = data.toLocalDate().atTime(LocalTime.MAX);
            List<HorarioEntity> horarios = horarioRepository.findByQuadraAndData(quadra, startOfDay, endOfDay);
            List<HorarioDto> horarioDtos = new ArrayList<>();

            for (HorarioEntity horario : horarios) {
                HorarioDto horarioDto = new HorarioDto();
                horarioDto.setId(horario.getId());
                horarioDto.setInicio(horario.getInicioReserva());
                horarioDto.setFim(horario.getFimReserva());
                horarioDto.setReservado(true);
                horarioDtos.add(horarioDto);
            }
            quadraHorariosDto.setHorarios(horarioDtos);
            quadraHorariosDtos.add(quadraHorariosDto);
        }

        return quadraHorariosDtos;
    }
}
