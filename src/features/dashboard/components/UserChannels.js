import { useEffect, useState } from "react"
import TitleCard from "../../../components/Cards/TitleCard"
import { Import } from "lucide-react"
import supabase from "../../../services/database-server"
// import supabase from "@/landing/services/database/database"

const userSourceData = [
    {source : "TKIT", count : "26,345", conversionPercent : 10.2},
    {source : "SD", count : "26,345", conversionPercent : 10.2},
    {source : "Google Ads", count : "21,341", conversionPercent : 11.7},
    {source : "Instagram Ads", count : "34,379", conversionPercent : 12.4},
    {source : "Affiliates", count : "12,359", conversionPercent : 20.9},
    {source : "Organic", count : "10,345", conversionPercent : 10.3},
]

function UserChannels(){

    const [capaianData, setCapaianData] = useState({})

    useEffect(()=>{

    }, [])
    const getCapaianData = async () => {
        const { data: capaian, error } = await supabase
                .rpc('get_capaian_data');
        // let {data: applicants, error} = await supabase
        //         .from('applicants')
        //         .select(' *, applicant_orders(*), applicant_schools(*) ')
        //         .eq('applicant_orders.status', 'finished')
        //         // .eq('applicant_schools.school', 'finished')
        //         .eq('status', 'active')
        //         .is('deleted_at', null)
                // .eq('month(applicant_orders.updated_at)', )

                if(capaian){
                    console.log('capaian', capaian)
                    setCapaianData(capaian.map((value) => {
                        return {
                            school: value.school_name,
                            count: value.count,
                            persentage: value.persentage
                        }
                    }))
                }
    }
    return(
        <TitleCard title={"Persentase Capaian 26/27"}>
             {/** Table Data */}
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th></th>
                        <th className="normal-case">Jenjang</th>
                        <th className="normal-case">Target</th>
                        <th className="normal-case">Capaian</th>
                        <th className="normal-case">%</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            // capaianData?.map((u, k) => {
                            //     return(
                            //         <tr key={k}>
                            //             <th>{k+1}</th>
                            //             <td>{u.school}</td>
                            //             <td>{u.count}</td>
                            //             <td>{`${u.persentage}%`}</td>
                            //         </tr>
                            //     )
                            // })
                        }
                    </tbody>
                </table>
            </div>
        </TitleCard>
    )
}

export default UserChannels