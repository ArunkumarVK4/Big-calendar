import { useState, useEffect } from 'react';

const EventItem = ({ event, onEdit, onDelete, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);

  useEffect(() => {
    setEditedTitle(event.title);
  }, [event]);

  const handleEdit = () => {
    setIsEditing(true);
    onEditClick(event);
  };

  const handleSave = () => {
    onEdit({ ...event, title: editedTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(event.title);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <strong>{event.title}</strong>
          <div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => onDelete(event)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventItem;
