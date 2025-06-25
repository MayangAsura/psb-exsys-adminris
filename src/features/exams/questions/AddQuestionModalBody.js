// import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead } from "../../leads/leadSlice"
import {addQuestion} from "../../../services/api/questions"
import supabase from "../../../services/database-server"

import { useState, useEffect, useRef, useMemo } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
	ClassicEditor,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	BlockToolbar,
	Bold,
	Bookmark,
	Code,
	CodeBlock,
	Essentials,
	Heading,
	Highlight,
	HorizontalLine,
	Indent,
	IndentBlock,
	Italic,
	Link,
	Paragraph,
	Strikethrough,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar,
	Underline
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import '../../../App.css';
import TextAreaInput from "../../../components/Input/TextAreaInput"

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTIwMTkxOTksImp0aSI6IjhjODE0YzRkLWE3Y2MtNGMzOS05N2ZjLWY5Mzk1M2UwMTU3MSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImVjMmY1ZThlIn0._ODx05lwZxq9EI6Apulm49XoCqp-09-N90EjAhaUc_0ZFvsdY2MJYWZD3K0WDNMyHUacX5NAqxkhs9Oimq13-Q';

const INITIAL_QUESTION_OBJ = {
    question : "",
    answer : "",
    score : "",
    bank_code : ""
}

function AddQuestionModalBody({closeModal}){


    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [questionObj, setQuestionObj] = useState(INITIAL_QUESTION_OBJ)

    const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [editor, setEditor] = useState(
        "<p>Hello world</p><img src='https://images.unsplash.com/photo-1673859360509-1ef362f94f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NjMzNjE2OA&ixlib=rb-4.0.3&q=80&w=1080' />"
    );
    useEffect( () => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    },[])

    const saveNewQuestion = async () => {
        if(questionObj.question.trim() === "")return setErrorMessage("Pertanyaan is required!")
        else if(questionObj.answer.trim() === "")return setErrorMessage("Jawaban id is required!")
        else if(questionObj.score.trim() === "")return setErrorMessage("Email id is required!")
        else if(questionObj.bank_code.trim() === "")return setErrorMessage("Email id is required!")
        // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
        // else if(questionObj.email.trim() === "")return setErrorMessage("Email id is required!")
        else{
            // let newquestionObj = {
            //     "id": 7,
            //     "email": questionObj.email,
            //     "first_name": questionObj.first_name,
            //     "last_name": questionObj.last_name,
            //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
            // }
            const response = await addQuestion({question: questionObj})
                    // const {error, message, data} = await addExam({exam})
            console.log('response', response)
            // console.log('message', message)
            if(!response || response==null || response.error){
                dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
            }else if(!response.error) {
                console.log("masuk")
                dispatch(showNotification({message : response.message, status : 1}))
                closeModal()
            }else{
                dispatch(showNotification({message : "Gagal Menambahkan Pertanyaan", status : 0}))
            }
            // dispatch(addNewLead({newquestionObj}))
            // dispatch(showNotification({message : "New Lead Added!", status : 1}))
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setQuestionObj({...questionObj, [updateType] : value})
    }

    const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'undo',
						'redo',
						'|',
						'heading',
						'|',
						'bold',
						'italic',
						'underline',
						'|',
						'link',
						'insertTable',
						'highlight',
						'blockQuote',
						'codeBlock',
						'|',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					AutoLink,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					BlockToolbar,
					Bold,
					Bookmark,
					Code,
					CodeBlock,
					Essentials,
					Heading,
					Highlight,
					HorizontalLine,
					Indent,
					IndentBlock,
					Italic,
					Link,
					Paragraph,
					Strikethrough,
					Table,
					TableCellProperties,
					TableProperties,
					TableToolbar,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link'],
				blockToolbar: ['bold', 'italic', '|', 'link', 'insertTable', '|', 'outdent', 'indent'],
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				initialData:
					'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				menuBar: {
					isVisible: true
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [isLayoutReady]);


