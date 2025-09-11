import React, { useState, useRef, useEffect } from 'react';
import supabase from '../../services/database-server';
// import { supabase } from '../services/supabase'; // Adjust the import path as needed

const RichTextEditor = ({ value, onChange, onBlur }) => {
  const [content, setContent] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Update content when value prop changes
  useEffect(() => {
    setContent(value || '');
  }, [value]);

  // Handle content changes
  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('editor-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('editor-images')
        .getPublicUrl(filePath);

      // Add to uploaded images list
      setUploadedImages(prev => [...prev, { url: publicUrl, name: file.name }]);
      
      setIsUploading(false);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      alert('Image upload failed');
      return null;
    }
  };

  // Insert image into editor
  const insertImage = (url) => {
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.alt = 'Uploaded image';
    
    // Insert at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
      range.collapse(false);
      
      // Update content
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        setContent(newContent);
        if (onChange) onChange(newContent);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      insertImage(imageUrl);
    }
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const imageUrl = await handleImageUpload(files[0]);
      if (imageUrl) {
        insertImage(imageUrl);
      }
    }
  };

  // Handle toolbar actions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) onChange(newContent);
    }
  };

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="toolbar">
        <button type="button" onClick={() => formatText('bold')} title="Bold">
          <i className="fas fa-bold"></i>
        </button>
        <button type="button" onClick={() => formatText('italic')} title="Italic">
          <i className="fas fa-italic"></i>
        </button>
        <button type="button" onClick={() => formatText('underline')} title="Underline">
          <i className="fas fa-underline"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button type="button" onClick={() => formatText('justifyLeft')} title="Align Left">
          <i className="fas fa-align-left"></i>
        </button>
        <button type="button" onClick={() => formatText('justifyCenter')} title="Align Center">
          <i className="fas fa-align-center"></i>
        </button>
        <button type="button" onClick={() => formatText('justifyRight')} title="Align Right">
          <i className="fas fa-align-right"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button type="button" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
          <i className="fas fa-list-ul"></i>
        </button>
        <button type="button" onClick={() => formatText('insertOrderedList')} title="Numbered List">
          <i className="fas fa-list-ol"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()} 
          title="Insert Image"
          disabled={isUploading}
        >
          <i className="fas fa-image"></i>
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        className="editor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentChange}
        onBlur={onBlur}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      />
      
      {/* Upload Status */}
      {isUploading && (
        <div className="upload-status">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Uploading image...</span>
        </div>
      )}
      
      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h4>Uploaded Images</h4>
          <div className="image-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.url} alt={image.name} />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(image.url);
                    alert('Image URL copied to clipboard!');
                  }}
                  title="Copy URL"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .rich-text-editor {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          margin: 20px 0;
        }
        
        .toolbar {
          display: flex;
          padding: 10px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }
        
        .toolbar button {
          background: none;
          border: none;
          padding: 8px 10px;
          cursor: pointer;
          border-radius: 4px;
          margin: 2px;
        }
        
        .toolbar button:hover {
          background-color: #e9ecef;
        }
        
        .toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .toolbar-divider {
          width: 1px;
          background-color: #e0e0e0;
          margin: 0 8px;
        }
        
        .editor {
          min-height: 200px;
          padding: 16px;
          font-size: 16px;
          line-height: 1.6;
          outline: none;
        }
        
        .editor:focus {
          border-color: #1a2a6c;
        }
        
        .upload-status {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #e3f2fd;
          color: #0d47a1;
          font-size: 14px;
          border-top: 1px solid #bbdefb;
        }
        
        .upload-status i {
          margin-right: 8px;
        }
        
        .uploaded-images {
          padding: 16px;
          border-top: 1px solid #e0e0e0;
        }
        
        .uploaded-images h4 {
          margin: 0 0 10px 0;
          color: #1a2a6c;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
        }
        
        .image-item {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .image-item img {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }
        
        .image-item button {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
        }
        
        @media (max-width: 768px) {
          .toolbar {
            padding: 5px;
          }
          
          .toolbar button {
            padding: 6px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;