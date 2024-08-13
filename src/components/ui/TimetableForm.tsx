import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function TimetableForm({ onSubmit }: any) {
  const [sessionId, setSessionId] = useState('');
  const [changes, setChanges] = useState({});
  const [applyFrom, setApplyFrom] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSubmit({ sessionId, changes, applyFrom });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={sessionId}
        onChange={(e:any) => setSessionId(e.target.value)}
        placeholder="Session ID"
      />
      {/* Add more inputs for changes */}
      <Input
        type="date"
        value={applyFrom}
        onChange={(e:any) => setApplyFrom(e.target.value)}
      />
      <select
        value={applyFrom}
        onChange={(e:any) => setApplyFrom(e.target.value)}
      >
        <option value="now">Apply Immediately</option>
        <option value="next-week">Apply from Next Week</option>
      </select>
      <Button type="submit">Update Timetable</Button>
    </form>
  );
}