package com.rondom.quadras.services;

import com.rondom.quadras.entities.HorarioEntity;
import com.rondom.quadras.repository.HorarioRepository;
import com.rondom.quadras.exceptions.ConflictException;
import com.rondom.quadras.exceptions.ResourceNotFoundException;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HorarioService {

    private final HorarioRepository horarioRepository;

    @Autowired
    public HorarioService(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    public List<HorarioEntity> listarHorarios() {
        return horarioRepository.findAll();
    }

    public HorarioEntity buscarHorarioPorId(Long id) {
        return horarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado com o ID: " + id));
    }

    public HorarioEntity salvarHorario(HorarioEntity horario) {
        if (conflitoDeHorario(horario)) {
            throw new ConflictException("Já existe um horário marcado para essa quadra e horário.");
        }
        return horarioRepository.save(horario);
    }

    public void deletarHorario(Long id) {
        if (!horarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Horário não encontrado com o ID: " + id);
        }
        horarioRepository.deleteById(id);
    }

    private boolean conflitoDeHorario(HorarioEntity novoHorario) {
        List<HorarioEntity> horariosExistentes = horarioRepository.findByQuadraAndHorario(
                novoHorario.getQuadra(), novoHorario.getInicioReserva(), novoHorario.getFimReserva());

        for (HorarioEntity horario : horariosExistentes) {
            if (!horario.getId().equals(novoHorario.getId())) {
                return true;
            }
        }
        return false;
    }

    public List<RentalData> getRentals() {
        List<HorarioEntity> horarios = horarioRepository.findAll();

        return horarios.stream()
                .collect(Collectors.groupingBy(h -> h.getInicioReserva().toLocalDate(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new RentalData(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<RentalData> getRentals(LocalDate startDate, LocalDate endDate) {
        List<HorarioEntity> horarios = horarioRepository.findAll();

        if (startDate != null && endDate != null) {
            horarios = horarios.stream()
                    .filter(h -> !h.getInicioReserva().toLocalDate().isBefore(startDate) && !h.getInicioReserva().toLocalDate().isAfter(endDate))
                    .toList();
        }

        return horarios.stream()
                .collect(Collectors.groupingBy(h -> h.getInicioReserva().toLocalDate(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new RentalData(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Setter
    @Getter
    public static class RentalData {
        private String date;
        private Long count;

        public RentalData(LocalDate date, Long count) {
            this.date = date.toString();
            this.count = count;
        }
    }
}