import React, { useState, useEffect } from 'react';
// import RichTextEditor from './RichTextEditor';
import RichTextEditor from './CustomEditor';
// import { supabase } from '../services/supabase';
import supabase from '../../services/database-server';

const EditorWithGallery = () => {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch uploaded images
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('editor-images')
        .list();

      if (error) throw error;

      const imageUrls = await Promise.all(
        data.map(async (image) => {
          const { data: { publicUrl } } = supabase.storage
            .from('editor-images')
            .getPublicUrl(image.name);
          return { name: image.name, url: publicUrl };
        })
      );

      setUploadedImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageName) => {
    try {
      const { error } = await supabase.storage
        .from('editor-images')
        .remove([imageName]);

      if (error) throw error;

      // Refresh the image list
      fetchUploadedImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-section">
        <h2>Rich Text Editor</h2>
        <RichTextEditor
          value={content}
          onChange={setContent}
        />
      </div>
      
      <div className="gallery-section">
        <h2>Uploaded Images</h2>
        {isLoading ? (
          <div className="loading">Loading images...</div>
        ) : (
          <div className="image-grid">
            {uploadedImages.map((image) => (
              <div key={image.name} className="image-item">
                <img src={image.url} alt={image.name} />
                <div className="image-actions">
                  <button 
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(image.url)}
                  >
                    Copy URL
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteImage(image.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .editor-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        
        .editor-section, .gallery-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          color: #1a2a6c;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }
        
        .image-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .image-item img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        
        .image-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 5px;
          display: flex;
          justify-content: space-around;
        }
        
        .copy-btn, .delete-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 5px;
        }
        
        .delete-btn {
          color: #ff6b6b;
        }
        
        @media (max-width: 768px) {
          .editor-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorWithGallery;