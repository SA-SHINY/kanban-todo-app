import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const Column = ({ id, title, tasks, children, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex-1">
      <div
        ref={setNodeRef}
        className={`
          bg-gradient-to-b from-gray-50 to-gray-100 
          rounded-xl p-4 shadow-lg transition-all duration-200
          ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
        `}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-300">
          <h2 className="text-xl font-bold text-gray-700">
            {title}
          </h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {count}
          </span>
        </div>
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[400px]">
            {children}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;