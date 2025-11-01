import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilderApp from '../FormBuilderApp';

// Export FormBuilder as a library component with its own DndProvider
// This ensures drag-drop context is available regardless of parent app setup
export default function FormBuilderLibrary() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilderApp />
    </DndProvider>
  );
}
