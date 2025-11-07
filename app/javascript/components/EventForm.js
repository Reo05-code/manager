import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';

const EventForm = ({ onSave }) => {
  const [event, setEvent] = useState({
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // 1. Pikadayが参照するDOM要素を保持するためにuseRefを追加
  const dateInput = useRef(null);

  // 2. useEffectのコールバック内で古いstateを参照しないための中間関数
  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [key]: value }));
  };

  // 3. Pikadayを初期化するためにuseEffectを追加
  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current, // input要素をPikadayに渡す
      onSelect: (date) => {
        // 日付が選択されたときの処理
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate; // inputの表示値を手動で更新
        updateEvent('event_date', formattedDate); // Reactのstateを更新
      },
    });

    // クリーンアップ関数: コンポーネントが破棄される時にPikadayも破棄する
    return () => p.destroy();
  }, []); // 空の配列を渡して、初回マウント時にのみ実行する

  // 4. setEvent(...) を updateEvent(...) に変更
  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    updateEvent(name, value);
  };

  // (renderErrors は変更なし)
  const renderErrors = () => {
    if (isEmptyObject(formErrors)) {
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(formErrors).map((formError) => (
            <li key={formError}>{formError}</li>
          ))}
        </ul>
      </div>
    );
  };

  // (handleSubmit は変更なし)
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  return (
    <section>
      {renderErrors()}

      <h2>New Event</h2>
      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* 5. 日付入力欄をPikaday用に変更 */}
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input
              type="text"
              id="event_date"
              name="event_date"
              ref={dateInput} // 1. で定義したrefを紐付け
              autoComplete="off" // ブラウザのサジェストを無効化
              // onChange={handleInputChange} は削除
              // (PikadayのonSelectがこのフィールドの更新を担当するため)
            />
          </label>
        </div>

        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              cols="30"
              rows="10"
              id="title"
              name="title"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="speaker"
              name="speaker"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input
              type="checkbox"
              id="published"
              name="published"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
};

export default EventForm;
EventForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
