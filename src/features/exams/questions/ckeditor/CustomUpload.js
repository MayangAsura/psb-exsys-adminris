// src/CustomUploadAdapter.js
import { supabase } from './supabaseClient'; // Ensure you have your Supabase client initialized
import supabase from '../../../../services/database-server';

class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const fileName = `${Date.now()}-${file.name}`; // Ensure unique file names

    const { data, error } = await supabase.storage
      .from('exams/uploads/questions') // Your storage bucket name
      .upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Image upload failed.');
    }

    // Construct the public URL for the uploaded image
    const { data: publicURLData } = supabase.storage
      .from('exams/uploads/questions')
      .getPublicUrl(fileName);

    return {
      default: publicURLData.publicUrl,
    };
  }

  abort() {
    // Abort the upload if needed (optional)
  }
}

// CKEditor plugin factory function
export default function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader);
  };
}
