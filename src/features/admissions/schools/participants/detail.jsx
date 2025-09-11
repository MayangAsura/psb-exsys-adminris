import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../common/headerSlice';
import TitleCard from '../../../../components/Cards/TitleCard';
import supabase from "../../../../services/database-server";
import TabHeaderSP from '../../../../components/TabHeader/TabHeaderSP';
import { useParams } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

function InternalPage() {
    const dispatch = useDispatch();
    const [test, setTest] = useState({});
    const [payment, setPayment] = useState({});
    const [loading, setLoading] = useState(true);
    const id = useParams().academic_year_id;
    const sch_id = useParams().school_id;
    const pid = useParams().pid;
    
    const options = [
        { tab: 'Detail', selected: true },
        { tab: 'Pendaftar', selected: false },
        { tab: 'Peserta', selected: false },
        { tab: 'Report', selected: false }
    ];

    useEffect(() => {
        dispatch(setPageTitle({ title: "Detail" }));
        getTestData(id, sch_id, pid);
        getPaymentData(id, sch_id, pid);
    }, [id, sch_id, pid]);
    
    const getTestData = async (id, sch_id, pid) => {
        try {
            let { data: admissions, error } = await supabase
                .from('participants')
                .select('*, applicants!inner(*, applicant_schools!inner(*)), participant_documents(*), participant_father_data(*), participant_mother_data(*), participant_wali_data(*)')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .eq('applicants.applicant_schools.school_id', sch_id)
                .eq('id', pid)
                .is('deleted_at', null);

            if (!error && admissions && admissions.length > 0) {
                setTest(admissions[0]);
            }
        } catch (error) {
            console.error('Error fetching test data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPaymentData = async (id, sch_id, pid) => {
        try {
            let { data: admissions, error } = await supabase
                .from('applicant_orders')
                .select('*, applicant_payments(*), applicants!inner(*, applicant_schools!inner(*))')
                .eq('applicants.applicant_schools.admission_ays_id', id)
                .eq('applicants.applicant_schools.school_id', sch_id)
                .eq('id', pid)
                .is('deleted_at', null);

            if (!error && admissions && admissions.length > 0) {
                setPayment(admissions[0]);
            }
        } catch (error) {
            console.error('Error fetching payment data:', error);
        }
    };

    const formatDateNew = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    };

    const formatRupiah = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status, type) => {
        let bgColor = 'bg-gray-100';
        let textColor = 'text-gray-800';
        
        if (type === 'selection') {
            if (status === 'accepted') {
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else if (status === 'initial_submission') {
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
            } else {
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
            }
        } else if (type === 'payment') {
            if (status) {
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else {
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
            }
        }
        
        return `${bgColor} ${textColor}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <TabHeaderSP id={id} sch_id={sch_id} options={options} activeKey='Detail' />
            
            <div className="container mx-auto px-4 pt-6">
                {/* Informasi Detail Card */}
                <TitleCard title="Informasi Detail" topMargin="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                            <p className="font-medium text-gray-900">{test.applicants?.full_name || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                            <p className="font-medium text-gray-900">
                                {test.applicants?.gender === 'male' ? 'Laki-Laki' : 
                                 test.applicants?.gender === 'female' ? 'Perempuan' : '-'}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <p className="font-medium text-gray-900">{test.applicants?.email || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">No. WhatsApp</label>
                            <p className="font-medium text-gray-900">{test.applicants?.phone_number || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Terakhir Aktif</label>
                            <p className="font-medium text-gray-900">{formatDateNew(test.applicants?.updated_at)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Status Akun</label>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.applicants?.status, 'payment')}`}>
                                {test.applicants?.status || '-'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Pendaftaran</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Status Seleksi</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.submission_status, 'selection')}`}>
                                    {test.submission_status === 'accepted' ? 'Lulus' : 
                                     test.submission_status === 'initial_submission' ? 'Pendaftaran' : 
                                     'Tidak Lulus'}
                                </span>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Status Pembayaran</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.is_settlement, 'payment')}`}>
                                    {test.is_settlement ? 'Sudah Bayar' : 'Belum Bayar'}
                                </span>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Status Pengisian Formulir</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.is_draft, 'payment')}`}>
                                    {test.is_draft ? 'Lengkap' : 'Belum Lengkap'}
                                </span>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Status Pengukuran Seragam</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.is_uniform_sizing, 'payment')}`}>
                                    {test.is_uniform_sizing ? 'Selesai' : 'Belum Lengkap'}
                                </span>
                            </div>
                        </div>
                    </div>
                </TitleCard>

                {/* Informasi Pembayaran Card */}
                <TitleCard title="Informasi Pembayaran" topMargin="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">No. Formulir Pendaftaran</label>
                            <p className="font-medium text-gray-900">{payment?.payment_orders?.invoice_number || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Status Pembayaran</label>
                            <p className="font-medium text-gray-900">{payment?.status || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Invoice</label>
                            <p className="font-medium text-gray-900">{formatDateNew(payment?.created_at)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Tenggat</label>
                            <p className="font-medium text-gray-900">{formatDateNew(payment?.payment_method?.expired_at)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nominal Item</label>
                            <p className="font-medium text-gray-900">{formatRupiah(payment?.payment_orders?.total_amount)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Biaya Admin</label>
                            <p className="font-medium text-gray-900">
                                {formatRupiah((parseInt(payment?.amount || 0) - parseInt(payment?.payment_orders?.total_amount || 0)))}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Total Bayar</label>
                            <p className="font-medium text-gray-900">{formatRupiah(payment?.amount)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Metode Pembayaran</label>
                            <p className="font-medium text-gray-900">
                                {payment?.payment_method?.type === 'jalur_khusus' ? 'Jalur Khusus' : 
                                 payment?.payment_method?.type === 'gel_1' ? 'Gelombang 1' : 
                                 payment?.payment_method?.type || '-'}
                            </p>
                        </div>
                    </div>
                </TitleCard>

                {/* Data Peserta Card */}
                <TitleCard title="Data Peserta" topMargin="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tempat, Tanggal Lahir</label>
                            <p className="font-medium text-gray-900">
                                {test.pob ? `${test.pob}, ${formatDateNew(test.dob)}` : formatDateNew(test.dob)}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">NISN</label>
                            <p className="font-medium text-gray-900">{test.nisn || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">No. KK</label>
                            <p className="font-medium text-gray-900">{test.kk_number || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">NIK</label>
                            <p className="font-medium text-gray-900">{test.nik || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Alamat Sekolah Sebelumnya</label>
                            <p className="font-medium text-gray-900">{test.prev_school_address || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Riwayat Penyakit</label>
                            <p className="font-medium text-gray-900">{test.medical_history === 'none' ? 'Tidak Ada' : 'Ada'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                            <p className="font-medium text-gray-900">{test.home_address || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Status Anak</label>
                            <p className="font-medium text-gray-900">
                                {test.child_status === 'anak_kandung' ? 'Anak Kandung' :
                                 test.child_status === 'anak_angkat' ? 'Anak Angkat' :
                                 test.child_status === 'anak_asuh' ? 'Anak Asuh' :
                                 test.child_status === 'lainnya' ? 'Lainnya' : '-'}
                            </p>
                        </div>
                    </div>
                </TitleCard>

                {/* Data Ayah Card */}
                <TitleCard title="Data Ayah" topMargin="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Ayah</label>
                            <p className="font-medium text-gray-900">{test.participant_father_data?.[0]?.father_name || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pendidikan Terakhir</label>
                            <p className="font-medium text-gray-900">{test.participant_father_data?.[0]?.father_academic || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pekerjaan</label>
                            <p className="font-medium text-gray-900">{test.participant_father_data?.[0]?.father_job || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Penghasilan</label>
                            <p className="font-medium text-gray-900">
                                {test.participant_father_data?.[0]?.father_salary === 'less_than_1jt' ? 'Kurang dari Rp1 Jt' :
                                 test.participant_father_data?.[0]?.father_salary === 'less_than_2jt' ? 'Kurang dari Rp2 Jt' :
                                 test.participant_father_data?.[0]?.father_salary === '5jt_-_10jt' ? 'Rp5 Jt - Rp10 Jt' :
                                 test.participant_father_data?.[0]?.father_salary === '10jt_-_15jt' ? 'Rp10 Jt - Rp15 Jt' :
                                 test.participant_father_data?.[0]?.father_salary === '15jt_-_20jt' ? 'Rp15 Jt - Rp20 Jt' :
                                 test.participant_father_data?.[0]?.father_salary === 'more_than_20jt' ? 'Lebih dari Rp20 Jt' : '-'}
                            </p>
                        </div>
                    </div>
                </TitleCard>

                {/* Data Ibu Card */}
                <TitleCard title="Data Ibu" topMargin="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Ibu</label>
                            <p className="font-medium text-gray-900">{test.participant_mother_data?.[0]?.mother_name || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pendidikan Terakhir</label>
                            <p className="font-medium text-gray-900">{test.participant_mother_data?.[0]?.mother_academic || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pekerjaan</label>
                            <p className="font-medium text-gray-900">{test.participant_mother_data?.[0]?.mother_job || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Penghasilan</label>
                            <p className="font-medium text-gray-900">
                                {test.participant_mother_data?.[0]?.mother_salary === 'less_than_1jt' ? 'Kurang dari Rp1 Jt' :
                                 test.participant_mother_data?.[0]?.mother_salary === 'less_than_2jt' ? 'Kurang dari Rp2 Jt' :
                                 test.participant_mother_data?.[0]?.mother_salary === '5jt_-_10jt' ? 'Rp5 Jt - Rp10 Jt' :
                                 test.participant_mother_data?.[0]?.mother_salary === '10jt_-_15jt' ? 'Rp10 Jt - Rp15 Jt' :
                                 test.participant_mother_data?.[0]?.mother_salary === '15jt_-_20jt' ? 'Rp15 Jt - Rp20 Jt' :
                                 test.participant_mother_data?.[0]?.mother_salary === 'more_than_20jt' ? 'Lebih dari Rp20 Jt' : '-'}
                            </p>
                        </div>
                    </div>
                </TitleCard>

                {/* Data Wali Card */}
                <TitleCard title="Data Wali" topMargin="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Wali</label>
                            <p className="font-medium text-gray-900">{test.participant_wali_data?.[0]?.wali_name || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pendidikan Terakhir</label>
                            <p className="font-medium text-gray-900">{test.participant_wali_data?.[0]?.wali_academic || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Pekerjaan</label>
                            <p className="font-medium text-gray-900">{test.participant_wali_data?.[0]?.wali_job || '-'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Penghasilan</label>
                            <p className="font-medium text-gray-900">
                                {test.participant_wali_data?.[0]?.wali_salary === 'less_than_1jt' ? 'Kurang dari Rp1 Jt' :
                                 test.participant_wali_data?.[0]?.wali_salary === 'less_than_2jt' ? 'Kurang dari Rp2 Jt' :
                                 test.participant_wali_data?.[0]?.wali_salary === '5jt_-_10jt' ? 'Rp5 Jt - Rp10 Jt' :
                                 test.participant_wali_data?.[0]?.wali_salary === '10jt_-_15jt' ? 'Rp10 Jt - Rp15 Jt' :
                                 test.participant_wali_data?.[0]?.wali_salary === '15jt_-_20jt' ? 'Rp15 Jt - Rp20 Jt' :
                                 test.participant_wali_data?.[0]?.wali_salary === 'more_than_20jt' ? 'Lebih dari Rp20 Jt' : '-'}
                            </p>
                        </div>
                    </div>
                </TitleCard>

                {/* Data Berkas Card */}
                <TitleCard title="Data Berkas" topMargin="mt-6">
                    {test.participant_documents?.length === 0 ? (
                        <p className="text-gray-500">Tidak ada berkas yang diunggah</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berkas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {test.participant_documents?.map((document, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.file_title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {document.file_url && (
                                                    <button 
                                                        onClick={() => window.open(document.file_url, '_blank')}
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        Buka <FiExternalLink className="ml-1" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TitleCard>
            </div>
        </div>
    );
}

export default InternalPage;
// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { setPageTitle } from '../../../common/headerSlice'
// import TitleCard from '../../../../components/Cards/TitleCard'
// import supabase from "../../../../services/database-server"
// import { tabHeaderHandlerActiveTab } from '../../../../utils/tabHeaderHandlerActiveTab'

// import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'
// import {FiExternalLink} from 'react-icons/fi'

// import TabHeaderSP from '../../../../components/TabHeader/TabHeaderSP'
// import { useParams } from 'react-router-dom'

// function InternalPage(){

//     const dispatch = useDispatch()
//     const [test, setTest] = useState({})
//     const [payment, setPayment] = useState({})
//     const id = useParams().admission_ays_id
//     const sch_id = useParams().school_id
//     const pid = useParams().pid
//     const options = [
//         {tab: 'Detail', selected: true },
//         {tab: 'Pendaftar', selected: false },
//         {tab: 'Peserta', selected: false },
//         {tab: 'Report', selected: false }
//     ]
    
//     useEffect(() => {
//         dispatch(setPageTitle({ title : "Detail"}))
//         getTestData(id, sch_id, pid)
//         getPaymentData(id, sch_id, pid)
//         console.log('test', test)
//       }, [id, sch_id, pid])
      
//     const getTestData = async (id, sch_id, pid) => {
//         let { data: admissions, error } = await supabase
//             .from('participants')
//             .select('*, applicants!inner(*, applicant_schools!inner(*)), participant_documents(*), participant_father_data[0]?(*), participant_mother_data[0]?(*), participant_wali_data[0]?(*) ')
//             .eq('applicants.applicant_schools.admission_ays_id', id)
//             .eq('applicants.applicant_schools.school_id', sch_id)
//             .eq('id', pid)
//             .is('deleted_at', null)
// // 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9'
// console.log('admissions', admissions)
//         if(!error){
//         setTest(admissions[0])
//         }
//     }
//     const getPaymentData = async (id, sch_id, pid) => {
//         let { data: admissions, error } = await supabase
//             .from('applicant_orders')
//             .select('*, applicant_payments(*), applicants!inner(*, applicant_schools!inner(*))')
//             .eq('applicants.applicant_schools.admission_ays_id', id)
//             .eq('applicants.applicant_schools.school_id', sch_id)
//             .eq('id', pid)
//             .is('deleted_at', null)
// // 'd17ff676-85d2-4f9e-88f1-0fdfb37517b9'
// console.log('admissions', admissions)
//         if(!error){
//         setPayment(admissions[0])
//         }
//     }

//     const formatDateNew = (date) => {
//     const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//     const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

//     date = new Date(date);
//     const dayName = dayNames[date.getDay()];
//     const day = date.getDate();
//     const month = date.getMonth();
//     const monthName = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     const hour = date.getHours();
//     const minute = date.getMinutes();
//     const second = date.getSeconds();

//     const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
//     // const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
//     return dateFormat
//   }

//   const getSalaryText = (salary) => {
//     let text = ''
//     if(salary=='less_than_1jt') text = 'Kurang dari Rp1 Jt'
//     if(salary=='less_than_2jt') text = 'Kurang dari Rp2 Jt'
//     if(salary=='5jt_-_10jt') text = 'Rp5 Jt - Rp10 Jt'
//     if(salary=='10jt_-_15jt') text = 'Rp10 Jt - Rp15 Jt'
//     if(salary=='15jt_-_20jt') text = 'Rp15 Jt - Rp20 Jt'
//     if(salary=='more_than_20jt') text = 'Lebih dari Rp20 Jt'
//     return text
      
//   }

  
// //   function formatRupiah(subject) {
// //       const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
// //       return `Rp${rupiah}`;
// //     }

//     const formatRupiah = (angka, prefix=null) => {
//       // function formatRupiah(angka, prefix){
//         var number_string = angka.toString().replace(/[^,\d]/g, '').toString()
//         let split   		= number_string.split(',')
//         let sisa     		= split[0].length % 3
//         let rupiah     		= split[0].substr(0, sisa)
//         let ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
   
//         // tambahkan titik jika yang di input sudah menjadi angka ribuan
//         if(ribuan){
//           const separator = sisa ? '.' : '';
//           rupiah += separator + ribuan.join('.');
//         }
   
//         rupiah = split[1] != null ? rupiah + ',' + split[1] : rupiah;
//         return prefix == null ? rupiah : (rupiah ? 'Rp.' + rupiah : '');
//       // }
//     }
//     const convertToUpper = (string) => {
//         return string?.toUpperCase()
//     }
//     const getChildStatusText = (value) => {
//         if(value=== 'anak_kandung'){
//             return 'Anak Kandung'
//         }
//         if(value=== 'anak_angkat'){
//             return 'Anak Kandung'
//         }
//         if(value=== 'anak_asuh'){
//             return 'Anak Asuh'
//         }
//         if(value=== 'lainnya'){
//             return 'Lainnya'
//         }
//     }
//     const getDistanceText = (value) => {
//         if(value=== 'less_than_1km'){
//             return 'Kurang dari 1 KM '
//         }
//         if(value=== '1_-_5km'){
//             return '1 - 5 KM'
//         }
//         if(value=== 'more_than_5km'){
//             return 'Lebih dari 5 KM'
//         }
//         if(value=== 'other'){
//             return 'Lainnya'
//         }
//     }


//     const getMetodeUangPangkalText = (value)=> {
//         if(value==='jalur_khusus'){
//             return 'Jalur Khusus'
//         }
//         if(value==='gel_1'){
//             return 'Gelombang 1'
//         }
//     }
//     const getPaymentMethodText = (value)=> {
//         if(value==='jalur_khusus'){
//             return 'Jalur Khusus'
//         }
//         if(value==='gel_1'){
//             return 'Gelombang 1'
//         }
//     }
//     return(
//         <div className="bg-base-200">
//             <TabHeaderSP id={id} sch_id={sch_id} options={options} activeKey='Detail' />
//             <TitleCard title="Informasi Detail" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                             {/* <div>
//                                 <div className="h-auto overflow-hidden relative"><div style="max-height: 400px;" className="overflow-hidden text-ellipsis leading-[22px] font-normal text-[14px]"><p className="tiptap-paragraph">..</p></div></div>
//                             </div> */}
//                                 {/* <div className="css-4o3x93">
//                                     <p className=" css-zuhd6s">Nama</p>
//                                 </div>
//                                 <div className="flex flex-wrap gap-1 -mt-2">{test.title} </div>  */}
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Nama Lengkap</p>
//                                         </div>
//                                     <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.applicants?.full_name??'-'} </p></div>
//                                     </div>
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Jenis Kelamin</p>
//                                         </div><div className="css-4o3x93">
//                                         <p className="w-fit h-fit font-semibold">{test.applicants?.gender==='male'?'Laki-Laki':'Perempuan'} </p></div>
//                                     </div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Email</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.applicants?.email??'-'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">No. WhatsAppp</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.applicants?.phone_number} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Terakhir Aktif</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.applicants?.updated_at?formatDateNew(test.applicants?.updated_at):'-'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{convertToUpper(test.applicants?.status)} </p></div></div></div>
//                                 </div>
//                                 <hr />
//                                 <p>Status</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.submission_status==='accepted'?'Lulus':l.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td> */}
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Status Seleksi</p>
//                                         </div>
//                                     <div className="css-4o3x93"><p className={`font-semibold css-1bq9ewv rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{test.submission_status==='accepted'?'Lulus':test.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</p></div>
//                                     </div>
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Status Pembayaran</p>
//                                         </div><div className="css-4o3x93">
//                                         <p className={` font-semibold rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</p></div>
//                                     </div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.submission_status==true? 'bg-green-400': 'bg-red-400'}`}>{l.submission_status==='accepted'?'Lulus':l.submission_status==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td> */}
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Status Pengisian Formulir</p>
//                                         </div>
//                                     <div className="css-4o3x93"><p className={`font-semibold css-1bq9ewv rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_draft==='accepted'?'Lulus':test.is_draft==='initial_submission'?'Pendaftaran/Pemberkasan':'Tidak Lulus'}</p></div>
//                                     </div>
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Status Pengukuran Seragam</p>
//                                         </div><div className="css-4o3x93">
//                                         <p className={` font-semibold rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${test.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{test.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</p></div>
//                                     </div>
//                                 </div>
//                                 {/* <p>Data Peserta</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Tempat Lahir, Tanggal Lahir</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.pob??'-'}, ${test.dob?formatDateNew(test.dob):'-'}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NISN</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nisn} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">No. KK</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.kk_number} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nik} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Alamat Sekolah Sebelumnya</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.prev_school_address} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nik} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Riwayat Penyakit</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.medical_history==='none'?'Tidak Ada':'Ada'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Alamat</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.home_address} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Status Anak</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{getChildStatusText(test.child_status)} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Tinggal Bersama</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.live_with=='parent'?'Orangtua':test.live_with=='guardian'?'Wali':test.live_with=='kos'?'Kos':'Asrama'} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nomor WhatsApp Orangtua</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.parent_phone_number} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Jarak Tempat Tinggal</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getDistanceText(test.distance)} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kategori Siswa</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.student_category==='has_family'? '(Keluarga Rabbaanii) Memiliki saudara kandung sekolah di Rabbaanii' :test.student_category==='alumni'? '(Keluarga Rabbaanii) Alumni Rabbaanii': 'Non Keluarga Rabbaanii'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Metode Uang Pangkal</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getMetodeUangPangkalText(test.metode_uang_pangkal)} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kewarganegaraan</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{convertToUpper(test.nationality)} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.postal_code} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kabupaten</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{convertToUpper(test.region)} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.postal_code} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Cita-Cita</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.aspiration} </p></div></div> */}
                                
//                                 {/* <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.postal_code} </p></div></div></div> */}
//                                 {/* </div> */}
//                                     {/* <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Biaya Masuk</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{formatRupiah(test.admission_fee??"")} </p></div></div> */}
                                 
//                                 {/* <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 "><div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93"><p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{convertToUpper(test.admission_status)} </p></div></div></div> */}
//                                 {/* </div> */}
//                                 {/* <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Tipe</p>
//                                         </div>
//                                     <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.test_type} </p></div>
//                                     </div>
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Lokasi</p>
//                                         </div><div className="css-4o3x93">
//                                         <p className="px-3 py-2 w-fit h-fit text-white !text-[12px] rounded-[4px] font-semibold leading-none bg-successed-500 css-zuhd6s">{test_room} </p></div>
//                                     </div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0">
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Lokasi</p>
//                                         </div>
//                                     <div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">{test.location} </p></div>
//                                     </div>
//                                     <div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93">
//                                         <p className=" css-zuhd6s">Ruangan</p>
//                                         </div><div className="css-4o3x93">
//                                         <p className="w-fit h-fit font-semibold">{test.room} </p></div>
//                                     </div>
//                                 </div> */}
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Informasi Pembayaran</p>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     {/* <div className="flex flex-1 gap-y-2 w-full"> */}
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">No. Formulir Pendaftaran</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.payment_orders?.invoice_number??'-'}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Status Pembayaran</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.status??'-'}}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Tanggal Invoice</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.payment_orders?.invoice_number??'-'}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Tanggal Tenggat</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.payment_method?.expired_at?formatDateNew(payment?.payment_method?.expired_at):'-'}}`} </p></div>
//                                 </div>
//                                 <hr />
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Nominal Item</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.payment_orders?.total_amount??'-'}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Biaya Admin</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${(parseInt(payment?.amount??0) - parseInt(payment?.payment_orders?.total_amount??0))}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Diskon</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.status??'-'}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Total Bayar</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.amount??'-'}`} </p></div>
//                                 </div>
//                                 <div className="w-full flex flex-row md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                         <div className="css-4o3x93 flex flex-1"><p className="w-full css-zuhd6s">Metode Pembayaran</p></div>
//                                 <div className="css-4o3x93 flex flex-wrap"><p className="font-semibold">{`${payment?.payment_method?getPaymentMethodText(payment?.payment_method):'-'}`} </p></div>
//                                 </div>
//                                 {/* </div> */}
                                
//                                 {/* <div className="w-full flex flex-1 mb-2"><div className="flex flex-col gap-y-2 "> */}
//                                     {/* <div className="css-4o3x93"><p className=" css-zuhd6s">Tanggal Bayar</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{formatDateNew(payment?.settlement_at)} </p></div></div> */}
//                                         {/* </div> */}
//                                 {/* </div> */}
//                                 {/* <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64"> */}
//                                     {/* <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Pekerjaan Ayah</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.father_job} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Penghasilan Ayah</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.father_salary} </p></div></div></div> */}
//                                 {/* </div> */}
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Data Peserta</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Tempat Lahir, Tanggal Lahir</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.pob??'-'}, ${test.dob?formatDateNew(test.dob):'-'}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NISN</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nisn} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">No. KK</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.kk_number??'-'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nik??'-'} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Alamat Sekolah Sebelumnya</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.prev_school_address} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">NIK</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.nik} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Riwayat Penyakit</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.medical_history==='none'?'Tidak Ada':'Ada'} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Alamat</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.home_address} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Status Anak</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{getChildStatusText(test.child_status)} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Tinggal Bersama</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.live_with=='parent'?'Orangtua':test.live_with=='guardian'?'Wali':test.live_with=='kos'?'Kos':'Asrama'} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nomor WhatsApp Orangtua</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.parent_phone_number} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Jarak Tempat Tinggal</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getDistanceText(test.distance)} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kategori Siswa</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.student_category} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Metode Uang Pangkal</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.metode_uang_pangkal} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Kabupaten</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.region} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.postal_code} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Cita-Cita</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.aspiration} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Provinsi</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.postal_code} </p></div></div></div>
//                                 </div>
//                                 </div>
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Data Ayah</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nama Ayah</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.participant_father_data[0]?.father_name}}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Pendidikan Terakhir Ayah</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{(test.participant_father_data[0]?.father_academic)?.toUpperCase( )} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Pekerjaan Ayah</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.participant_father_data[0]?.father_job} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Penghasilan Ayah</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participant_father_data[0]?.father_salary} </p></div></div></div>
//                                 </div>
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Data Ibu</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nama Ibu</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.participant_mother_data?.mother_name}}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Pendidikan Terakhir Ibu</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participant_mother_data?.mother_academic} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Pekerjaan Ibu</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.participant_mother_data?.mother_job} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Penghasilan Ibu</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getSalaryText(test.participant_mother_data?.mother_salary)} </p></div></div></div>
//                                 </div>
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Data Wali</p>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Nama Wali</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.participant_wali_data[0]?.wali_name}}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Pendidikan Terakhir Wali</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.participant_wali_data[0]?.wali_academic} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Pekerjaan Wali</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.participant_wali_data[0]?.wali_job} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Penghasilan Wali</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{getSalaryText(test.participant_wali_data[0]?.wali_salary)} </p></div></div></div>
//                                 </div>
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
//             <TitleCard title="" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full ">
//                     <div className='flex flex-col justify-between items-start'>
//                          {/* <p className='flex '>Informasi Detail</p> */}
//                         <div className="flex flex-col gap-y-4">
//                             {/* <h5 className="text-3xl font-semibold mb-8 css-3rz2wn">
//                             {test.full_name}</h5> */}
//                                 <p className='font-semibold text-2xl'>Data Berkas</p>

//                                 <table className="table-auto">
//                                 <thead>
//                                     <tr>
//                                     <th>No.</th>
//                                     <th>Berkas</th>
//                                     <th></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {test.participant_documents?.length===0 && (
//                                         'Data tidak ada'
//                                     )}

//                                     {test.participant_documents?.length>0 && test.participant_documents.map((document) => {

//                                         <tr>
//                                         <td></td>
//                                         <td>{document.file_title}</td>
//                                         <td>
//                                             {(document.file_url) && ( 
//                                                 <div className="sm:col-span-4 mt-2 mb-0">
//                                                     <img src={document?.file_url} alt="" width={250} className='w-full'/>
//                                                     <span className='text-green-600 cursor-pointer flex gap- items-center' onClick={() => window.open(document?.file_url)}> Buka <FiExternalLink></FiExternalLink> </span>
//                                                 </div>

//                                             )}
//                                         </td>
//                                         </tr>
//                                     })}
//                                     {/* <tr>
//                                     <td>Witchy Woman</td>
//                                     <td>The Eagles</td>
//                                     <td>1972</td>
//                                     </tr>
//                                     <tr>
//                                     <td>Shining Star</td>
//                                     <td>Earth, Wind, and Fire</td>
//                                     <td>1975</td>
//                                     </tr> */}
//                                 </tbody>
//                                 </table>

//                                 {/* <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Akta Kelahiran</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{`${test.participant_documents.fi}}`} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Pendidikan Terakhir Wali</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.wali_academic} </p></div></div></div>
//                                 </div>
//                                 <div className="w-full flex flex-col md:flex-row gap-y-52 gap-x-52 md:gap-y-64">
//                                     <div className="flex flex-col gap-y-2 w-full">
//                                         <div className="css-4o3x93"><p className="w-full css-zuhd6s">Pekerjaan Wali</p></div>
//                                 <div className="css-4o3x93"><p className="font-semibold">{test.father_job} </p></div></div>
                                
//                                 <div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 ">
//                                     <div className="css-4o3x93"><p className=" css-zuhd6s">Penghasilan Wali</p></div><div className="css-4o3x93">
//                                         <p className="font-semibold badge-primary bg-orange-400 text-gray-700 rounded-2xl py-3 px-5 css-1pj8jfk">{test.wali_salary} </p></div></div></div>
//                                 </div> */}
                                    
//                             </div>
//                     </div>
                    
//                 </div>

//             </TitleCard>
        
            
//             {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
//                 <div className="flex gap-x-4 items-center mb-4 md:mb-0"><div className="css-4o3x93"><p className="text-[#262626] font-semibold css-1e1ey9f">Informasi Umum</p></div></div><div className="relative bg-neutral-50 cursor-pointer p-[5px] rounded-md"><div><button type="button" className="flex h-11 w-11 bg-[#EFEFEF] hover:bg-gray-200 justify-center items-center rounded-lg"><img src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.16667%2011.6667C5.08714%2011.6667%205.83333%2010.9205%205.83333%2010C5.83333%209.07954%205.08714%208.33334%204.16667%208.33334C3.24619%208.33334%202.5%209.07954%202.5%2010'%20stroke='%23515151'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3ccircle%20cx='10'%20cy='10'%20r='1.66667'%20stroke='%231C274C'%20stroke-width='1.25'/%3e%3cpath%20d='M17.5%2010C17.5%2010.9205%2016.7538%2011.6667%2015.8333%2011.6667C14.9128%2011.6667%2014.1666%2010.9205%2014.1666%2010C14.1666%209.07954%2014.9128%208.33334%2015.8333%208.33334'%20stroke='%231C274C'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3c/svg%3e" alt="menu" style="width: 20px; height: 20px;"></button><div className="absolute w-[100px] z-[999] transition-transform duration-300 ease-out scale-0 opacity-0 origin-top" style="top: 60px; right: 0px;" data-cy="action"><div className="bg-white flex flex-col justify-center cursor-pointer shadow-md rounded-md"><div><div className="p-[10px] cursor-pointer transition-colors duration-300 hover:bg-[#9957EC] hover:text-white rounded-t-md" role="button" data-cy="ecourse-button-edit">Edit</div><hr className="mx-1"></div><div><div className="p-[10px] cursor-pointer transition-colors duration-300 hover:bg-[#9957EC] hover:text-white rounded-b-md" role="button" data-cy="ecourse-button-hapus">Hapus</div><hr className="mx-1"></div></div></div></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4"><div><img className="w-full aspect-video object-cover !rounded-[15px] !h-auto" style="border-radius: 4px; height: 100%; width: 100%;" src="https://sgp1.digitaloceanspaces.com/learnhub-storage/component/thumbnail/thumbnail2.jpg" alt="Error"></div>
//                 <div className="flex flex-col gap-y-4"><h5 className="font-semibold text-[#262626] css-3rz2wn">Gets start with Javascript: Learn Javascript Programming from Scratch, Master Fundamental of Javascript with Practices</h5><div><div className="h-auto overflow-hidden relative"><div style="max-height: 400px;" className="overflow-hidden text-ellipsis leading-[22px] font-normal text-[14px]"><p className="tiptap-paragraph">..</p></div></div></div><div className="css-4o3x93"><p className=" css-zuhd6s">Kompetensi</p></div><div className="flex flex-wrap gap-1 -mt-2">-</div><div className="w-full flex mb-2"><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Harga Minimum</p></div><div className="css-4o3x93"><p className="font-semibold text-[#0F0F0F] css-1pj8jfk">Rp&nbsp;10.000</p></div></div></div><div className="w-full flex flex-col md:flex-row gap-y-4 md:gap-y-0"><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Kategori</p></div><div className="css-4o3x93"><p className="w-fit h-fit font-semibold css-1bq9ewv">Tahsin</p></div></div><div className="flex flex-col gap-y-2 w-full"><div className="css-4o3x93"><p className=" css-zuhd6s">Status</p></div><div className="css-4o3x93"><p className="px-3 py-2 w-fit h-fit text-white !text-[12px] rounded-[4px] font-semibold leading-none bg-successed-500 css-zuhd6s">Diterbitkan</p></div></div></div></div></div> */}
//             {/* <div className="hero-content text-accent text-center">
//                 <dpiv className="max-w-md">
//                 <DocumentIcon className="h-48 w-48 inline-block"/>
//                 <h1 className="text-5xl mt-2 font-bold">Blank Page</h1>
//                 </dpiv>
//             </div> */}
//         </div>
//     )
// }

// export default InternalPage