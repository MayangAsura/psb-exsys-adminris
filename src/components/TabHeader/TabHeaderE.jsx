import { useEffect, useState } from "react"
import {tabHeaderHandlerActiveTab} from '../../utils/tabHeaderHandlerActiveTab'

function TabHeaderE({styleClass, options}) {

    const [optionValues, setOptionValues] = useState([])
    const defaultOptions = [
        {tab: 'Detail', selected: true },
        {tab: 'Peserta', selected: false },
        {tab: 'Response', selected: false }
    ]
    useEffect(() => {
        // tabHeaderHandlerActiveTab()
        if(!options){
            setOptionValues(defaultOptions)
            // options = defaultOptions
        }
    }, [options])
    
   return (
    <div className="py-10">
        <div className="container mx-auto">
           {/* <!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->
            <!--Code for navigation starts--> */}
            <dh-component>
            <div className="sm:hidden relative w-11/12 mx-auto bg-white rounded">
                <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-selector" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <polyline points="8 9 12 5 16 9" />
                    <polyline points="16 15 12 19 8 15" />
                </svg>
                </div>
                <select aria-label="Selected tab" className="form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10">
                    {/* {Object.keys(options).forEach(fu)} */}
                    {/* {
                        optionValues? (
                            Object.keys(optionValues).forEach((key, e) => {
                            // return (
                                {optionValues['selected'] == true? (
                                    <option selected className="text-sm text-gray-600">{e.tab}</option>
                                ): (
                                    <option className="text-sm text-gray-600">{e.tab}</option>
                                )}
                            // )
                         })
                        ) : (
                            ""
                        )
                        } */}

                {/* <option className="text-sm text-gray-600">inactive</option>
                <option className="text-sm text-gray-600">inactive</option>
                <option selected className="text-sm text-gray-600">Active</option>
                <option className="text-sm text-gray-600">inactive</option>
                <option className="text-sm text-gray-600">inactive</option> */}
                </select>
            </div>
            <div className="xl:w-full xl:mx-0 h-12 hidden sm:block shadow rounded">
                <div className="flex border-b px-5">
                <button onclick="tabHeaderHandlerActiveTab(this)" className="focus:outline-none focus:text-green-700 text-sm border-green-700 pt-3 rounded-t text-green-700 mr-12 cursor-pointer">
                    <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-home" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="5 12 3 12 12 3 21 12 19 12" />
                        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                    </svg>
                    <span className="ml-1 font-normal">Detail</span>
                    </div>
                    <div className="w-full h-1 bg-green-700 rounded-t-md"></div>
                </button>
                <button onclick="tabHeaderHandlerActiveTab(this)" className="focus:outline-none focus:text-green-700 text-sm border-green-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-green-700 cursor-pointer">
                    <div className="flex items-center mb-3">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                    </svg> */}
                    <span className="ml-1 font-normal">Ujian</span>
                    </div>
                    <div className="w-full h-1 bg-green-700 rounded-t-md hidden"></div>
                </button>
                <button onclick="tabHeaderHandlerActiveTab(this)" className="focus:outline-none focus:text-green-700 text-sm border-green-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-green-700 cursor-pointer">
                    <div className="flex items-center mb-3">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                    </svg> */}
                    <span className="ml-1 font-normal">Peserta</span>
                    </div>
                    <div className="w-full h-1 bg-green-700 rounded-t-md hidden"></div>
                </button>
                {/* <button onclick="tabHeaderHandlerActiveTab(this)" className="focus:outline-none focus:text-green-700 text-sm border-green-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-green-700 cursor-pointer">
                    <div className="flex items-center mb-3">
                        <TbUsersGroup></TbUsersGroup>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                    </svg>
                    <span className="ml-1 font-normal">Kehadiran</span>
                    </div>
                    <div className="w-full h-1 bg-green-700 rounded-t-md hidden"></div>
                </button> */}
                </div>
            </div>
            </dh-component>
            {/* <!--Code for navigation ends--> */}
        </div>

        </div>
   )

}

export default TabHeaderE