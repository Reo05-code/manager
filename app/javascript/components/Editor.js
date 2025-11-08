import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { success } from '../helpers/notifications';
import Header from './Header';
import EventList from './EventList';
import EventDetails from './Event';
import EventForm from './EventForm';
import { handleAjaxError } from '../helpers/helpers';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        handleAjaxError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      // (1) APIを叩いてDBに保存
      const response = await window.fetch('/api/events', {
        method: 'POST', // POSTメソッドで「作成」を依頼
        body: JSON.stringify(newEvent), // フォームのデータをJSON文字列にする
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // (2) DBが保存したデータを返してもらう
      const savedEvent = await response.json();

      // (3) Reactの「記憶(state)」を更新
      const newEvents = [...events, savedEvent];
      setEvents(newEvents);

      // (4) ユーザーにお知らせ
      success('Event Added!');

      // (5) 作成したイベントの詳細ページに強制ジャンプ！
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      handleAjaxError(error);
    }
  };

  const deleteEvent = async (eventId) => {
    const sure = window.confirm('Are you sure?');

    if (sure) {
      try {
        const response = await window.fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw Error(response.statusText);

        success('Event Deleted!');
        navigate('/events');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        handleAjaxError(error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="grid">
        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <EventList events={events} />
            <Routes>
              <Route path="new" element={<EventForm onSave={addEvent} />} />
              <Route path=":id" element={<EventDetails events={events} onDelete={deleteEvent} />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
