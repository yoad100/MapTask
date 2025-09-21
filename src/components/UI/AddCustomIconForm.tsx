import React from 'react';
import Button from './Button';
import { UI_STRINGS } from '../../strings/ui';

interface AddCustomIconFormProps {
  onAdd: (type: string, icon: string) => void;
}

const AddCustomIconForm: React.FC<AddCustomIconFormProps> = ({ onAdd }) => {
  const [type, setType] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim() || !icon.trim()) {
      setError('Type and icon are required');
      return;
    }
    setError('');
    onAdd(type.trim(), icon.trim());
    setType('');
    setIcon('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={type}
          onChange={e => setType(e.target.value)}
          placeholder="Type (e.g. bike)"
          className="border rounded px-2 py-1 text-sm flex-1"
        />
        <input
          type="text"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          placeholder="Icon (emoji or image URL)"
          className="border rounded px-2 py-1 text-sm flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          className="px-3 py-1 text-sm"
        >
          {UI_STRINGS.ADD_CUSTOM_ICON}
        </Button>
      </div>
      {error && <div className="text-xs text-red-600 mb-1">{error}</div>}
    </form>
  );
};

export default AddCustomIconForm;
