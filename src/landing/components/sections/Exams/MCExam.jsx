import { useEffect, useState } from "react";
import Header from "../../Header"
import Footer from "../Footer/Footer"
import { openModal } from "../../../../features/common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../../utils/globalConstantUtil'
import { showNotification } from '../../../../features/common/headerSlice'
import supabase from "../../../services/database/database";
import SEExam from "./SEExam"
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {startCount} from '../../../../utils/starCountTime'
import {FaClock} from 'react-icons/fa'


import '../../../../index-user.css'


const MCExam = () =>{
  const [values, setValues] = useState([])
  const [scores, setScores] = useState(0)
  const [responseDetailValues, setResponseDetailValues] = useState([])
  const [started_at, setStartedAt] = useState("")
  const [exam, setEx] = useState({})
  // const [exam, setEx] = useState({id: "sdsf", name: "Test TKD", score: 100, start_at: new Date().toISOString(), end_at: new Date().toISOString(), question_type: 'MC'})
  // {id: "sdsf", name: "Test TKD", score: 100, start_at: new Date().toISOString(), end_at: new Date().toISOString()}
  // const [question, set] = useState([])
  const [quedata, setQueData] = useState([{num: "1", qid: "sdfd", que: "Siapa nama ayah Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]},{num: "2", qid: "", que: "Dimana awal mula dakwah Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}, {num: "3", qid: "", que: "Siapa sahabat terdekat Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}])
  // const [quedata2, setQueData2] = useState([{num: "2", qid: "", que: "Dimana awal mula dakwah Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}, {num: "3", qid: "", que: "Siapa sahabat terdekat Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}])
  const [quedata2, setQueData2] = useState([])
  // const [quedata, setQueData] = useState([{num: "", qid: "", que: "", an:"", bc: "",sc: "", qty: "", ir: false, or: "", options: []} ])
  // {option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}
  // {num: "2", qid: "", que: "Dimana awal mula dakwah Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}, {num: "3", qid: "", que: "Siapa sahabat terdekat Nabi Muhammad?", an:"", bc: "",sc: "", qty: "", ir: "", or: "", options: [{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}]}
  const [options, setOptions2] = useState([{option: "Abdullah", order: "", point: 20}, {option: "Abu Bakr", order: "", point: 0}, {option: "Abdullah bin Mas'ud", order: "", point: 20}])
  // const [options, setOptions] = useState([])
  const [options2, setOptions] = useState([{id: "sdsd", order : "", option: "Abdullah", exam_test_id: "sdsd", type: "MC", exam_test_content_id: "SDSDF"}, {id: "sdsdsdfsf2", order : "", option: "Abdullah bin Mas'ud", exam_test_id: "sdsd", type: "MC", exam_test_content_id: "SDSDF"}, {id: "sdfsdfsdf  ", order : "", option: "Abu Bakar", exam_test_id: "sdsd", type: "MC", exam_test_content_id: "SDSDF"}])
  // {id: "", order : "", option: "", exam_test_id: "", type: "", exam_test_content_id: ""}
  // {order: "", option : "", point : "", exam_test_id: "", id : "", type: ""}
  const [ti, setti] = useState("")
  const dispatch = useDispatch()
  const appl_id = ''
  let j = "A";

  const id = useParams().id

  useEffect(() => {
    getExam(id)
    

//     if (window.performance) {
//   if (performance.navigation.type == 1) {
//     // alert( "This page is reloaded" );
//     // setQueData([])
//     // setOptions([])
//   } else {
//     // alert( "This page is not reloaded");
//   }
// }

    // if(started_at) {
    // getquedata(id)
      // getOptions(id)
    // }
    if(started_at){
      getti()
      startCount(exam.started_at, exam.ended_at, ti, started_at)
      console.log(shuffleData(quedata)) 

      console.log(shuffleData(options)) 
    }
  },[id, quedata, options])

  const getti = async () =>{
    let { data, error } = await supabase
      .rpc('get_current_ttmp')
    if (error) console.error(error)
    else{
  setti(data)
  console.log(data)
    } 
  }
  const getquedata = async (id) => {
    let { data: exam_test_contents, error } = await supabase
      .from('exam_test_contents')
      .select('*')
      .eq('exam_test_id', id)
    if(!error) {
      exam_test_contents.map((e, k) => (

        setTimeout(() => {
          
          // getOptions(e.id)
          // shuffleData(options)
          // console.log(options)
          setQueData((value, key) => ([...value, {num: k+1, qid:e.id, que: e.question, an: e.answer, bc: e.bank_code, sc:e.score,qty: e.question_type, ir: false, or: e.order??null, options: options }]))
          // setOptions([])
        }, 2000)

        
        
      ))

      shuffleData(quedata)
      // console.log(quedata)
    }
  }
  const shuffleData = (data) => {
    
    let counter = data.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = data[counter];
        data[counter] = data[index];
        data[index] = temp;
    }

    return data;

  }

  const getOptions = async (id) => {
    let { data: exam_test_content_options, error } = await supabase
      .from('exam_test_content_options')
      .select('*')
      .eq('exam_test_content_id', id)

      if(!error){
        console.log(exam_test_content_options)
        setOptions(exam_test_content_options)
        // exam_test_content_options.map((e, k) => (
        // // // //   // setOptions([{ id: e.id, order : e.order, option: e.option, exam_test_id: e.exam_test_id, point: e.point, type: e.type}])
        // // // //   // options.push({ id: e.id, order : e.order, option: e.option, exam_test_id: e.exam_test_id, point: e.point, type: e.type})
        // // // //   // setQueData((value) => ([...value, {num: k+1, qid:e.id, que: e.question, an: e.answer, bc: e.bank_code, sc:e.score,qty: e.question_type, ir: false, or: e.order??null, options: options }]))
        //           setOptions((value) => ([...value, { id: e.id, order : e.order, option: e.option, exam_test_id: e.exam_test_id, type: e.type, exam_test_content_id: e.exam_test_content_id}]))
        // ))
        // setOptions
        shuffleData(options)
      }
      console.log(options)

  }

  const getExam = async (id) => {
    let { data: exam_tests, error } = await supabase
      .from('exam_tests')
      .select('*')
      .eq('id', id)
      if(!error){
        setEx(exam_tests[0])
      }
  }

  const setValue = (name, e)=>{
    setValues((value) => 
      value.filter((obj) =>(obj.exam_test_content_id?obj.exam_test_content_id:obj.order != name? values.push({exam_test_content_id: name, answer: e}): "")))
    // [...values{...values,}]
  }
  
  const startExam = (date) => {
    setStartedAt(date)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("masuk")

    quedata.forEach(element => {
      values.map((e) => ( element.answer == e.a? setScores(scores + e.scores)&&{...e, point: element.score}: {...e, point: 0}))
    });
    // setAnswers(values)

    const responseValues = { exam_test_id: quedata.exam_test_id, appl_id: appl_id, point: scores, start_at: started_at, submit_at: new Date().toISOString(), created_by: quedata.appl_id }
    const { data, error } = await supabase
    .from('exam_test_responses')
    .insert([
      responseValues
    ])
    .select()

    values.map((value) => (setResponseDetailValues((res) => [...res, {exam_test_response_id: data.id, exam_test_content_id: value.name, answer:value.answer, point: value.point}])))

    
    if(!error){
        
        dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Data ujian gagal tersimpan'}}))
      }

    const { data2, error2 } = await supabase
      .from('exam_test_response_details')
      .insert([
        responseDetailValues
      ])
      .select()

      if(!error2){
        
        dispatch(openModal({title : "Ujian Tersimpan", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Anda telah menyelesaikan ujian'}}))
      }else{
        dispatch(openModal({title : "Gagal", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : 'Data ujian gagal tersimpan'}}))
      }
          
          
  }

  // const calculateScore = 
return (
<>
<main className="flex flex-col max-w-lg min-h-screen relative min-w-screen my-0 mx-auto bg-gray-50 pb-10" >
      <Header />
      {/* <ProfileCover /> */}
      <div className="container px-4">
        <div className="flex flex-wrap gap-3 px-4 ">
          {!started_at && (
            <div>
              <p className="pt-2 pb-3 text-base-300 text-lg">Berikut ini tata tertib terkait ujian</p>
                          <ol className=" text-base text-gray-600">
                            <li>1. Berdoa dan memohon taufik kepada Allah sebelum memulai</li>
                            <li>2. Harap jujur dan tidak curang dalam mengerjakan ujian</li>
                            <li>3. Jumlah soal adalah {quedata.length} </li>
                            <li>4. Waktu ujian adalah   detik</li>
                            <li>5. Sangat tidak dianjurkan untuk merefresh halaman karena akan memotong waktu</li>
                            <li>6. Jika waktu habis maka akan otomatis submit</li>
                          </ol>
                          <div className="text-center p-3 my-5">
                            <button id="startUjian" type="button" onClick={()=> {startExam(new Date().toISOString())}} className="btn btn-outline-primary">Mulai Ujian</button>
                          </div>
            </div>

          )}

          {started_at && exam.question_type === 'MC' && (
            <>
            <section className="bg-gray-300 rounded-3xl my-3 w-screen">
                  <div className="px-0 py-10 mx-auto max-w-7xl sm:px-4">
            <div className="flex flex-col gap-1 justify-center items-center">
                      <p className="font-bold text-gray-900 text-4xl flex justify-center text-center items-center">{exam.name?? "Ujian TKD"}</p>
                      <p className="text-gray-800 text-md mt-3">Senin, 23 Maret 2025 13:00 WIB</p>
                      <p className="text-gray-800 text-md">Jumlah Soal : 3 Soal</p>
                      <p className="text-gray-800 text-md">Durasi : 3600 detik</p>
                    </div>
                    </div>
                    </section>
              <section className="bg-gray-300 rounded-3xl my-3 w-screen">
                  <div className="px-0 py-20 mx-auto max-w-7xl sm:px-4">
                      <div>
                        <form onSubmit={handleSubmit}>
                          
                                <input type="hidden" name="tipe" value="SOAL"/>
                                <div className="form-group ">
                                  <table className="table  table-bordered  border-opacity-5 table-head-bg-primary -mt-10" style={{ width:'100%' }}>
                                    {/* <?php $i = 1; ?> */}
                                    {/* <?php foreach ($soal as $key => $row) : ?> */}

                                    <tbody>
                                      <th className="text-lg text-gray-800">Soal:</th>
                                    {quedata.map( (el, index) => (
                                      // return (
                                        <>
                                        {/* {el.que} */}
                                      <tr>
                                        <td style={{ width: '3%'}} className="items-start text-gray-800 text-lg">{el.or? el.or :el.num}. </td>
                                        <td className="text-gray-800 text-lg" style={{ width:'97%' }}>{el.que} </td>
                                        {/* <?= $row['nomor'] ? $row['no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  mor'] : $i++ ?>. */}
                                      </tr>
                                      <tr>
                                        <td></td>
                                        <td>
                                          {/* <?php $j = "a"; ?>
                                          <?php foreach ($row['notes'] as $selection) : ?> */}
                                          {el.options.map((o, k) => (
                                            <label className="mb-0 pr-5 flex gap-2 justify-start items-center mb-2" style={{ whiteSpace: 'normal !important' }}>
                                              {/* "option[<?= $key ?>][answer]" */}
                                              {/* "<?= $selection['key'] ?>" */}
                                              {/* option[${e.order? e.order : o.id}][answer] */}
                                              <input name={`option[${el.or? el.or : el.qid}][answer]`} className="form-input radio-md text-gray-800 rounded-lg " placeholder={o.order? o.order : '' } type="radio" value={o.option?o.option:o.id} onChange={(e) => setValue(el.or?el.or:el.qid, e.target.value)}/> 
                                              <span className="text-gray-800 ">{o.order? o.order : "" } {o.option}</span>
                                               <br />
                                              {/* <?= $selection['id'] ? $selection['id'] : $j++ ?>. <?= $selection['text'] ?> */}
                                            </label>
                                          ))}
                                          {/* <?php endforeach; ?> */}
                                        </td>
                                      </tr>
                                      </>
                                      // )
                                    ) )}
                                    {/* <?php endforeach; ?> */}
                                      </tbody>
                                  </table>
                                </div>
                                <div className="flex justify-center items-center">

                                <button type="submit" name="submit" id="mySubmit" className="btn block w-full bg-green-700 border-none " >Kirim Hasil</button>
                                </div>
                        </form>
                              </div>
                      {/* <div className="w-full px-4 pt-5 pb-6 mx-auto mt-8 mb-6 bg-white rounded-none shadow-xl sm:rounded-lg sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 sm:px-6">
                      <h1 className="mb-4 text-lg font-semibold text-left text-gray-900">Log in to your account</h1>
                      <form className="mb-8 space-y-4">
                          <label className="block">
                          <span className="block mb-1 text-xs font-medium text-gray-700">Your Email</span>
                          <input className="form-input" type="email" placeholder="Ex. james@bond.com" inputmode="email" required />
                          </label>
                          <label className="block">
                          <span className="block mb-1 text-xs font-medium text-gray-700">Your Password</span>
                          <input className="form-input" type="password" placeholder="••••••••" required />
                          </label>
                          <input type="submit" className="w-full py-3 mt-1 btn btn-primary" value="Login" />
                      </form>
                      <div className="space-y-8">
                          <div className="text-center border-b border-gray-200" style="line-height: 0px">
                          <span className="p-2 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-white" style="line-height: 0px">Or</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                          <a href="#" className="py-3 btn btn-icon btn-google">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                              <path
                                  d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28 c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233 c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934 C20.485,11.453,20.404,10.884,20.283,10.356z"
                              />
                              </svg>
                              <span className="sr-only">Continue with</span> Google
                          </a>
                          <a href="#" className="py-3 btn btn-icon btn-dark">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                              <path
                                  d="M19.665,16.811c-0.287,0.664-0.627,1.275-1.021,1.837c-0.537,0.767-0.978,1.297-1.316,1.592 c-0.525,0.482-1.089,0.73-1.692,0.744c-0.432,0-0.954-0.123-1.562-0.373c-0.61-0.249-1.17-0.371-1.683-0.371  c-0.537,0-1.113,0.122-1.73,0.371c-0.616,0.25-1.114,0.381-1.495,0.393c-0.577,0.025-1.154-0.229-1.729-0.764 c-0.367-0.32-0.826-0.87-1.377-1.648c-0.59-0.829-1.075-1.794-1.455-2.891c-0.407-1.187-0.611-2.335-0.611-3.447  c0-1.273,0.275-2.372,0.826-3.292c0.434-0.74,1.01-1.323,1.73-1.751C7.271,6.782,8.051,6.563,8.89,6.549  c0.46,0,1.063,0.142,1.81,0.422s1.227,0.422,1.436,0.422c0.158,0,0.689-0.167,1.593-0.498c0.853-0.307,1.573-0.434,2.163-0.384  c1.6,0.129,2.801,0.759,3.6,1.895c-1.43,0.867-2.137,2.08-2.123,3.637c0.012,1.213,0.453,2.222,1.317,3.023 c0.392,0.372,0.829,0.659,1.315,0.863C19.895,16.236,19.783,16.529,19.665,16.811L19.665,16.811z M15.998,2.38  c0,0.95-0.348,1.838-1.039,2.659c-0.836,0.976-1.846,1.541-2.941,1.452c-0.014-0.114-0.021-0.234-0.021-0.36  c0-0.913,0.396-1.889,1.103-2.688c0.352-0.404,0.8-0.741,1.343-1.009c0.542-0.264,1.054-0.41,1.536-0.435 C15.992,2.127,15.998,2.254,15.998,2.38L15.998,2.38z"
                              />
                              </svg>
                              <span className="sr-only">Continue with</span> Apple
                          </a>
                          </div>
                      </div>
                      </div>
                      <p className="mb-4 text-xs text-center text-gray-400">
                      <a href="#" className="text-green-200 underline hover:text-white">Create an account</a>
                      ·
                      <a href="#" className="text-green-200 underline hover:text-white">Forgot password</a>
                      ·
                      <a href="#" className="text-green-200 underline hover:text-white">Privacy & Terms</a>
                      </p> */}
                  </div>
              </section>
            </>
            
          ) 
          }
           {started_at && exam.question_type === 'SE' && (

            <SEExam />
          )}
          {/* <div className="w-full lg:w-1/3 ">
            <Profile />
          </div>
          <div className="w-full lg:w-2/3 ">
            <Exam />
            <Navbar />
          </div> */}
        </div>
      </div>
      <Footer />
    </main>
    {started_at && (
      // <span className="icofont-clock-time p-2"></span>
      <div className="flex flex-col max-w-lg min-h-screen relative min-w-screen my-0 mx-auto bg-gray-900 pb-10">
      <div className="custom-template">
      <div className="flex flex-col justify-center items-center custom-toggle px-3 py-2">
      <FaClock />
      <span id="timer" >
        23:50:00
        {/* {gmdate("h : i : s", strtotime(exam.end_at)- strtotime(exam.start_at))} */}
        {/* <?= ltrim(gmdate("i : s", $data['waktu']), 0) ?> */}
        </span></div>
      </div>
        
      </div>
      
    )}
</>
)

}
export default MCExam
