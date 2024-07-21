'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Grid, GridItem, Text, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import ScheduleForm from './ScheduleForm';
import { fetchHorarios, fetchQuadras, deleteHorario } from '../services/api';
import '../styles/globals.css';
import { GrSchedules } from 'react-icons/gr';

interface Horario {
  id: number;
  inicio: string;
  fim: string;
  reservado: boolean;
}

interface Quadra {
  quadraId: number;
  nome: string;
  horarios: Horario[];
}

export default function Calendar({ onSchedule }: { onSchedule: () => void }) {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetchHorariosData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchQuadrasData(selectedDate);
    }
  }, [refresh, selectedDate]);

  const fetchHorariosData = async () => {
    try {
      const data = await fetchHorarios();
      if (Array.isArray(data)) {
        setHorarios(data);
      } else {
        console.error('Data received is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching horarios:', error);
    }
  };

  const fetchQuadrasData = async (date: Date) => {
    try {
      const data = await fetchQuadras(date.toISOString());
      setQuadras(data);
    } catch (error) {
      console.error('Error fetching quadras:', error);
    }
  };

  const deleteHorarioHandler = async (horarioId: number) => {
    try {
      await deleteHorario(horarioId);
      setRefresh(refresh + 1);
      fetchHorariosData();
      onSchedule();
    } catch (error) {
      console.error('Error deleting horario:', error);
    }
  };

  const addHorarioHandler = async () => {
    try {
      fetchHorariosData();
      fetchQuadrasData(selectedDate);
      onSchedule();
    } catch (error) {
      console.error('Error adding horario:', error);
    }
  };

  const getIconColor = (count: number) => {
    if (count === 0) return 'bg-green-500';
    if (count <= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && Array.isArray(horarios)) {
      const count = horarios.filter(
        (h) => new Date(h.inicio).toDateString() === date.toDateString()
      ).length;
      const colorClass = getIconColor(count);

      return (
        <div className="flex items-center justify-center">
          <div className={`${colorClass} text-white rounded-full w-2 h-2`}></div>
        </div>
      );
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && Array.isArray(horarios)) {
      const count = horarios.filter(
        (h) => new Date(h.inicio).toDateString() === date.toDateString()
      ).length;
      return count > 0 ? 'highlight' : '';
    }
    return '';
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    fetchQuadrasData(date);
  };

  const handleSchedule = () => {
    setRefresh(refresh + 1);
    onSchedule();
  };

  const noHorarios = quadras.every(quadra => quadra.horarios.length === 0);

  if (!isClient) {
    return null; // Renderiza nada no lado do servidor
  }

  return (
    <><Box p={1} bg="gray.800" color="black" borderRadius="lg" shadow="xs">
      <ReactCalendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        className="w-full border-none calendar-custom" />
      <Box
        mt={4}
        p={4}
        borderRadius="md"
        height="320px"
        overflowY="auto"
      >
        <Text fontSize="xl" color="white" fontWeight="bold" mb={4} align="center">
          Horários de {selectedDate.toLocaleDateString()}
        </Text>
        {noHorarios ? (
          <Text className='flex items-center gap-2 justify-center mt-10 font-bold text-yellow-400'>Nenhum horário marcado<GrSchedules /></Text>
        ) : (
          quadras.map((quadra) => (
            <Box key={quadra.quadraId} mb={4}>
              <Text fontSize="md" color="white" fontWeight="semibold" mb={2}>{quadra.nome}</Text>
              {quadra.horarios.length === 0 ? (
                <Text className='flex items-center gap-2 font-bold text-yellow-400'>Nenhum horário marcado</Text>
              ) : (
                <Grid templateColumns="repeat(1, 1fr)" gap={2}>
                  {quadra.horarios.map((horario) => (
                    <GridItem
                      className="text-center font-bold flex items-center justify-between"
                      key={horario.id}
                      p={2}
                      borderRadius="md"
                      bg="#3c495f"
                      color="gray.100"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <span>
                        {new Date(horario.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(horario.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {'| Name | Email'}
                      </span>
                      <IconButton
                        aria-label="Delete"
                        icon={<FaTrash />}
                        size="sm"
                        color="red.400"
                        bg="transparent"
                        onClick={() => deleteHorarioHandler(horario.id)} />
                    </GridItem>
                  ))}
                </Grid>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
    <ScheduleForm onSchedule={addHorarioHandler} quadras={quadras} />
    </>
  );
}