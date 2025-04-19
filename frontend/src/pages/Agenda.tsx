import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: pt }),
  getDay,
  locales: { pt },
});

const Agenda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [escalaoSelecionado, setEscalaoSelecionado] = useState<string>('');


  const [eventos, setEventos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  const handleSaveEvent = () => {
    const eventTitle = generateEventTitle(currentEvent);
    let updatedEvents;

    if (currentEvent?.id) {
      updatedEvents = eventos.map((evento) =>
        evento.id === currentEvent.id ? { ...currentEvent, title: eventTitle } : evento
      );
      if (currentEvent.tipoEvento === 'Jogo') {
        currentEvent.end = currentEvent.start;
      }
    } else {
      const newId = eventos.length ? Math.max(...eventos.map((e) => e.id)) + 1 : 1;
      updatedEvents = [...eventos, { ...currentEvent, id: newId, title: eventTitle }];
    }

    setEventos(updatedEvents);
    saveEventsToStorage(updatedEvents);
    resetCurrentEvent();
    setShowModal(false);
  };

  const handleEventClick = (event: any) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = () => {
    const updatedEvents = eventos.filter((event: any) => event.id !== currentEvent.id);
    setEventos(updatedEvents);
    saveEventsToStorage(updatedEvents);
    resetCurrentEvent();
    setShowModal(false);
  };

  const handleDayClick = (date: Date) => {
    setCurrentEvent({ ...currentEvent, start: date, end: date });
    setShowModal(true);
  };

  const handleSelectSlot = ({ start }: any) => {
    handleDayClick(start);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '';

    switch (event.tipoEvento) {
      case 'Jogo':
        backgroundColor = 'red';
        break;
      case 'Treino':
        backgroundColor = 'blue';
        break;
      case 'Reunião':
        backgroundColor = 'green';
        break;
      default:
        backgroundColor = 'gray';
        break;
    }

    return {
      style: {
        backgroundColor,
        color: 'white',
      }
    };
  };

  const generateEventTitle = (event: any) => {
    const { tipoEvento, adversario, escalao, tipoReuniao } = event;
    let title = '';

    switch (tipoEvento) {
      case 'Jogo':
        title = `${escalao} - Jogo contra ${adversario}`;
        break;
      case 'Treino':
        title = `${escalao} - Treino`;
        break;
      case 'Reunião':
        title = `${escalao} - ${tipoReuniao}`;
        break;
      default:
        title = 'Evento';
        break;
    }
    return title;
  };

  const saveEventsToStorage = (newEvents: any) => {
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(currentEvent[type]);
    const [hours, minutes] = value.split(':');
    date.setHours(Number(hours), Number(minutes));
  
    if (type === 'start' && currentEvent.tipoEvento === 'Jogo') {
      // Se for jogo, define end como 2h depois
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 2);
      setCurrentEvent({ ...currentEvent, start: date, end: endDate });
    } else {
      setCurrentEvent({ ...currentEvent, [type]: date });
    }
  };
  

  const loadEventsFromStorage = () => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      const converted = parsed.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEventos(converted);
    }
  };

  const resetCurrentEvent = () => {
    setCurrentEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      local: '',
      escalao: '',
      tipoEvento: 'Treino',
      adversario: '',
      tipoReuniao: '',
    });
  };

  // 🧠 Base da semana atual (segunda-feira)
  const getStartOfWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = domingo
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // segunda-feira
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // 🕗 Hora mínima
  const getMinTime = () => {
    const base = getStartOfWeek();

    if (eventos.length === 0) {
      const fallback = new Date(base);
      fallback.setHours(8, 0, 0, 0);
      return fallback;
    }

    const minHour = Math.min(...eventos.map(e => new Date(e.start).getHours()));
    const date = new Date(base);
    date.setHours(minHour - 1 >= 0 ? minHour - 1 : 0, 0, 0, 0);
    return date;
  };

  // 🕛 Hora máxima
  const getMaxTime = () => {
    const base = getStartOfWeek();

    if (eventos.length === 0) {
      const fallback = new Date(base);
      fallback.setHours(20, 0, 0, 0);
      return fallback;
    }

    const maxHour = Math.max(...eventos.map(e => new Date(e.end).getHours()));
    const date = new Date(base);
    date.setHours(maxHour + 1 <= 23 ? maxHour + 1 : 23, 0, 0, 0);
    return date;
  };

  useEffect(() => {
    loadEventsFromStorage();
  }, []);

  const eventosFiltrados = escalaoSelecionado
  ? eventos.filter(
      (e) =>
        e.escalao?.trim().toLowerCase() === escalaoSelecionado.trim().toLowerCase()
    )
  : eventos;



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <img src="/logo_clube.png" alt="Logo" className="h-10" />
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
            <img src={user?.foto ?? "/avatar.png"} alt="Foto" className="w-10 h-10 rounded-full object-cover border" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Bem-vindo, {user?.nome}</h1>
          <div className="space-x-2">
  <select
    value={escalaoSelecionado}
    onChange={(e) => setEscalaoSelecionado(e.target.value)}
    className="px-4 py-2 border rounded"
  >
    <option value="">Todos os Escalões</option>
    {user?.escaloes?.map((escalao, idx) => (
      <option key={idx} value={escalao}>
        {escalao}
      </option>
    ))}
  </select>
