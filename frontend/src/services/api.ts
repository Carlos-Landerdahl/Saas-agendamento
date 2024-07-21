const API_BASE_URL = 'http://localhost:8080';

export const fetchHorarios = async () => {
  const response = await fetch(`${API_BASE_URL}/horarios`);
  if (!response.ok) {
    throw new Error('Failed to fetch horarios');
  }
  return response.json();
};

export const fetchQuadras = async (date: string) => {
  const response = await fetch(`${API_BASE_URL}/quadras/horarios?data=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quadras');
  }
  return response.json();
};

export const deleteHorario = async (horarioId: number) => {
  const response = await fetch(`${API_BASE_URL}/horarios/${horarioId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete horario');
  }
};

export const postHorario = async (horario: any) => {
  const response = await fetch(`${API_BASE_URL}/horarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(horario),
  });
  if (!response.ok) {
    throw new Error('Failed to post horario');
  }
  return response.json();
};

export const fetchRentalData = async (startDate: string, endDate: string) => {
  const response = await fetch(`${API_BASE_URL}/horarios/rentals?startDate=${startDate}&endDate=${endDate}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rental data');
  }
  return response.json();
};

