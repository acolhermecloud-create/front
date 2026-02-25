'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, List } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { useState } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [editorData, setEditorData] = useState(value || '');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data); // Propagar a mudança para o componente pai
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        language: 'pt',
        toolbar: {
          items: ['undo', 'redo', '|', 'bold', 'italic', 'fontSize', 'fontFamily', 'insertImage', 'bulletedList', 'paragraph'],
        },
        plugins: [
          Bold, Essentials, Italic, Mention, Paragraph, Undo, List
        ],
        licenseKey: '<YOUR_LICENSE_KEY>',
        mention: {
          // Mention configuration
        },
        initialData: placeholder
      }}
      data={editorData}
      onChange={handleEditorChange}
    />
  );
};

export default RichTextEditor;
