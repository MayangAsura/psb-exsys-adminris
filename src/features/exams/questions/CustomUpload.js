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