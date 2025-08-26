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