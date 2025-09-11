// src/components/RichTextEditor.js
import { useState, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import Editor from './ckeditor/cusEditor';
import CustomEditor from '../ckeditor/customEditor';
 import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import { supabase } from '../../../services/supabase';
import supabase from '../../../../services/database-server';

const TextWithUploadImgCkeditor = ({ value, onChange, onBlur }) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAdapter = useCallback((loader) => {
    return {
      upload: async () => {
        setIsUploading(true);
        try {
          const file = await loader.file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('editor-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('editor-images')
            .getPublicUrl(filePath);

          setIsUploading(false);
          return { default: publicUrl };
        } catch (error) {
          console.error('Error uploading image:', error);
          setIsUploading(false);
          throw error;
        }
      }
    };
  }, []);

  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={CustomEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onBlur={onBlur}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
              'outdent', 'indent', '|',
              'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
            ]
          },
          image: {
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side'
            ]
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells'
            ]
          }
        }}
      />
      {isUploading && (
        <div className="upload-indicator">
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
};

// Custom upload adapter plugin
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return {
      upload: async () => {
        const file = await loader.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('editor-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('editor-images')
          .getPublicUrl(filePath);

        return { default: publicUrl };
      }
    };
  };
}

export default TextWithUploadImgCkeditor;