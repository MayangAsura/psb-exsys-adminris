    // CustomUploadAdapter.js
    class CustomUploadAdapter {
      constructor(loader) {
        this.loader = loader;
      }

      upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
          // Implement your image upload logic here.
          // Example using fetch:
          const formData = new FormData();
          formData.append('upload', file);
// eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODUxOTY3OTksImp0aSI6IjJkOGU3OTM0LTUyYmUtNGNjMS04OWRjLTBiMTA1MDU5YzVhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiNjY1ZjM5YjIifQ.Lql0QXsyfZgFz6rEuEoar-fEHpUe0QZm8KhoTanzauPbmAienX-hIhiVJYs_OBPEM3eoBMHyzhob3iy13DMA_Q
          fetch('', {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => {
            if (data.url) {
              resolve({ default: data.url });
            } else {
              reject('Upload failed');
            }
          })
          .catch(error => {
            reject(error);
          });
        }));
      }

      abort() {
        // Implement abort logic if needed.
      }
    }

    export default function CustomUploadAdapterPlugin(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
      };
    }

// class CustomUploadAdapter {
//     constructor(loader) {
//         // The file loader instance to use during the upload.
//         this.loader = loader;
//     }

//     upload() {
//         return this.loader.file.then(file => new Promise((resolve, reject) => {
//             // Customize your upload logic here.

//             // but for siplicity i am using the dummy url and evrytime sending back the same request
//             const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/220px-Google_Images_2015_logo.svg.png"
//             resolve({ default: url })
//         }));
//     }

//     abort() {
//         // Abort the upload process if needed.
//     }
// }

// export default function CustomUploadAdapterPlugin(editor) {
//     console.log(editor)
//     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//         return new CustomUploadAdapter(loader);
//     };
// }