</div>


        </div>

        <div className="mt-4 flex items-center space-x-2">
        <button
  onClick={() => {
    const modalidade = user?.modalidade?.toLowerCase();

    if (modalidade === 'basquetebol') {
      navigate('/treinador/basquetebol');
    } else if (modalidade === 'hóquei em patins') {
      navigate('/treinador/hoquei-em-patins');
    } else {
      navigate('/'); // fallback
    }
  }}
  className="text-red-500 hover:text-blue-800 flex items-center gap-2"
>
  <FaArrowLeft /> <span>Voltar ao Treinador</span>
</button>

        </div>

        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <Calendar
            localizer={localizer}
            events={eventosFiltrados}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            messages={{
              next: 'Próximo',
              previous: 'Anterior',
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              agenda: 'Agenda',
              date: 'Data',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'Sem eventos neste período.',
            }}
            culture="pt"
            onSelectSlot={handleSelectSlot}
            selectable
            views={['month', 'week']}
            showMultiDayTimes={false}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleEventClick}
            min={getMinTime()}
            max={getMaxTime()}
          />
        </div>

        {/* Modal */}
        {showModal && currentEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">Editar Evento</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Título do Evento"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Escalão</label>
                <select
  value={currentEvent.escalao}
  onChange={(e) => setCurrentEvent({ ...currentEvent, escalao: e.target.value })}
  className="w-full p-2 border rounded"
>
  <option value="">Selecione o Escalão</option>
  {user?.escaloes?.map((escalao: string, idx: number) => (
    <option key={idx} value={escalao.trim()}>
      {escalao.trim()}
    </option>
  ))}
</select>

              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
                <select
                  value={currentEvent.tipoEvento}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, tipoEvento: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Treino">Treino</option>
                  <option value="Jogo">Jogo</option>
                  <option value="Reunião">Reunião</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Local</label>
                <input
                  type="text"
                  value={currentEvent.local}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, local: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Local do Evento"
                />
              </div>

              {currentEvent.tipoEvento === 'Jogo' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Adversário</label>
                  <input
                    type="text"
                    value={currentEvent.adversario}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, adversario: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Nome do Adversário"
                  />
                </div>
              )}

              {currentEvent.tipoEvento === 'Reunião' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Reunião</label>
                  <select
                    value={currentEvent.tipoReuniao}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, tipoReuniao: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Reunião">Reunião</option>
                    <option value="Análise de Vídeo">Análise de Vídeo</option>
                  </select>
                </div>
              )}

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Horário do Evento</label>
  <div className="flex space-x-4">
    <input
      type="time"
      value={currentEvent.start.toISOString().slice(11, 16)}
      onChange={(e) => handleTimeChange('start', e.target.value)}
      className={`p-2 border rounded ${currentEvent.tipoEvento === 'Jogo' ? 'w-full' : 'w-1/2'}`}
    />
    {currentEvent.tipoEvento !== 'Jogo' && (
      <input
        type="time"
        value={currentEvent.end.toISOString().slice(11, 16)}
        onChange={(e) => handleTimeChange('end', e.target.value)}
        className="w-1/2 p-2 border rounded"
      />
    )}
  </div>
</div>


              <div className="flex justify-end">
                <button onClick={handleSaveEvent} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Salvar Alterações</button>
                <button onClick={handleDeleteEvent} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Excluir Evento</button>
                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
