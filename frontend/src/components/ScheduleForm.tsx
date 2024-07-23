'use client';

import React, { useState, FormEvent } from 'react';
import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Text,
  Select,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AiOutlineSchedule } from 'react-icons/ai';
import { GrFormSchedule } from 'react-icons/gr';
import { postHorario } from '../services/api';

interface Quadra {
  quadraId: number;
  nome: string;
}

interface ScheduleFormProps {
  onSchedule: () => void;
  quadras: Quadra[];
}

export default function ScheduleForm({ onSchedule, quadras }: ScheduleFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [quadraId, setQuadraId] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [tipoEsporte, setTipoEsporte] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Por favor, selecione os horários de início e fim.');
      return;
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedStartTime = `${formattedStartDate}T${startTime}:00`;
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    const formattedEndTime = `${formattedEndDate}T${endTime}:00`;

    try {
      await postHorario({
        quadra: { id: parseInt(quadraId) },
        inicioReserva: formattedStartTime,
        fimReserva: formattedEndTime,
        nome,
        email,
        tel,
        tipoEsporte,
      });
      onSchedule();
      onClose();
    } catch {
      setError('Erro ao agendar horário');
    }
  };

  return (
    <div>
      <Button colorScheme="blue" onClick={onOpen} className='flex gap-1 items-center'>
        Agendar Horário <GrFormSchedule size={25}/>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="450px" maxH="90vh" overflowY="auto">
          <ModalHeader>Agendar Horário</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormControl isRequired>
                <FormLabel>Data de Início</FormLabel>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="P"
                  customInput={<Input width="100%" />}
                  locale={ptBR}
                  minDate={new Date()}
                  className="w-full"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Data de Fim</FormLabel>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="P"
                  customInput={<Input width="100%" />}
                  locale={ptBR}
                  minDate={startDate || new Date()}
                  className="w-full"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Hora de Início</FormLabel>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  width="100%"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Hora de Fim</FormLabel>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={startTime}
                  width="100%"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Quadra</FormLabel>
                <Select
                  placeholder="Selecione a quadra"
                  value={quadraId}
                  onChange={(e) => setQuadraId(e.target.value)}
                  width="100%"
                >
                  {quadras.map((quadra) => (
                    <option key={quadra.quadraId} value={quadra.quadraId}>
                      {quadra.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tipo de Esporte</FormLabel>
                <Select
                  placeholder="Selecione o tipo de esporte"
                  value={tipoEsporte}
                  onChange={(e) => setTipoEsporte(e.target.value)}
                  width="100%"
                >
                  <option value="Futevôlei">Futevôlei</option>
                  <option value="Vôlei">Vôlei</option>
                  <option value="Beach Tennis">Beach Tennis</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  width="100%"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  width="100%"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  width="100%"
                />
              </FormControl>
              <div className='flex gap-2 pb-2'>
                <Button colorScheme="green" type="submit" width="full" className='flex gap-2 items-center'>
                  Agendar <AiOutlineSchedule size={25}/>
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Fechar
                </Button>
              </div>
              {error && <Text color="red.500">{error}</Text>}
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}