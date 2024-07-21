import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8080/horarios');
    const data = await response.json();
    if (Array.isArray(data)) {
      return NextResponse.json(data);
    } else {
      console.error('Data received from backend is not an array:', data);
      return NextResponse.json({ message: 'Erro ao obter horários', data }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching horarios:', error);
    return NextResponse.json({ message: 'Erro ao obter horários' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { quadra, inicioReserva, fimReserva } = await req.json();
  try {
    const response = await fetch('http://localhost:8080/horarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quadra,
        inicioReserva,
        fimReserva,
      }),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error scheduling horario:', error);
    return NextResponse.json({ message: 'Erro ao agendar horário' }, { status: 500 });
  }
}