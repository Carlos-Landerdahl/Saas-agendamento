'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  Box, 
  Grid, 
  GridItem, 
  Text, 
  IconButton, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  useToast 
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import ScheduleForm from './ScheduleForm';
import { fetchHorarios, fetchQuadras, deleteHorario, fetchHorarioById } from '../services/api';
import '../styles/globals.css';
import { GrSchedules } from 'react-icons/gr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HiOutlineInformationCircle } from 'react-icons/hi';

interface Horario {
  inicio: string | number | Date;
  fim: string | number | Date;
  id: number;
  inicioReserva: string;
  fimReserva: string;
  reservado: boolean;
  nome: string;
  email: string;
  tel: string;
  tipoEsporte: string;
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
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);
  const toast = useToast();

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

  const fetchHorarioDetails = async (horarioId: number) => {
    try {
      const data = await fetchHorarioById(horarioId);
      setSelectedHorario(data);
    } catch (error) {
      console.error('Error fetching horario details:', error);
    }
  };

  const deleteHorarioHandler = async (horario: Horario) => {
    const today = new Date();
    const horarioDate = new Date(horario.inicio);

    if (horarioDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      toast({
        position: 'top-right',
        title: 'Erro',
        description: 'Não é possível excluir agendamentos de dias anteriores.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este horário?')) {
      return;
    }

    try {
      await deleteHorario(horario.id);
      setRefresh(refresh + 1);
      fetchHorariosData();
      onSchedule();
      closeModal();
      toast({
        position: 'top-right',
        title: 'Horário Excluído',
        description: 'O horário foi excluído com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Erro',
        description: 'Erro ao excluir horário.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
    if (view === 'month') {
      const today = new Date();
      if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        return 'opacity-50'; // Deixar datas passadas opacas
      }

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

  const openModal = (horario: Horario) => {
    fetchHorarioDetails(horario.id); // Fetching the details when opening the modal
  };

  const closeModal = () => {
    setSelectedHorario(null);
  };

  const noHorarios = quadras.every(quadra => quadra.horarios.length === 0);

  const isPastDate = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  if (!isClient) {
    return null; // Renderiza nada no lado do servidor
  }

  return (
    <>
      <Box p={1} bg="gray.800" color="black" borderRadius="lg" shadow="xs">
        <ReactCalendar
          tileContent={tileContent}
          tileClassName={tileClassName}
          onClickDay={handleDateClick}
          className="w-full border-none calendar-custom"
          locale="pt-BR" />
        <Box
          mt={4}
          p={4}
          borderRadius="md"
          height="320px"
          overflowY="auto"
        >
          <Text fontSize="xl" color="white" fontWeight="bold" mb={4} align="center">
            Horários de {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
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
                        className="text-center font-bold flex items-center justify-between cursor-pointer hover:bg-slate-600"
                        key={horario.id}
                        p={2}
                        borderRadius="md"
                        bg="#3c495f"
                        color="gray.100"
                        display="flex"
                        justifyContent="space-between"
                        onClick={() => openModal(horario)}
                      >
                        <span className='flex items-center gap-2'>
                          {new Date(horario.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(horario.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <p className='flex items-center gap-1 text-blue-300 underline underline-offset-4 hover:underline-offset-2 transition-all'>Ver mais <HiOutlineInformationCircle size={15}/></p>
                        </span>
                        <IconButton
                          aria-label="Delete"
                          icon={<FaTrash />}
                          size="sm"
                          color="red.400"
                          bg="transparent"
                          onClick={(e) => { e.stopPropagation(); deleteHorarioHandler(horario); }} />
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
      {selectedHorario && (
        <Modal isOpen={true} onClose={closeModal} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalhes do Horário</ModalHeader>
            <ModalCloseButton />
            <ModalBody className='flex flex-col gap-2'>
              <Text><strong>Nome:</strong> {selectedHorario.nome || 'Não informado'}</Text>
              <Text><strong>Email:</strong> {selectedHorario.email || 'Não informado'}</Text>
              <Text><strong>Telefone:</strong> {selectedHorario.tel || 'Não informado'}</Text>
              <Text><strong>Tipo de Esporte:</strong> {selectedHorario.tipoEsporte || 'Não informado'}</Text>
              <Text><strong>Data:</strong> {selectedHorario.inicioReserva ? new Date(selectedHorario.inicioReserva).toLocaleDateString('pt-BR') : 'Não informado'}</Text>
              <Text><strong>Hora de Início:</strong> {selectedHorario.inicioReserva ? new Date(selectedHorario.inicioReserva).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não informado'}</Text>
              <Text><strong>Hora de Fim:</strong> {selectedHorario.fimReserva ? new Date(selectedHorario.fimReserva).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não informado'}</Text>
            </ModalBody>
            <ModalFooter className='flex justify-between'>
              <Button 
                colorScheme="red" 
                onClick={() => deleteHorarioHandler(selectedHorario)} 
                className='flex-1'
                isDisabled={isPastDate(selectedHorario.inicioReserva)}
              >
                Desmarcar Horário
              </Button>
              <Button colorScheme="blue" ml={3} onClick={closeModal}>Fechar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}