'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button, Text, Box, Grid, GridItem, ModalBody, ModalFooter, ModalContent, ModalHeader, ModalOverlay, IconButton } from '@chakra-ui/react';
import '../styles/globals.css';
import { FaTrash } from 'react-icons/fa';
import ScheduleForm from './ScheduleForm';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetchHorarios();
  }, []);

  useEffect(() => {
    if (visible && selectedDate) {
      fetchQuadras(selectedDate);
    }
  }, [refresh, visible]);

  const fetchHorarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/horarios');
      const data = await response.json();
      if (Array.isArray(data)) {
        setHorarios(data);
      } else {
        console.error('Data received is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching horarios:', error);
    }
  };

  const fetchQuadras = async (date: Date) => {
    try {
      const response = await fetch(`http://localhost:8080/quadras/horarios?data=${date.toISOString()}`);
      const data = await response.json();
      console.log(data);
      setQuadras(data);
      setVisible(true);
    } catch (error) {
      console.error('Error fetching quadras:', error);
    }
  };

  const deleteHorario = async (horarioId: number) => {
    console.log(horarioId);

    try {
      const response = await fetch(`http://localhost:8080/horarios/${horarioId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRefresh(refresh + 1);
        fetchHorarios();
        onSchedule();
      } else {
        console.error('Failed to delete horario');
      }
    } catch (error) {
      console.error('Error deleting horario:', error);
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
    fetchQuadras(date);
  };

  const closeHandler = () => {
    setVisible(false);
    setQuadras([]);
  };

  const handleSchedule = () => {
    setRefresh(refresh + 1);
    onSchedule();
  };

  if (!isClient) {
    return null; // Renderiza nada no lado do servidor
  }

  return (
    <Box p={1} bg="gray.600" color="black" borderRadius="lg" shadow="xs">
      <ReactCalendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        className="w-full border-none calendar-custom"
      />
      <Modal isOpen={visible} onClose={closeHandler}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold">
              Horários de {selectedDate && selectedDate.toLocaleDateString()}
            </Text>
          </ModalHeader>
          <ModalBody maxHeight="400px" overflowY="auto">
            {quadras.map((quadra) => (
              <Box key={quadra.quadraId} mb={4}>
                <Text fontSize="md" fontWeight="semibold" mb={2}>{quadra.nome}</Text>
                <Grid templateColumns="repeat(1, 1fr)" gap={2}>
                  {quadra.horarios.map((horario, index: number) => (
                    <GridItem
                      className='text-center font-bold flex items-center justify-between'
                      key={horario.id}
                      p={2}
                      borderRadius="md"
                      bg="#3c495f"
                    >
                      <span>
                        {new Date(horario.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(horario.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <IconButton
                        aria-label="Delete"
                        icon={<FaTrash />}
                        size="sm"
                        // colorScheme="red"
                        color="red.400"
                        bg="transparent"
                        onClick={() => deleteHorario(horario.id)}
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <div className='flex justify-between w-full items-center py-2'>
              <ScheduleForm onSchedule={handleSchedule} />
              <Button colorScheme="red" onClick={closeHandler}>
                Fechar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}