class CustomUploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            // Customize your upload logic here.

            // but for siplicity i am using the dummy url and evrytime sending back the same request
            const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/220px-Google_Images_2015_logo.svg.png"
            resolve({ default: url })
        }));
    }

    abort() {
        // Abort the upload process if needed.
    }
}

export default function CustomUploadAdapterPlugin(editor) {
    console.log(editor)
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
    };
}

// // src/components/CustomEditor.js
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// // import Editor from 'ckeditor5-custom-build/build/ckeditor';
// import {ClassicEditor} from '@ckeditor/ckeditor5-build-classic';
// // import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic/src/ClassicEditor'

// const CustomEditor = ({ value, onChange, onBlur }) => {
//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       data={value}
//       onChange={(event, editor) => {
//         const data = editor.getData();
//         onChange(data);
//       }}
//       onBlur={onBlur}
//       config={{
//         toolbar: {
//           items: [
//             'heading', '|',
//             'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
//             'outdent', 'indent', '|',
//             'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
//           ]
//         },
//         image: {
//           toolbar: [
//             'imageTextAlternative',
//             'toggleImageCaption',
//             'imageStyle:inline',
//             'imageStyle:block',
//             'imageStyle:side'
//           ]
//         },
//         table: {
//           contentToolbar: [
//             'tableColumn',
//             'tableRow',
//             'mergeTableCells'
//           ]
//         },
//         simpleUpload: {
//           uploadUrl: '/api/upload', // Your upload endpoint
//           withCredentials: true,
//           headers: {
//             'Authorization': 'Bearer your-token-here'
//           }
//         }
//       }}
//     />
//   );
// };

// export default CustomEditor;