//     function uploadAdapter(loader) {
//   return {
//     upload: () => {
//       return new Promise(async (resolve, reject) => {
//         try {
//           const file = await loader.file;
          
//           const filepath = `${file}-${Date.now()}`
//             // const pid = participant.id?participant.id:participant_id
//             const { data_, error_ } = await supabase
//                 .storage
//                 .from('exams/uploads/questions')
//                 .upload("/" + filepath, file,
//                 {cacheControl: '3600', upsert: true}
//                 )
//             if (error_) {
//             console.error("Gagal Upload Berkas", error_.message)
//                 return null
//             }
//             const { data } = await supabase.storage.from("exams/uploads/questions").getPublicUrl("/" +filepath)
//             const data_url = {
//             path: data.publicUrl
//             }
//             console.log(data.publicUrl)
//             // setBerkasUrl(data.publicUrl)

            
//         //   const response = await axios.request({
//         //     method: "POST",
//         //     url: `${HOST}/upload_files`,
//         //     data: {
//         //       files: file
//         //     },
//         //     headers: {
//         //       "Content-Type": "multipart/form-data"
//         //     }
//         //   });
//         //   console.log(response)
//           resolve({
//             default: `${data.publicUrl}`
//           });
//         } catch (error) {
//           reject("Hello");
//         }
//       });
//     },
//     abort: () => {}
//   };
// }

class MyUploadAdapter {
    constructor( loader ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {

                const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
                
                return toBase64(file).then(cFile=>{
                    // return  Fetch("admin/uploadimage", {
                    //     imageBinary: cFile
                    // }).then((d) => {
                    //     if (d.status) {
                    //         this.loader.uploaded = true;
                    //         resolve( {
                    //             default: d.response.url
                    //         } );
                    //     } else {
                    //         reject(`Couldn't upload file: ${ file.name }.`)
                    //     }
                    // });
                })
                
            } ) );
    }

   
}

// function uploadPlugin(editor) {
//   editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
//     return uploadAdapter(loader);
//   };
// }

function uploadPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    };
}

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

function CustomUploadAdapterPlugin(editor) {
    console.log(editor)
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
    };
}

    return(
        <>
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor editor-container_include-block-toolbar" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>{editorConfig && 
                            <CKEditor 
                            // editorConfig,
                                editor={ClassicEditor} 
                                // licenseKey: LICENSE_KEY, 
                                // extraPlugins:[CustomUploadAdapterPlugin]
                                config={{licenseKey: LICENSE_KEY,
                                    image: {
                                    toolbar: [
                                        'imageTextAlternative',
                                        'toggleImageCaption',
                                        'imageStyle:inline',
                                        'imageStyle:block',
                                        'imageStyle:side',
                                    ]
                                },
                                }}
                                // editor={ClassicEditor}
                                onReady={(editor) => {}}
                                onBlur={(event, editor) => {}}
                                onFocus={(event, editor) => {}}
                                onChange={(event, editor) => {
                                    setEditor(editor.getData());
                                }}
                                data={editor} 
                                />}
                        </div>
                    </div>
                </div>
		    </div>
            <TextAreaInput type="text" defaultValue={questionObj.question} updateType="question" containerStyle="mt-4" labelTitle="Pertanyaan" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={questionObj.answer} updateType="answer" containerStyle="mt-4" labelTitle="Jawaban" updateFormValue={updateFormValue}/>

            <InputText type="text" defaultValue={questionObj.bank_code} updateType="bank_code" containerStyle="mt-4" labelTitle="Kode Soal" updateFormValue={updateFormValue}/>
            
            <InputText type="text" defaultValue={questionObj.score} updateType="score" containerStyle="mt-4" labelTitle="Skor" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={questionObj.score} updateType="score" containerStyle="mt-4" labelTitle="Skor" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={questionObj.score} updateType="score" containerStyle="mt-4" labelTitle="Skor" updateFormValue={updateFormValue}/>


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewQuestion()}>Save</button>
            </div>
        </>
    )
}

export default AddQuestionModalBody