import React, { useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importando o tema do Quill
import QuillResizeImage from 'quill-resize-image';

// Registrar o módulo corretamente
Quill.register('modules/resize', QuillResizeImage);

const RichTextEditorRTE = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value || '');

  const handleChange = (value) => {
    setEditorValue(value); // Atualiza o estado local
    if (onChange) {
      console.log('value', value)
      onChange(value); // Propaga o valor para o pai
    }
  };

  // Sincronizar alterações do pai com o editor
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value); // Atualiza o editor quando o valor do pai mudar
    }
  }, [value]);

  const toolbarOptions = [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ];

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleChange}
      placeholder="Digite o conteúdo aqui..."
      theme="snow" // Você pode usar outros temas como 'bubble'
      modules={{
        toolbar: toolbarOptions, // Configuração da barra de ferramentas
        resize: {}, // Ativando o redimensionamento
      }}
      style={{
        height: '400px',
      }}
    />
  );
};

export default RichTextEditorRTE;
