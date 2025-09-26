import { useState, useRef, useEffect, useMemo } from 'react';
import { FaSpinner } from 'react-icons/fa';
import supabase from '../../../../services/database-server';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

// Custom upload adapter for Supabase
class SupabaseUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._uploadFile(file)
            .then((url) => {
              resolve({ default: url });
            })
            .catch((error) => {
              reject(error);
            });
        })
    );
  }

  abort() {
    // Implement abort logic if needed
  }

  async _uploadFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPEG, PNG, GIF, WebP, BMP, atau TIFF.');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran file terlalu besar. Maksimal 10MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `content/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('exams')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('already exists')) {
          throw new Error('File dengan nama yang sama sudah ada. Silakan ubah nama file.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('exams')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

function SupabaseUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new SupabaseUploadAdapter(loader);
  };
}

const TextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Ketik konten di sini...',
  compact = false,
  height = 300,
  className = '',
  disabled = false
}) => {
  const [editorData, setEditorData] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const cloud = useCKEditorCloud({ version: '46.1.1' });

  useEffect(() => {
    setEditorData(value);
  }, [value]);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const handleEditorReady = (editor) => {
    editorRef.current = editor;
    
    // Listen for upload events
    editor.plugins.get('FileRepository').on('change:isUploading', (evt, name, isUploading) => {
      setIsUploading(isUploading);
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  const { ClassicEditor, editorConfig } = useMemo(() => {
    if (cloud.status !== 'success' || !isLayoutReady) {
      return {};
    }

    const {
      ClassicEditor,
      Essentials,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Heading,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      BulletedList,
      NumberedList,
      Alignment,
      Indent,
      Outdent,
      BlockQuote,
      Link,
      Image,
      ImageUpload,
      ImageInsert,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageCaption,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      MediaEmbed,
      Undo,
      Redo,
      Autoformat,
      AutoLink,
      List,
      Paragraph,
      PasteFromOffice,
      TextTransformation,
      WordCount
    } = cloud.CKEditor;

    return {
      ClassicEditor,
      editorConfig: {
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'fontBackgroundColor',
            'fontColor',
            'fontFamily',
            'fontSize',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'alignment',
            '|',
            'indent',
            'outdent',
            '|',
            'blockQuote',
            'link',
            'imageUpload',
            'imageInsert',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
          ],
          shouldNotGroupWhenFull: true
        },
        plugins: [
          Essentials,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Heading,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          BulletedList,
          NumberedList,
          Alignment,
          Indent,
          Outdent,
          BlockQuote,
          Link,
          Image,
          ImageUpload,
          ImageInsert,
          ImageResize,
          ImageStyle,
          ImageToolbar,
          ImageCaption,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          MediaEmbed,
          Undo,
          Redo,
          Autoformat,
          AutoLink,
          List,
          Paragraph,
          PasteFromOffice,
          TextTransformation,
          WordCount
        ],
        image: {
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage'
          ],
          upload: {
            types: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
            maxFileSize: 1024 * 1024 * 10 // 10MB
          },
          insert: {
            integrations: [
              'upload',
              'assetManager'
            ]
          },
          resizeOptions: [
            {
              name: 'resizeImage:original',
              value: null,
              icon: 'original'
            },
            {
              name: 'resizeImage:50',
              value: '50',
              icon: 'medium'
            },
            {
              name: 'resizeImage:75',
              value: '75',
              icon: 'large'
            }
          ],
          styles: {
            options: [
              'inline',
              'alignLeft',
              'alignRight',
              'alignCenter',
              'alignBlockLeft',
              'alignBlockRight',
              'block',
              'side'
            ]
          }
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties'
          ]
        },
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            openInNewTab: {
              mode: 'manual',
              label: 'Open in new tab',
              attributes: {
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            }
          }
        },
        placeholder: placeholder,
        extraPlugins: [SupabaseUploadAdapterPlugin],
        wordCount: {
          onUpdate: stats => {
            console.log('Characters:', stats.characters);
            console.log('Words:', stats.words);
          }
        },
        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q'
      }
    };
  }, [cloud, isLayoutReady, placeholder]);

  // Fallback configuration if cloud editor fails
  const fallbackConfig = useMemo(() => ({
    toolbar: {
      items: [
        'heading', '|', 'bold', 'italic', 'underline', '|',
        'bulletedList', 'numberedList', '|', 'link', 'imageUpload', '|',
        'undo', 'redo'
      ]
    },
    image: {
      toolbar: ['imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
      upload: {
        types: ['jpeg', 'png', 'gif', 'bmp', 'webp']
      }
    },
    placeholder: placeholder,
    extraPlugins: [SupabaseUploadAdapterPlugin]
  }), [placeholder]);

  return (
    <div 
      className={`
        relative ${compact ? 'compact' : ''} ${className}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      ref={editorContainerRef}
    >
      <div 
        className={`
          border border-gray-300 rounded-lg transition-all duration-200 
          hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200
          ${isUploading ? 'opacity-60' : ''}
          ${disabled ? 'pointer-events-none' : ''}
        `}
        style={{ 
          height: compact ? '200px' : `${height}px`,
          minHeight: '200px'
        }}
      >
        {ClassicEditor && editorConfig ? (
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onReady={handleEditorReady}
            onChange={handleEditorChange}
            config={editorConfig}
            disabled={disabled}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FaSpinner className="animate-spin text-2xl mb-2 mx-auto" />
              <p>Memuat editor...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <FaSpinner className="animate-spin text-blue-500 text-2xl mb-3" />
            <span className="text-sm text-gray-700 font-medium mb-2">
              Mengupload gambar...
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {uploadProgress}% selesai
            </span>
          </div>
        </div>
      )}

      {/* Character/Word Count (Optional) */}
      {!compact && (
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Gunakan tombol gambar di toolbar untuk upload</span>
          <span>Format: JPEG, PNG, GIF, WebP (maks. 10MB)</span>
        </div>
      )}
    </div>
  );
};

export default TextEditor;

// import { useState, useRef, useEffect, useMemo } from 'react';
// // import { CKEditor } from '@ckeditor/ckeditor5-react';
// // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { FaUpload, FaSpinner } from 'react-icons/fa';
// import supabase from '../../../../services/database-server';
// import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
// // Custom upload adapter for Supabase
// class SupabaseUploadAdapter {
//   constructor(loader) {
//     this.loader = loader;
//   }

//   upload() {
//     return this.loader.file.then(
//       (file) =>
//         new Promise((resolve, reject) => {
//           this._uploadFile(file)
//             .then((url) => {
//               resolve({ default: url });
//             })
//             .catch((error) => {
//               reject(error);
//             });
//         })
//     );
//   }

//   abort() {
//     // Implement abort logic if needed
//   }

//   async _uploadFile(file) {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const filePath = `${fileName}`;

//     try {
//       const { error: uploadError } = await supabase.storage
//         .from('exams/uploads/content')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage
//         .from('exams/uploads/content')
//         .getPublicUrl(filePath);

//       return publicUrl;
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw error;
//     }
//   }
// }

// function SupabaseUploadAdapterPlugin(editor) {
//   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//     return new SupabaseUploadAdapter(loader);
//   };
// }

// const TextEditor = ({ 
//   value = '', 
//   onChange, 
//   placeholder = 'Ketik pertanyaan di sini...',
//   compact = false,
//   height = 300,
//   className = ''
// }) => {
//   const [editorData, setEditorData] = useState(value);
//   const [isUploading, setIsUploading] = useState(false);
//   const editorRef = useRef(null);

//   useEffect(() => {
//     setEditorData(value);
//   }, [value]);

//   const handleEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setEditorData(data);
//     if (onChange) {
//       onChange(data);
//     }
//   };

//   	const editorContainerRef = useRef(null);
// 	// const editorRef = useRef(null);
// 	const [isLayoutReady, setIsLayoutReady] = useState(false);
// 	const cloud = useCKEditorCloud({ version: '46.1.1' });
// 	const LICENSE_KEY =
// 	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q';

// 	useEffect(() => {
// 		setIsLayoutReady(true);

// 		return () => setIsLayoutReady(false);
// 	}, []);

// 	const { ClassicEditor, editorConfig } = useMemo(() => {
// 		if (cloud.status !== 'success' || !isLayoutReady) {
// 			return {};
// 		}

// 		const {
// 			ClassicEditor,
// 			Autosave,
// 			BalloonToolbar,
// 			Bold,
// 			Essentials,
// 			Italic,
// 			Paragraph,
// 			Table,
// 			TableCaption,
// 			TableCellProperties,
// 			TableColumnResize,
// 			TableProperties,
// 			TableToolbar,
// 			Underline
// 		} = cloud.CKEditor;

// 		return {
// 			ClassicEditor,
// 			editorConfig: {
// 				toolbar: {
// 					items: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'insertTable'],
// 					shouldNotGroupWhenFull: false
// 				},
// 				plugins: [
// 					Autosave,
// 					BalloonToolbar,
// 					Bold,
// 					Essentials,
// 					Italic,
// 					Paragraph,
// 					Table,
// 					TableCaption,
// 					TableCellProperties,
// 					TableColumnResize,
// 					TableProperties,
// 					TableToolbar,
// 					Underline
// 				],
// 				balloonToolbar: ['bold', 'italic'],
// 				initialData:
// 					"<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou've successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What's next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor's\n\t\tconfiguration to match your application's style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don't hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<p>\n\t<i>An editor without the </i><code>Link</code>\n\t<i>plugin? That's brave! We hope the links below will be useful anyway </i>😉\n</p>\n<ul>\n\t<li>📝 Trial sign up: https://portal.ckeditor.com/checkout?plan=free,</li>\n\t<li>📕 Documentation: https://ckeditor.com/docs/ckeditor5/latest/installation/index.html,</li>\n\t<li>⭐️ GitHub (star us if you can!): https://github.com/ckeditor/ckeditor5,</li>\n\t<li>🏠 CKEditor Homepage: https://ckeditor.com,</li>\n\t<li>🧑‍💻 CKEditor 5 Demos: https://ckeditor.com/ckeditor-5/demo/</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser's\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n",
// 				licenseKey: LICENSE_KEY,
// 				placeholder: 'Type or paste your content here!',
// 				table: {
// 					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
// 				},
// 				extraPlugins: [SupabaseUploadAdapterPlugin],
// 				// extraPlugins: [CustomUploadAdapterPlugin],
				
// 			}
// 		};
// 	}, [cloud, isLayoutReady]);

//   const customConfig = {
//     toolbar: {
//       items: [
//         'heading',
//         '|',
//         'bold',
//         'italic',
//         'underline',
//         'strikethrough',
//         '|',
//         'fontBackgroundColor',
//         'fontColor',
//         '|',
//         'bulletedList',
//         'numberedList',
//         '|',
//         'alignment',
//         '|',
//         'indent',
//         'outdent',
//         '|',
//         'blockQuote',
//         'insertTable',
//         '|',
//         'link',
//         'imageUpload',
//         'mediaEmbed',
//         '|',
//         'undo',
//         'redo'
//       ]
//     },
//     placeholder: placeholder,
//     extraPlugins: [SupabaseUploadAdapterPlugin],
//     image: {
//       toolbar: [
//         'imageTextAlternative',
//         'toggleImageCaption',
//         'imageStyle:inline',
//         'imageStyle:block',
//         'imageStyle:side',
//         'linkImage'
//       ],
//       upload: {
//         types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
//       }
//     },
//     table: {
//       contentToolbar: [
//         'tableColumn',
//         'tableRow',
//         'mergeTableCells',
//         'tableProperties',
//         'tableCellProperties'
//       ]
//     },
//     link: {
//       addTargetToExternalLinks: true,
//       defaultProtocol: 'https://'
//     }
//   };

//   return (
//     <div className={`relative ${compact ? 'compact' : ''} ${className}`}>
//       <div 
//         className={`
//           border border-gray-300 rounded-lg transition-all duration-200 
//           hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200
//           ${isUploading ? 'opacity-60' : ''}
//         `}
//         style={{ height: `${height}px` }}
//       >
// 		<div className="editor-container__editor">
// 			<div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
// 		</div>
//         {/* <CKEditor
//           editor={ClassicEditor}
//           data={editorData}
//           onChange={handleEditorChange}
//           config={editorConfig}
//           onReady={(editor) => {
//             editorRef.current = editor;
//           }}
//         /> */}
//       </div>
      
//       {isUploading && (
//         <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
//           <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200">
//             <FaSpinner className="animate-spin text-blue-500 text-xl mb-2" />
//             <span className="text-sm text-gray-600">Mengupload gambar...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextEditor;

// /**
//  * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
//  * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoNgNARATAdA7DArBSIQE4CMm3qgDigBZEAGEAZnxDnSIvsQtKJBMXTiKJQgFMAdilJhgmMOJGSJAXUgBjIgBNSfEPIgygA=
//  */

// import { useState, useEffect, useRef, useMemo } from 'react';
// import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

// // import CustomUploadAdapterPlugin from '../ckeditor/customEditor';

// import '../custom-styles/editor.css';

// const LICENSE_KEY =
// 	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q';

// export default function App() {
// 	const editorContainerRef = useRef(null);
// 	const editorRef = useRef(null);
// 	const [isLayoutReady, setIsLayoutReady] = useState(false);
// 	const cloud = useCKEditorCloud({ version: '46.1.1' });

// 	useEffect(() => {
// 		setIsLayoutReady(true);

// 		return () => setIsLayoutReady(false);
// 	}, []);

// 	const { ClassicEditor, editorConfig } = useMemo(() => {
// 		if (cloud.status !== 'success' || !isLayoutReady) {
// 			return {};
// 		}

// 		const {
// 			ClassicEditor,
// 			Autosave,
// 			BalloonToolbar,
// 			Bold,
// 			Essentials,
// 			Italic,
// 			Paragraph,
// 			Table,
// 			TableCaption,
// 			TableCellProperties,
// 			TableColumnResize,
// 			TableProperties,
// 			TableToolbar,
// 			Underline
// 		} = cloud.CKEditor;

// 		return {
// 			ClassicEditor,
// 			editorConfig: {
// 				toolbar: {
// 					items: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'insertTable'],
// 					shouldNotGroupWhenFull: false
// 				},
// 				plugins: [
// 					Autosave,
// 					BalloonToolbar,
// 					Bold,
// 					Essentials,
// 					Italic,
// 					Paragraph,
// 					Table,
// 					TableCaption,
// 					TableCellProperties,
// 					TableColumnResize,
// 					TableProperties,
// 					TableToolbar,
// 					Underline
// 				],
// 				balloonToolbar: ['bold', 'italic'],
// 				initialData:
// 					"<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou've successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What's next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor's\n\t\tconfiguration to match your application's style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don't hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<p>\n\t<i>An editor without the </i><code>Link</code>\n\t<i>plugin? That's brave! We hope the links below will be useful anyway </i>😉\n</p>\n<ul>\n\t<li>📝 Trial sign up: https://portal.ckeditor.com/checkout?plan=free,</li>\n\t<li>📕 Documentation: https://ckeditor.com/docs/ckeditor5/latest/installation/index.html,</li>\n\t<li>⭐️ GitHub (star us if you can!): https://github.com/ckeditor/ckeditor5,</li>\n\t<li>🏠 CKEditor Homepage: https://ckeditor.com,</li>\n\t<li>🧑‍💻 CKEditor 5 Demos: https://ckeditor.com/ckeditor-5/demo/</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser's\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n",
// 				licenseKey: LICENSE_KEY,
// 				placeholder: 'Type or paste your content here!',
// 				table: {
// 					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
// 				},
// 				// extraPlugins: [CustomUploadAdapterPlugin],
				
// 			}
// 		};
// 	}, [cloud, isLayoutReady]);

// 	return (
// 		<div className="main-container">
// 			<div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
// 				<div className="editor-container__editor">
// 					<div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


// // import { useState, useRef, useEffect } from 'react';
// // // import { CKEditor } from '@ckeditor/ckeditor5-react';
// // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// // import { FaUpload, FaSpinner } from 'react-icons/fa';
// // import supabase from '../../../../services/database-server';
// // import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

// // // import './App.css';

// // const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6ImRkZThiOTAxLWQyNTUtNDEzNS1hMjgwLWNjMjMzYjgzYjMwOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6ImQxYzYyNWRmIn0.8XxgrNALuJioENHJPKDZqJbhVbQ8W80FGs9pqF7eGUmMMrvcwRs-cB7xenaRJpbI0D6e3AFBQPLP0DDZiCq78g'
// // 	// 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q';

// // // Custom upload adapter for Supabase
// // class SupabaseUploadAdapter {
// //   constructor(loader) {
// //     this.loader = loader;
// //   }

// //   upload() {
// //     return this.loader.file.then(
// //       (file) =>
// //         new Promise((resolve, reject) => {
// //           this._uploadFile(file)
// //             .then((url) => {
// //               resolve({ default: url });
// //             })
// //             .catch((error) => {
// //               reject(error);
// //             });
// //         })
// //     );
// //   }

// //   abort() {
// //     // Implement abort logic if needed
// //   }

// //   async _uploadFile(file) {
// //     const fileExt = file.name.split('.').pop();
// //     const fileName = `${Math.random()}.${fileExt}`;
// //     const filePath = `${fileName}`;

// //     try {
// //       const { error: uploadError } = await supabase.storage
// //         .from('exams/uploads/content')
// //         .upload(filePath, file);

// //       if (uploadError) throw uploadError;

// //       const { data: { publicUrl } } = supabase.storage
// //         .from('exams/uploads/content')
// //         .getPublicUrl(filePath);

// //       return publicUrl;
// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //       throw error;
// //     }
// //   }
// // }

// // function SupabaseUploadAdapterPlugin(editor) {
// //   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
// //     return new SupabaseUploadAdapter(loader);
// //   };
// // }

// // const TextEditor = ({ 
// //   value = '', 
// //   onChange, 
// //   placeholder = 'Ketik konten di sini...',
// //   compact = false,
// //   height = 300,
// //   className = ''
// // }) => {
// //   const [editorData, setEditorData] = useState(value);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const editorRef = useRef(null);

// //   useEffect(() => {
// //     setEditorData(value);
// //   }, [value]);

// //   const handleEditorChange = (event, editor) => {
// //     const data = editor.getData();
// //     setEditorData(data);
// //     if (onChange) {
// //       onChange(data);
// //     }
// //   };

// //   const customConfig = {
// //     toolbar: {
// //       items: [
// //         'heading',
// //         '|',
// //         'bold',
// //         'italic',
// //         'underline',
// //         'strikethrough',
// //         '|',
// //         'fontBackgroundColor',
// //         'fontColor',
// //         '|',
// //         'bulletedList',
// //         'numberedList',
// //         '|',
// //         'alignment',
// //         '|',
// //         'indent',
// //         'outdent',
// //         '|',
// //         'blockQuote',
// //         'insertTable',
// //         '|',
// //         'link',
// //         'imageUpload',
// //         'mediaEmbed',
// //         '|',
// //         'undo',
// //         'redo'
// //       ]
// //     },
// // 	licenseKey: LICENSE_KEY,
// //     placeholder: placeholder,
// //     extraPlugins: [SupabaseUploadAdapterPlugin],
// //     image: {
// //       toolbar: [
// //         'imageTextAlternative',
// //         'toggleImageCaption',
// //         'imageStyle:inline',
// //         'imageStyle:block',
// //         'imageStyle:side',
// //         'linkImage'
// //       ],
// //       upload: {
// //         types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
// //       }
// //     },
// //     table: {
// //       contentToolbar: [
// //         'tableColumn',
// //         'tableRow',
// //         'mergeTableCells',
// //         'tableProperties',
// //         'tableCellProperties'
// //       ]
// //     },
// //     link: {
// //       addTargetToExternalLinks: true,
// //       defaultProtocol: 'https://'
// //     }
// //   };

// //   return (
// //     <div className={`relative ${compact ? 'compact' : ''} ${className}`}>
// //       <div 
// //         className={`
// //           border border-gray-300 rounded-lg transition-all duration-200 
// //           hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200
// //           ${isUploading ? 'opacity-60' : ''}
// //         `}
// //         style={{ height: `${height}px` }}
// //       >
// //         <CKEditor
// //           editor={ClassicEditor}
// //           data={editorData}
// //           onChange={handleEditorChange}
// //           config={customConfig}
// //           onReady={(editor) => {
// //             editorRef.current = editor;
// //           }}
// //         />
// //       </div>
      
// //       {isUploading && (
// //         <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
// //           <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200">
// //             <FaSpinner className="animate-spin text-blue-500 text-xl mb-2" />
// //             <span className="text-sm text-gray-600">Mengupload gambar...</span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TextEditor;

// // // /**
// // //  * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
// // //  * https://ckeditor.com/ckeditor-5/builder/#installation/NoNgNARATAdA7DALBSIQE4CMj0gKyZxwAcc6ZcicUxixxUADJk44+nSMpAKYB2KRmGCYwooeLEBdSOgDGAMzkAjKCAhSgA==
// // //  */

// // // import { useState, useEffect, useRef, useMemo } from 'react';
// // // import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

// // // // import './App.css';

// // // const LICENSE_KEY =
// // // 	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q';

// // // export default function TextEditor() {
// // // 	const editorContainerRef = useRef(null);
// // // 	const editorRef = useRef(null);
// // // 	const [isLayoutReady, setIsLayoutReady] = useState(false);
// // // 	const cloud = useCKEditorCloud({ version: '46.1.0' });

// // // 	useEffect(() => {
// // // 		setIsLayoutReady(true);

// // // 		return () => setIsLayoutReady(false);
// // // 	}, []);

// // // 	const { ClassicEditor, editorConfig } = useMemo(() => {
// // // 		if (cloud.status !== 'success' || !isLayoutReady) {
// // // 			return {};
// // // 		}

// // // 		const {
// // // 			ClassicEditor,
// // // 			AutoImage,
// // // 			Autosave,
// // // 			BalloonToolbar,
// // // 			Base64UploadAdapter,
// // // 			Bold,
// // // 			CloudServices,
// // // 			Code,
// // // 			Essentials,
// // // 			FontBackgroundColor,
// // // 			FontColor,
// // // 			FontFamily,
// // // 			FontSize,
// // // 			Highlight,
// // // 			ImageBlock,
// // // 			ImageCaption,
// // // 			ImageInline,
// // // 			ImageInsert,
// // // 			ImageInsertViaUrl,
// // // 			ImageResize,
// // // 			ImageStyle,
// // // 			ImageTextAlternative,
// // // 			ImageToolbar,
// // // 			ImageUpload,
// // // 			Italic,
// // // 			Link,
// // // 			LinkImage,
// // // 			Paragraph,
// // // 			RemoveFormat,
// // // 			Strikethrough,
// // // 			Subscript,
// // // 			Superscript,
// // // 			Table,
// // // 			TableCaption,
// // // 			TableCellProperties,
// // // 			TableColumnResize,
// // // 			TableProperties,
// // // 			TableToolbar,
// // // 			Underline
// // // 		} = cloud.CKEditor;

// // // 		return {
// // // 			ClassicEditor,
// // // 			editorConfig: {
// // // 				toolbar: {
// // // 					items: [
// // // 						'undo',
// // // 						'redo',
// // // 						'|',
// // // 						'fontSize',
// // // 						'fontFamily',
// // // 						'fontColor',
// // // 						'fontBackgroundColor',
// // // 						'|',
// // // 						'bold',
// // // 						'italic',
// // // 						'underline',
// // // 						'strikethrough',
// // // 						'subscript',
// // // 						'superscript',
// // // 						'code',
// // // 						'removeFormat',
// // // 						'|',
// // // 						'link',
// // // 						'insertImage',
// // // 						'insertTable',
// // // 						'highlight'
// // // 					],
// // // 					shouldNotGroupWhenFull: false
// // // 				},
// // // 				plugins: [
// // // 					AutoImage,
// // // 					Autosave,
// // // 					BalloonToolbar,
// // // 					Base64UploadAdapter,
// // // 					Bold,
// // // 					CloudServices,
// // // 					Code,
// // // 					Essentials,
// // // 					FontBackgroundColor,
// // // 					FontColor,
// // // 					FontFamily,
// // // 					FontSize,
// // // 					Highlight,
// // // 					ImageBlock,
// // // 					ImageCaption,
// // // 					ImageInline,
// // // 					ImageInsert,
// // // 					ImageInsertViaUrl,
// // // 					ImageResize,
// // // 					ImageStyle,
// // // 					ImageTextAlternative,
// // // 					ImageToolbar,
// // // 					ImageUpload,
// // // 					Italic,
// // // 					Link,
// // // 					LinkImage,
// // // 					Paragraph,
// // // 					RemoveFormat,
// // // 					Strikethrough,
// // // 					Subscript,
// // // 					Superscript,
// // // 					Table,
// // // 					TableCaption,
// // // 					TableCellProperties,
// // // 					TableColumnResize,
// // // 					TableProperties,
// // // 					TableToolbar,
// // // 					Underline
// // // 				],
// // // 				balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage'],
// // // 				fontFamily: {
// // // 					supportAllValues: true
// // // 				},
// // // 				fontSize: {
// // // 					options: [10, 12, 14, 'default', 18, 20, 22],
// // // 					supportAllValues: true
// // // 				},
// // // 				image: {
// // // 					toolbar: [
// // // 						'toggleImageCaption',
// // // 						'imageTextAlternative',
// // // 						'|',
// // // 						'imageStyle:inline',
// // // 						'imageStyle:wrapText',
// // // 						'imageStyle:breakText',
// // // 						'|',
// // // 						'resizeImage'
// // // 					]
// // // 				},
// // // 				initialData:
// // // 					'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
// // // 				licenseKey: LICENSE_KEY,
// // // 				link: {
// // // 					addTargetToExternalLinks: true,
// // // 					defaultProtocol: 'https://',
// // // 					decorators: {
// // // 						toggleDownloadable: {
// // // 							mode: 'manual',
// // // 							label: 'Downloadable',
// // // 							attributes: {
// // // 								download: 'file'
// // // 							}
// // // 						}
// // // 					}
// // // 				},
// // // 				placeholder: 'Type or paste your content here!',
// // // 				table: {
// // // 					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
// // // 				}
// // // 			}
// // // 		};
// // // 	}, [cloud, isLayoutReady]);

// // // 	return (
// // // 		<div className="main-container">
// // // 			<div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
// // // 				<div className="editor-container__editor">
// // // 					<div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
// // // 				</div>
// // // 			</div>
// // // 		</div>
// // // 	);
// // // }
