import React from 'react';
import { X } from 'lucide-react';

interface Subject {
  id: string;
  title: string;
  code: string;
  date: string;
  startHour: number;
  duration: number;
  total: string;
  present: string;
  absent: string;
  isComplete: boolean;
}

interface SubjectDetailBoxProps {
  subject: Subject;
  onClose: () => void;
}

const SubjectDetailBox: React.FC<SubjectDetailBoxProps> = ({ subject, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">{subject.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4 flex-grow overflow-auto">
        <p className="text-lg mb-2">{subject.code}</p>
        
      </div>
    </div>
  );
};

export default SubjectDetailBox;