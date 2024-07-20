'use client'

import { ChakraProvider } from '@chakra-ui/react';
import Calendar from '../components/Calendar';
import ScheduleForm from '../components/ScheduleForm';
import { useState } from 'react';
import theme from '@/styles/theme';
import RentalChart from '@/components/RentalChart';

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  const handleSchedule = () => {
    setRefresh(refresh + 1);
  };

  return (
    <ChakraProvider theme={theme}>
      <div className="min-h-screen bg-gray-800 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center">Agendamento de quadras</h1>
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <Calendar onSchedule={handleSchedule} />
          <ScheduleForm onSchedule={handleSchedule} />
        </div>
        <div className='w-full mt-7'>
          <RentalChart refresh={refresh} />
        </div>
      </div>
    </ChakraProvider>
  );
}