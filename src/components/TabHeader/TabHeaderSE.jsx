import { useEffect, useRef, useState } from "react"
import {tabHeaderHandlerActiveTab} from '../../utils/tabHeaderHandlerActiveTab'
import { useNavigate } from "react-router-dom"

function TabHeaderAdmission({styleClass, options, id}) {

    const [optionValues, setOptionValues] = useState([])
    const tabRef = useRef(null)
    const navigate = useNavigate()
    let defaultOptions = [
        {tab: 'Detail', selected: true },
        {tab: 'Jenjang', selected: false },
        {tab: 'Report', selected: false }
    ]

    useEffect(() => {
        // tabHeaderHandlerActiveTab()
        if(!options){
            setOptionValues(defaultOptions)
            // options = defaultOptions
        }else{setOptionValues(options)}
    }, [options])

    const handleActiveTab = (key, id) => {
        const newValue = {selected: false}
        // optionValues[key].selected = false
        // optionValues[key].selected = true
        // console.log
        // optionValues[key].selected = false
    //     setOptionValues((prev) => 
    //   prev.map((o) => 
    //     ({ ...o, ...newValue })  // Merge existing + new props
          
    //   )
    // );
        setOptionValues((prev,k) => 
      prev.map((o, t) => 
        t == key 
          ? { ...o, selected: true }  // Merge existing + new props
          : { ...o, selected: false}
      )
    );

    if(key==0)
        navigate('/ad/admissions/detail/'+id)
    if(key==1)
        navigate('/ad/admissions/'+id+ '/schools')
    if(key==2)
        navigate('/ad/admissions/'+id+ '/reports')
    // if(key==3)
    //     navigate('/ad/admissions/'+id+ '/presences')
    
        // const option = optionValues.find(opt => opt.id === key);
        // if(option){
        //     option.
        // }
        
        // setOptionValues()
        // setOptionValues((prev,k) => (k == key? prev.map(value => ({...value, selected: true})): prev.map(value => ({...value, selected: false})) ))
        // if(tabRef.current){
        //     tabRef.current.
        // }
    }
    
   return (
    <div className="py-10">
        <div className="container mx-auto">
           {/* <!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->
            <!--Code for navigation starts--> */}
            <dh-component>
            {/* <div className="sm:hidden relative w-11/12 mx-auto bg-white rounded"> */}
                {/* <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
                <svg xmźns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-selector" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="8 9 12 5 16 9" />
                    <polyline points="16 15 12 19 8 15" />
                </svg>
                </div> */}
                {/* <select aria-label="Selected tab" className="form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10"> */}
                    {/* {Object.keys(options).forEach(fu)} */}
                    <div className="xl:w-full xl:mx-0 h-12 hidden sm:block shadow rounded bg-white">
                <div className="flex border-b px-5">
                    {
                        optionValues? (
                            (optionValues).map((e, key) => (
                                <button ref={tabRef} onClick={() => handleActiveTab(key, id)} className="focus:outline-none focus:text-green-700 text-sm border-green-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-green-700 cursor-pointer">
                    <div className="flex items-center mb-3">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                    </svg> */}
                    <span className="ml-1 font-normal">{e.tab} </span>
                    </div>
                    <div className={`w-full h-1 bg-green-700 rounded-t-md ${e.selected != true? ' hidden': ''}`}></div>
                </button>
                            // return (
                                // {e.selected == true? (
                                //     // <option selected={true} className="text-sm text-gray-600">{e.tab}</option>
                                // ): (
                                //     // <option className="text-sm text-gray-600">{e.tab}</option>
                                // )}
                            // )
                            ))
                        ) : (
                            ""
                        )
                        }
            </div></div>
                {/* <option className="text-sm text-gray-600">inactive</option>
                <option className="text-sm text-gray-600">inactive</option>
                <option selected className="text-sm text-gray-600">Active</option>
                <option className="text-sm text-gray-600">inactive</option>
                <option className="text-sm text-gray-600">inactive</option> */}
                {/* </select> */}
            {/* </div> */}
            
            </dh-component>
            {/* <!--Code for navigation ends--> */}
        </div>

        </div>
   )

}

export default TabHeaderAdmission