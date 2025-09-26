import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from '../common/headerSlice';
import InputText from '../../components/Input/InputText';
import InputTextRadio from '../../components/Input/InputTextRadio';
import SelectBox from "../../components/Input/SelectBox";
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import supabase from "../../services/database-server";
import { updateUniformModels } from "../../services/api/uniform_models";

function UniformModelEdit() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mid } = useParams();
    
    const [uniformModel, setUniformModel] = useState({
        model_name: "",
        model_code: "",
        model_gender: "",
        model_size_charts: {},
        model_url: "",
        school_id: "",
        admission_ays_id: ""
    });

    const [sizeRows, setSizeRows] = useState([]);
    const [originalSizeRows, setOriginalSizeRows] = useState([]);
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [admissionOptions, setAdmissionOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const genderOptions = [
        {label: "Laki-Laki", value: "male"},
        {label: "Perempuan", value: "female"}
    ];

    const sizeOptions = [
        { value: 'xs', label: 'XS' },
        { value: 's', label: 'S' },
        { value: 'm', label: 'M' },
        { value: 'l', label: 'L' },
        { value: 'xl', label: 'XL' },
        { value: 'xxl', label: '2XL' },
        { value: 'xxxl', label: '3XL' }
    ];

    const itemSizeOptions = [
        { value: 'PB', label: 'PB' },
        { value: 'LP', label: 'LP' },
        { value: 'LD', label: 'LD' },
        { value: 'PT', label: 'PT' }
    ];

    useEffect(() => {
        getSchoolOptions();
        getAdmissionOptions();
        getUniformModel(mid);
    }, [mid]);

    const convertSizeChartsToRows = (sizeCharts) => {
        const rows = [];
        let idCounter = 1;

        try {
            // Parse the sizeCharts if it's a string
            const charts = typeof sizeCharts === 'string' ? JSON.parse(sizeCharts) : sizeCharts;
            
            if (charts && typeof charts === 'object') {
                Object.entries(charts).forEach(([sizeKey, sizeData]) => {
                    if (sizeData && typeof sizeData === 'object') {
                        Object.entries(sizeData).forEach(([itemSize, quantity]) => {
                            // Only create rows for quantities greater than 0
                            if (quantity > 0) {
                                rows.push({
                                    id: idCounter++,
                                    sizeKey,
                                    itemSize,
                                    quantity: quantity.toString()
                                });
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error parsing size charts:", error);
        }

        // If no rows found with quantity > 0, add one empty row
        if (rows.length === 0) {
            rows.push({ id: 1, sizeKey: '', itemSize: '', quantity: '' });
        }

        return rows;
    };

    const getUniformModel = async (id) => {
        try {
            setLoading(true);
            const { data: uniform_models, error } = await supabase
                .from('school_uniform_models')
                .select('*, schools(school_name), admission_ays(academic_year)')
                .eq('id', id)
                .is('deleted_at', null)
                .single();

            if (error) {
                throw error;
            }

            if (uniform_models) {
                setUniformModel(uniform_models);
                setImagePreview(uniform_models.model_url);
                
                // Convert model_size_charts to rows format
                const rows = convertSizeChartsToRows(uniform_models.model_size_charts);
                setSizeRows(rows);
                setOriginalSizeRows(JSON.parse(JSON.stringify(rows))); // Deep copy
            }
        } catch (error) {
            console.error("Error fetching uniform model:", error);
            dispatch(showNotification({message: "Gagal memuat data seragam", status: 0}));
        } finally {
            setLoading(false);
        }
    };

    const getSchoolOptions = async () => {
        try {
            const { data: schools, error } = await supabase
                .from('schools')
                .select('*')
                .order('school_name');
            
            if (!error) {
                setSchoolOptions(
                    schools.map(school => ({
                        value: school.school_id,
                        label: school.school_name
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching schools:", error);
        }
    };

    const getAdmissionOptions = async () => {
        try {
            const { data: admissions, error } = await supabase
                .from('admission_ays')
                .select('*')
                .order('academic_year', { ascending: false });
            
            if (!error) {
                setAdmissionOptions(
                    admissions.map(admission => ({
                        value: admission.id,
                        label: admission.academic_year
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching admissions:", error);
        }
    };

    const addRow = () => {
        setSizeRows(prev => [
            ...prev,
            { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
        ]);
    };

    const removeRow = (id) => {
        if (sizeRows.length > 1) {
            setSizeRows(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleInputChange = (id, field, value) => {
        setSizeRows(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const convertToOutputFormat = () => {
        const result = {};
        
        // Initialize all sizes with 0 values
        sizeOptions.forEach(size => {
            result[size.value] = {
                PB: 0,
                LD: 0,
                LP: 0,
                PT: 0
            };
        });

        // Fill with actual values from form
        sizeRows.forEach(row => {
            if (row.sizeKey && row.itemSize && row.quantity) {
                const quantity = parseInt(row.quantity) || 0;
                if (result[row.sizeKey] && result[row.sizeKey][row.itemSize] !== undefined) {
                    result[row.sizeKey][row.itemSize] = quantity;
                }
            }
        });

        return result;
    };

    const updateFormValue = ({ nameInput, value }) => {
        setUniformModel(prev => ({
            ...prev,
            [nameInput]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                dispatch(showNotification({message: "Format file tidak valid. Gunakan JPEG, PNG, GIF, atau WebP.", status: 0}));
                e.target.value = '';
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                dispatch(showNotification({message: "Ukuran file terlalu besar. Maksimal 5MB.", status: 0}));
                e.target.value = '';
                return;
            }
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            setUniformModel(prev => ({
                ...prev,
                model_url_file: file
            }));
        }
    };

    const upload = async (file, modelName, schoolId) => {
        if (!file) return uniformModel.model_url;
        
        try {
            const fileExtension = file.name.split('.').pop();
            const filepath = `${modelName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExtension}`;
            const sch_id = schoolId || 'default';

            const { error } = await supabase
                .storage
                .from('admissions/uniform-models')
                .upload(`${sch_id}/${filepath}`, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error("Gagal Upload Berkas", error.message);
                throw error;
            }

            const { data } = await supabase.storage
                .from("admissions/uniform-models")
                .getPublicUrl(`${sch_id}/${filepath}`);

            return data.publicUrl;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const validateForm = () => {
        if (!uniformModel.model_name.trim()) {
            return "Nama model harus diisi";
        }
        if (!uniformModel.model_code.trim()) {
            return "Kode model harus diisi";
        }
        if (!uniformModel.model_gender) {
            return "Jenis kelamin harus dipilih";
        }
        if (!uniformModel.school_id) {
            return "Jenjang harus dipilih";
        }

        // Validate size chart - at least one row with valid data
        const hasValidSizeRow = sizeRows.some(row => 
            row.sizeKey && row.itemSize && row.quantity && parseInt(row.quantity) > 0
        );
        
        if (!hasValidSizeRow) {
            return "Minimal satu ukuran harus diisi dengan quantity lebih dari 0";
        }

        return null;
    };

    const saveExam = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate form
        const validationError = validateForm();
        if (validationError) {
            dispatch(showNotification({message: validationError, status: 0}));
            setLoading(false);
            return;
        }

        try {
            // Upload image if new file was selected
            const imageUrl = await upload(
                uniformModel.model_url_file, 
                uniformModel.model_name, 
                uniformModel.school_id
            );

            // Prepare data
            const outputData = convertToOutputFormat();
            const uniformModelData = {
                ...uniformModel,
                model_size_charts: outputData,
                model_url: imageUrl || uniformModel.model_url
            };

            // Remove the file object from the data
            delete uniformModelData.model_url_file;

            // Submit to API
            const response = await updateUniformModels({ 
                id: mid, 
                uniformModel: uniformModelData 
            });
            
            if (response && !response.error) {
                dispatch(showNotification({message: response.message, status: 1}));
                navigate("/ad/uniform-models/detail/" + mid);
            } else {
                const errorMessage = response?.message || "Gagal Mengupdate Seragam";
                dispatch(showNotification({message: errorMessage, status: 0}));
            }
        } catch (error) {
            console.error("Save error:", error);
            dispatch(showNotification({
                message: error.message || "Gagal Mengupdate Seragam", 
                status: 0
            }));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSizeRows(JSON.parse(JSON.stringify(originalSizeRows))); // Reset to original rows
        setImagePreview(uniformModel.model_url);
        
        // Clear any selected file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
        
        setUniformModel(prev => ({
            ...prev,
            model_url_file: null
        }));
    };

    if (loading && !uniformModel.model_name) {
        return (
            <TitleCard title="Edit Seragam" topMargin="mt-2">
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </TitleCard>
        );
    }

    return (
        <TitleCard title="Edit Seragam" topMargin="mt-2">
            <form onSubmit={saveExam}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText 
                        labelTitle="Nama Model*" 
                        nameInput="model_name" 
                        updateFormValue={updateFormValue}
                        defaultValue={uniformModel.model_name}
                        required
                    />
                    
                    <InputText 
                        labelTitle="Kode Model*" 
                        nameInput="model_code" 
                        updateFormValue={updateFormValue}
                        defaultValue={uniformModel.model_code}
                        required
                    />
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Gambar Model</span>
                        </label>
                        <input 
                            name='model_url' 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="file-input file-input-bordered w-full"  
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                                <p className="text-sm text-gray-500 mt-1">Gambar saat ini</p>
                            </div>
                        )}
                        <label className="label">
                            <span className="label-text-alt">Format: JPEG, PNG, GIF, WebP (Max 5MB)</span>
                        </label>
                    </div>
                    
                    <InputTextRadio 
                        labelTitle="Jenis Kelamin*" 
                        nameInput="model_gender" 
                        type="radio" 
                        options={genderOptions} 
                        updateFormValue={updateFormValue}
                        defaultValue={uniformModel.model_gender}
                        required
                    />

                    {/* Size Chart Table */}
                    <div className="col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Size Chart*</h3>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Tambah Ukuran
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizeRows.map((row) => (
                                        <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {row.itemSize}
                                                <select
                                                    value={row.sizeKey}
                                                    onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="">Pilih Size</option>
                                                    {sizeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.itemSize}
                                                    onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="">Pilih Item Size</option>
                                                    {itemSizeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={row.quantity}
                                                    onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </td>
                                            
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(row.id)}
                                                    disabled={sizeRows.length === 1}
                                                    className={`p-2 rounded-md transition-colors ${
                                                        sizeRows.length === 1
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-600 hover:bg-red-100 hover:text-red-700'
                                                    }`}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <SelectBox
                        nameInput="school_id"
                        options={schoolOptions}
                        labelTitle="Jenjang*"
                        placeholder="Pilih Jenjang"
                        containerStyle="w-full"
                        updateFormValue={updateFormValue}
                        defaultValue={uniformModel.school_id}
                        required
                    />

                    <SelectBox
                        nameInput="admission_ays_id"
                        options={admissionOptions}
                        labelTitle="Tahun Ajaran"
                        placeholder="Pilih Tahun Ajaran"
                        containerStyle="w-full"
                        updateFormValue={updateFormValue}
                        defaultValue={uniformModel.admission_ays_id}
                    />
                </div>

                <div className="divider"></div>

                <div className="mt-16 flex justify-end gap-4">
                    <button 
                        type="button" 
                        className="btn bg-gray-400"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                    <button 
                        type="button" 
                        className="btn bg-orange-400"
                        onClick={() => navigate(-1)}
                    >
                        Batal
                    </button>
                    <button 
                        className="btn bg-green-700" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Menyimpan...
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </form>
        </TitleCard>
    );
}

export default UniformModelEdit;
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import TitleCard from "../../components/Cards/TitleCard";
// import { showNotification } from '../common/headerSlice';
// import InputText from '../../components/Input/InputText';
// import InputTextRadio from '../../components/Input/InputTextRadio';
// import SelectBox from "../../components/Input/SelectBox";
// import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// import supabase from "../../services/database-server";
// import { updateUniformModels } from "../../services/api/uniform_models";

// function UniformModelEdit() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { mid } = useParams();
    
//     const [uniformModel, setUniformModel] = useState({
//         model_name: "",
//         model_code: "",
//         model_gender: "",
//         model_size_charts: {},
//         model_url: "",
//         school_id: "",
//         admission_ays_id: ""
//     });

//     const [sizeRows, setSizeRows] = useState([]);
//     const [originalSizeRows, setOriginalSizeRows] = useState([]);
//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [admissionOptions, setAdmissionOptions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [imagePreview, setImagePreview] = useState("");

//     const genderOptions = [
//         {label: "Laki-Laki", value: "male"},
//         {label: "Perempuan", value: "female"}
//     ];

//     const sizeOptions = [
//         { value: 'xs', label: 'XS' },
//         { value: 's', label: 'S' },
//         { value: 'm', label: 'M' },
//         { value: 'l', label: 'L' },
//         { value: 'xl', label: 'XL' },
//         { value: 'xxl', label: '2XL' },
//         { value: 'xxxl', label: '3XL' }
//     ];

//     const itemSizeOptions = [
//         { value: 'PB', label: 'PB' },
//         { value: 'LP', label: 'LP' },
//         { value: 'LD', label: 'LD' },
//         { value: 'PT', label: 'PT' }
//     ];

//     useEffect(() => {
//         getSchoolOptions();
//         getAdmissionOptions();
//         getUniformModel(mid);
//     }, [mid]);

//     const getUniformModel = async (id) => {
//         try {
//             setLoading(true);
//             const { data: uniform_models, error } = await supabase
//                 .from('school_uniform_models')
//                 .select('*, schools(school_name), admission_ays(academic_year)')
//                 .eq('id', id)
//                 .is('deleted_at', null)
//                 .single();

//             if (error) {
//                 throw error;
//             }

//             if (uniform_models) {
//                 setUniformModel(uniform_models);
//                 setImagePreview(uniform_models.model_url);
                
//                 // Convert model_size_charts to rows format
//                 const rows = convertSizeChartsToRows(uniform_models.model_size_charts);
//                 setSizeRows(rows);
//                 setOriginalSizeRows(rows);
//             }
//         } catch (error) {
//             console.error("Error fetching uniform model:", error);
//             dispatch(showNotification({message: "Gagal memuat data seragam", status: 0}));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const convertSizeChartsToRows = (sizeCharts) => {
//         const rows = [];
//         let idCounter = 1;

//         if (sizeCharts && typeof sizeCharts === 'object') {
//             Object.entries(sizeCharts).forEach(([sizeKey, sizeData]) => {
//                 if (sizeData && typeof sizeData === 'object') {
//                     Object.entries(sizeData).forEach(([itemSize, quantity]) => {
//                         if (quantity > 0) {
//                             rows.push({
//                                 id: idCounter++,
//                                 sizeKey,
//                                 itemSize,
//                                 quantity: quantity.toString()
//                             });
//                         }
//                     });
//                 }
//             });
//         }

//         // If no rows found, add one empty row
//         if (rows.length === 0) {
//             rows.push({ id: 1, sizeKey: '', itemSize: '', quantity: '' });
//         }

//         return rows;
//     };

//     const getSchoolOptions = async () => {
//         try {
//             const { data: schools, error } = await supabase
//                 .from('schools')
//                 .select('*')
//                 .order('school_name');
            
//             if (!error) {
//                 setSchoolOptions(
//                     schools.map(school => ({
//                         value: school.school_id,
//                         label: school.school_name
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching schools:", error);
//         }
//     };

//     const getAdmissionOptions = async () => {
//         try {
//             const { data: admissions, error } = await supabase
//                 .from('admission_ays')
//                 .select('*')
//                 .order('academic_year', { ascending: false });
            
//             if (!error) {
//                 setAdmissionOptions(
//                     admissions.map(admission => ({
//                         value: admission.id,
//                         label: admission.academic_year
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching admissions:", error);
//         }
//     };

//     const addRow = () => {
//         setSizeRows(prev => [
//             ...prev,
//             { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
//         ]);
//     };

//     const removeRow = (id) => {
//         if (sizeRows.length > 1) {
//             setSizeRows(prev => prev.filter(row => row.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setSizeRows(prev =>
//             prev.map(row =>
//                 row.id === id ? { ...row, [field]: value } : row
//             )
//         );
//     };

//     const convertToOutputFormat = () => {
//         const result = {};
        
//         // Initialize all sizes with 0 values
//         sizeOptions.forEach(size => {
//             result[size.value] = {
//                 PB: 0,
//                 LD: 0,
//                 LP: 0,
//                 PT: 0
//             };
//         });

//         // Fill with actual values from form
//         sizeRows.forEach(row => {
//             if (row.sizeKey && row.itemSize && row.quantity) {
//                 const quantity = parseInt(row.quantity) || 0;
//                 if (result[row.sizeKey] && result[row.sizeKey][row.itemSize] !== undefined) {
//                     result[row.sizeKey][row.itemSize] = quantity;
//                 }
//             }
//         });

//         return result;
//     };

//     const updateFormValue = ({ nameInput, value }) => {
//         setUniformModel(prev => ({
//             ...prev,
//             [nameInput]: value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check file type
//             const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//             if (!validTypes.includes(file.type)) {
//                 dispatch(showNotification({message: "Format file tidak valid. Gunakan JPEG, PNG, GIF, atau WebP.", status: 0}));
//                 e.target.value = '';
//                 return;
//             }
            
//             // Check file size (max 5MB)
//             if (file.size > 5 * 1024 * 1024) {
//                 dispatch(showNotification({message: "Ukuran file terlalu besar. Maksimal 5MB.", status: 0}));
//                 e.target.value = '';
//                 return;
//             }
            
//             // Create preview
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImagePreview(e.target.result);
//             };
//             reader.readAsDataURL(file);

//             setUniformModel(prev => ({
//                 ...prev,
//                 model_url_file: file
//             }));
//         }
//     };

//     const upload = async (file, modelName, schoolId) => {
//         if (!file) return uniformModel.model_url;
        
//         try {
//             const fileExtension = file.name.split('.').pop();
//             const filepath = `${modelName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExtension}`;
//             const sch_id = schoolId || 'default';

//             const { error } = await supabase
//                 .storage
//                 .from('admissions/uniform-models')
//                 .upload(`${sch_id}/${filepath}`, file, {
//                     cacheControl: '3600',
//                     upsert: true
//                 });

//             if (error) {
//                 console.error("Gagal Upload Berkas", error.message);
//                 throw error;
//             }

//             const { data } = await supabase.storage
//                 .from("admissions/uniform-models")
//                 .getPublicUrl(`${sch_id}/${filepath}`);

//             return data.publicUrl;
//         } catch (error) {
//             console.error("Upload error:", error);
//             throw error;
//         }
//     };

//     const validateForm = () => {
//         if (!uniformModel.model_name.trim()) {
//             return "Nama model harus diisi";
//         }
//         if (!uniformModel.model_code.trim()) {
//             return "Kode model harus diisi";
//         }
//         if (!uniformModel.model_gender) {
//             return "Jenis kelamin harus dipilih";
//         }
//         if (!uniformModel.model_url && !uniformModel.model_url_file) {
//             return "Gambar model harus diupload";
//         }
//         if (!uniformModel.school_id) {
//             return "Jenjang harus dipilih";
//         }

//         // Validate size chart
//         const hasValidSizeRow = sizeRows.some(row => 
//             row.sizeKey && row.itemSize && row.quantity && parseInt(row.quantity) > 0
//         );
        
//         if (!hasValidSizeRow) {
//             return "Minimal satu ukuran harus diisi dengan quantity lebih dari 0";
//         }

//         return null;
//     };

//     const saveExam = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Validate form
//         const validationError = validateForm();
//         if (validationError) {
//             dispatch(showNotification({message: validationError, status: 0}));
//             setLoading(false);
//             return;
//         }

//         try {
//             // Upload image if new file was selected
//             const imageUrl = await upload(
//                 uniformModel.model_url_file, 
//                 uniformModel.model_name, 
//                 uniformModel.school_id
//             );

//             // Prepare data
//             const outputData = convertToOutputFormat();
//             const uniformModelData = {
//                 ...uniformModel,
//                 model_size_charts: outputData,
//                 model_url: imageUrl || uniformModel.model_url
//             };

//             // Remove the file object from the data
//             delete uniformModelData.model_url_file;

//             // Submit to API
//             const response = await updateUniformModels({ 
//                 id: mid, 
//                 uniformModel: uniformModelData 
//             });
            
//             if (response && !response.error) {
//                 dispatch(showNotification({message: response.message, status: 1}));
//                 navigate("/ad/uniform-models/detail/" + mid);
//             } else {
//                 const errorMessage = response?.message || "Gagal Mengupdate Seragam";
//                 dispatch(showNotification({message: errorMessage, status: 0}));
//             }
//         } catch (error) {
//             console.error("Save error:", error);
//             dispatch(showNotification({
//                 message: error.message || "Gagal Mengupdate Seragam", 
//                 status: 0
//             }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setUniformModel(prev => ({ ...prev }));
//         setSizeRows([...originalSizeRows]);
//         setImagePreview(uniformModel.model_url);
//     };

//     if (loading && !uniformModel.model_name) {
//         return (
//             <TitleCard title="Edit Seragam" topMargin="mt-2">
//                 <div className="flex justify-center items-center h-64">
//                     <div className="loading loading-spinner loading-lg"></div>
//                 </div>
//             </TitleCard>
//         );
//     }

//     return (
//         <TitleCard title="Edit Seragam" topMargin="mt-2">
//             <form onSubmit={saveExam}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText 
//                         labelTitle="Nama Model*" 
//                         nameInput="model_name" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_name}
//                         required
//                     />
                    
//                     <InputText 
//                         labelTitle="Kode Model*" 
//                         nameInput="model_code" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_code}
//                         required
//                     />
                    
//                     <div className="form-control w-full">
//                         <label className="label">
//                             <span className="label-text">Gambar Model</span>
//                         </label>
//                         <input 
//                             name='model_url' 
//                             type="file" 
//                             onChange={handleFileChange} 
//                             accept="image/jpeg,image/png,image/gif,image/webp"
//                             className="file-input file-input-bordered w-full"  
//                         />
//                         <label className="label">
//                             <span className="label-text-alt">Format: JPEG, PNG, GIF, WebP (Max 5MB)</span>
//                         </label>
//                         {imagePreview && (
//                             <div className="mt-2">
//                                 <p className="text-sm text-gray-500 mt-1"></p>
//                                 <img 
//                                     src={imagePreview} 
//                                     alt="Preview" 
//                                     className="w-32 h-32 object-cover rounded-md border"
//                                 />
//                             </div>
//                         )}
                        
//                     </div>
                    
//                     <InputTextRadio 
//                         labelTitle="Jenis Kelamin*" 
//                         nameInput="model_gender" 
//                         type="radio" 
//                         options={genderOptions} 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_gender}
//                         required
//                     />

//                     {/* Size Chart Table */}
//                     <div className="col-span-2">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">Size Chart*</h3>
//                             <button
//                                 type="button"
//                                 onClick={addRow}
//                                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 <PlusCircleIcon className="w-5 h-5" />
//                                 Tambah Ukuran
//                             </button>
//                         </div>
                        
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto">
//                                 <thead>
//                                     <tr className="bg-gray-100">
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sizeRows.map((row) => (
//                                         <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.sizeKey}
//                                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Pilih Size</option>
//                                                     {sizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.itemSize}
//                                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Pilih Item Size</option>
//                                                     {itemSizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     value={row.quantity}
//                                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
//                                                     placeholder="0"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 />
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeRow(row.id)}
//                                                     disabled={sizeRows.length === 1}
//                                                     className={`p-2 rounded-md transition-colors ${
//                                                         sizeRows.length === 1
//                                                             ? 'text-gray-400 cursor-not-allowed'
//                                                             : 'text-red-600 hover:bg-red-100 hover:text-red-700'
//                                                     }`}
//                                                 >
//                                                     <TrashIcon className="w-5 h-5" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     <SelectBox
//                         nameInput="school_id"
//                         options={schoolOptions}
//                         labelTitle="Jenjang*"
//                         placeholder="Pilih Jenjang"
//                         containerStyle="w-full"
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.school_id}
//                         required
//                     />

//                     <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-full"
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.admission_ays_id}
//                     />
//                 </div>

//                 <div className="divider"></div>

//                 <div className="mt-16 flex justify-end gap-4">
//                     <button 
//                         type="button" 
//                         className="btn bg-gray-400"
//                         onClick={resetForm}
//                     >
//                         Reset
//                     </button>
//                     <button 
//                         type="button" 
//                         className="btn bg-orange-400"
//                         onClick={() => navigate(-1)}
//                     >
//                         Batal
//                     </button>
//                     <button 
//                         className="btn bg-green-700" 
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <>
//                                 <span className="loading loading-spinner"></span>
//                                 Menyimpan...
//                             </>
//                         ) : (
//                             "Update"
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </TitleCard>
//     );
// }

// export default UniformModelEdit;

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import TitleCard from "../../components/Cards/TitleCard";
// import { showNotification } from '../common/headerSlice';
// import InputText from '../../components/Input/InputText';
// import InputTextRadio from '../../components/Input/InputTextRadio';
// import SelectBox from "../../components/Input/SelectBox";
// import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// import supabase from "../../services/database-server";
// import { addUniformModels } from "../../services/api/uniform_models";

// function UniformModelCreate() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const [uniformModel, setUniformModel] = useState({
//         model_name: "",
//         model_gender: "",
//         model_size_charts: {},
//         model_url: "",
//         school_id: "",
//         admission_ays_id: ""
//     });

//     const [sizeRows, setSizeRows] = useState([
//         { id: 1, sizeKey: '', itemSize: '', quantity: '' }
//     ]);

//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [admissionOptions, setAdmissionOptions] = useState([]);
//     const [genderOptions] = useState([
//         {label: "Laki-Laki", value: "male"},
//         {label: "Perempuan", value: "female"}
//     ]);

//     const sizeOptions = [
//         { value: 'xs', label: 'XS' },
//         { value: 's', label: 'S' },
//         { value: 'm', label: 'M' },
//         { value: 'l', label: 'L' },
//         { value: 'xl', label: 'XL' },
//         { value: 'xxl', label: '2XL' },
//         { value: 'xxxl', label: '3XL' }
//     ];

//     const itemSizeOptions = [
//         { value: 'PB', label: 'PB' },
//         { value: 'LP', label: 'LP' },
//         { value: 'LD', label: 'LD' },
//         { value: 'PT', label: 'PT' }
//     ];

//     useEffect(() => {
//         getSchoolOptions();
//         getAdmissionOptions();
//     }, []);

//     const getSchoolOptions = async () => {
//         try {
//             const { data: schools, error } = await supabase
//                 .from('schools')
//                 .select('*');
            
//             if (!error) {
//                 setSchoolOptions(
//                     schools.map(school => ({
//                         value: school.school_id,
//                         label: school.school_name
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching schools:", error);
//         }
//     };

//     const getAdmissionOptions = async () => {
//         try {
//             const { data: admissions, error } = await supabase
//                 .from('admission_ays')
//                 .select('*');
            
//             if (!error) {
//                 setAdmissionOptions(
//                     admissions.map(admission => ({
//                         value: admission.id,
//                         label: admission.academic_year
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching admissions:", error);
//         }
//     };

//     const addRow = () => {
//         setSizeRows(prev => [
//             ...prev,
//             { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
//         ]);
//     };

//     const removeRow = (id) => {
//         if (sizeRows.length > 1) {
//             setSizeRows(prev => prev.filter(row => row.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setSizeRows(prev =>
//             prev.map(row =>
//                 row.id === id ? { ...row, [field]: value } : row
//             )
//         );
//     };

//     const convertToOutputFormat = () => {
//         const result = {};
        
//         // Initialize all sizes with 0 values
//         sizeOptions.forEach(size => {
//             result[size.value] = {
//                 PB: 0,
//                 LD: 0,
//                 LP: 0,
//                 PT: 0
//             };
//         });

//         // Fill with actual values from form
//         sizeRows.forEach(row => {
//             if (row.sizeKey && row.itemSize && row.quantity) {
//                 result[row.sizeKey][row.itemSize] = parseInt(row.quantity) || 0;
//             }
//         });

//         return result;
//     };

//     const updateFormValue = ({ nameInput, value, newValue=null }) => {
//         setUniformModel(prev => ({
//             ...prev,
//             [nameInput]: value?value:newValue
//         }));
//         console.log(nameInput, value, newValue, uniformModel)
//     };
//     const upload = async (file, name, id ) => {

//         const filepath = `${name}-${Date.now()}`
//         const sch_id = id
//         const { data_, error_ } = await supabase
//             .storage
//             .from('admissions/uniform-models')
//             .upload(sch_id + "/" + filepath, file,
//             {cacheControl: '3600', upsert: true}
//             )
//         if (error_) {
//         ////console.error("Gagal Upload Berkas", error_.message)
//         return null
//         }
//         const { data } = await supabase.storage.from("admissions/uniform-models").getPublicUrl(sch_id+ "/" +filepath)
//         const data_url = {
//         path: data.publicUrl
//         }
//         ////console.log(data.publicUrl)
//         // setBerkasUrl(data.publicUrl)
//         // setBerkasUrl((data.publicUrl).toString())
//         // if(name == "Bird-Certificate"){
//         //   berkasUrl.a = data.publicUrl.toString()
//         // }
//         // if(name == "KK"){
//         //   berkasUrl.b = data.publicUrl.toString()
//         // }
//         // if(name == "Parent-KTP"){
//         //   berkasUrl.c = data.publicUrl.toString()
//         // }
//         // if(name == "Pas-Photo"){
//         //   berkasUrl.d = data.publicUrl.toString()
//         // }
//         // if(name == "Surat-Kesanggupan"){
//         //   berkasUrl.e = data.publicUrl.toString()
//         // }
//         // if(name == "Syahadah"){
//         //   berkasUrl.f = data.publicUrl.toString()
//         // }
//         // if(name == "Photo-Sampul-Ijazah"){
//         //   berkasUrl.g = data.publicUrl.toString()
//         // }
//         // berkasUrl.a = data.publicUrl.toString()
//         // ////console.log(berkasUrl)
//         return data.publicUrl??null
//         // const { data, error } = await supabase.storage.from('participant-documents').createSignedUrl(participant_id+ "/" +filepath, 3600)

//         // const path = {
//         //   signedUrl: data.signedUrl.toString()?? ""
//         // } 

//         // if (data) {
//         //   ////console.log('signedUrl > ', data.signedUrl)
//         //   ////console.log('data_ > ', data_)
//         //   return path
//         // }
//     }

//     const saveExam = async (e) => {
//         e.preventDefault();
        
//         const outputData = convertToOutputFormat();
//         const uniformModelData = {
//             ...uniformModel,
//             model_size_charts: outputData,
//             model_url: await upload(uniformModel.model_url)
//         };

//         console.log('uniformModel', uniformModel)

//         // Validation
//         // if (!uniformModelData.model_name || !uniformModelData.model_gender || 
//         //     !uniformModelData.school_id || !uniformModelData.admission_ays_id) {
//         //     dispatch(showNotification({message: "Gagal Menambahkan Seragam. Data tidak valid.", status: 0}));
//         //     return;
//         // }

//         try {
//             const response = await addUniformModels({ uniformModel: uniformModelData });
            
//             if (response && !response.error) {
//                 dispatch(showNotification({message: response.message, status: 1}));
//                 navigate("/ad/uniform-models/detail/" + response.data);
//             } else {
//                 dispatch(showNotification({message: "Gagal Menambahkan Seragam", status: 0}));
//             }
//         } catch (error) {
//             dispatch(showNotification({message: "Gagal Menambahkan Seragam", status: 0}));
//         }
//     };

//     return (
//         <TitleCard title="Tambah Seragam" topMargin="mt-2">
//             <form onSubmit={saveExam}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText 
//                         labelTitle="Nama Model" 
//                         nameInput="model_name" 
//                         updateFormValue={updateFormValue}
//                     />
                    
//                     <InputText 
//                         type="file" 
//                         labelTitle="Gambar Model" 
//                         nameInput="model_url" 
//                         updateFormValue={updateFormValue}
//                     />

//                     <input name='model_url' type={"file"} onChange={(e) => updateFormValue('model_url', e.target.files[0])} required className={`input input-bordered w-full` }  />
                    
//                     <InputTextRadio 
//                         labelTitle="Jenis Kelamin" 
//                         nameInput="model_gender" 
//                         type="radio" 
//                         options={genderOptions} 
//                         updateFormValue={updateFormValue}
//                     />

//                     {/* Size Chart Table */}
//                     <div className="col-span-2">
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto">
//                                 <thead>
//                                     <tr className="bg-gray-100">
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size Key</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sizeRows.map((row) => (
//                                         <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.sizeKey}
//                                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Select Size</option>
//                                                     {sizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.itemSize}
//                                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Select Item Size</option>
//                                                     {itemSizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     value={row.quantity}
//                                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
//                                                     placeholder="Enter quantity"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 />
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeRow(row.id)}
//                                                     disabled={sizeRows.length === 1}
//                                                     className={`p-2 rounded-md transition-colors ${
//                                                         sizeRows.length === 1
//                                                             ? 'text-gray-400 cursor-not-allowed'
//                                                             : 'text-red-600 hover:bg-red-100 hover:text-red-700'
//                                                     }`}
//                                                 >
//                                                     <TrashIcon className="w-5 h-5" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="flex justify-between items-center pt-4">
//                             <button
//                                 type="button"
//                                 onClick={addRow}
//                                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 <PlusCircleIcon className="w-5 h-5" />
//                                 Add Row
//                             </button>
//                         </div>
//                     </div>

//                     <SelectBox
//                         nameInput="school_id"
//                         options={schoolOptions}
//                         labelTitle="Jenjang"
//                         placeholder="Pilih Jenjang"
//                         containerStyle="w-72"
//                         updateFormValue={updateFormValue}
//                     />

//                     <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-72"
//                         updateFormValue={updateFormValue}
//                     />
//                 </div>

//                 <div className="divider"></div>

//                 <div className="mt-16">
//                     <button className="btn btn-primary float-right" type="submit">
//                         Simpan
//                     </button>
//                 </div>
//             </form>
//         </TitleCard>
//     );
// }

// export default UniformModelCreate;


// // import moment from "moment"
// // import { useTransition, useEffect, useState } from "react"
// // import { useDispatch, useSelector } from "react-redux"
// // import TitleCard from "../../components/Cards/TitleCard"
// // import { showNotification } from '../common/headerSlice'
// // import InputText from '../../components/Input/InputText'
// // import InputTextRadio from '../../components/Input/InputTextRadio'
// // import SelectBox from "../../components/Input/SelectBox"
// // import TextAreaInput from '../../components/Input/TextAreaInput'
// // import ToogleInput from '../../components/Input/ToogleInput'
// // import InputDateTime from "../../components/Input/InputDateTime"
// // import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// // import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// // import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// // import {
// //   Button,
// //   Checkbox,
// //   FormControl,
// //   FormControlLabel,
// //   FormLabel,
// //   IconButton,
// //   Radio,
// //   RadioGroup,
// //   TextField,
// // } from "@mui/material";
// // import { z } from "zod"
// // import { zodResolver } from "@hookform/resolvers/zod"
// // import { useForm, useFieldArray } from "react-hook-form"

// // import supabase from "../../services/database-server"
// // import {addExam} from "../../services/api/exams"

// // import DateTimePicker from 'react-datetime-picker'
// // import { useNavigate, useParams } from "react-router-dom"
// // import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// // // import DatePicker from 'rsuite/DatePicker';
// // // import 'rsuite/DatePicker/styles/index.css';
// // // importing styling datepicker
// // // import "./css/react-datepicker/react-datepicker.css"

// // import axios from "axios"
// // import schools from "../../services/api/schools"
// // import { root } from "postcss"
// // import { addUniformModels } from "../../services/api/uniform_models"

// // // import supabase from "../services/database"

// // // type ValuePiece = Date | null

// // // type Value = ValuePiece | [ValuePiece, ValuePiece]
// // export const scheduleSchema = z.object({
// //     name: z.string().min(1, "Nama wajib diisi"),        
// //     subtitle: z.string().min(1, "Deskripsi wajib diisi"),        
// //     icon: z.string().min(1, "Ikon wajib diupload"),        
// //     // started_at: z.string().min(1, "Waktu Mulai wajid diisi"),
// //     ended_at: z.string().min(1, "Waktu Selesai wajid diisi"),
// //     scheme: z.string().min(1, "Deskripsi wajib diisi"),        
// //     question_type: z.string().min(1, "Deskripsi wajib diisi"),        
// //     location: z.string().min(1, "Deskripsi wajib diisi"),        
// //     room: z.string().min(1, "Deskripsi wajib diisi"),
// //     schedule_id: z.string().min(1, "Jenjang wajib diisi")
// // })

// // export const scheduleDefaultValues = {
// //   name: "",
// //   subtitle: "",
// // //   icon: "",
// //   scheme: "",
// //   question_type: "",
// //   location: "",
// //   room: "",
// //   started_at: "",
// //   ended_at: "",
// //   schedule_id: ""  
// // };


// // function UniformModelCreate(){

// //     const dispatch = useDispatch()
// //     // const navigate = useNavigate()
// //     const [value, onChange] = useState(new Date())
    
// //     const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "", schedule_id: "" })
// //     const [uniformModels, setUniformModels] = useState({})
// //     const [model_name, setModelName] = useState("")
// //     const [model_gender, setModelGender] = useState("")
// //     const [model_size_charts, setModelSizeCharts] = useState({})
// //     const [model_url, setModelUrl] = useState("")
// //     const [school_id, setSchoolId] = useState("")
// //     const [ isPending, startTransition ] = useTransition()
// //     const [sizeChartOptions, setSizeChartOptions] = useState([{label: "XS", value: "xs"}, {label: "S", value: "s"}, {label: "M", value: "m"}, {label: "L", value: "l"}, {label: "XL", value: "xl"}, {label: "XXL", value: "xxl"}, {label: "XXXL", value: "xxxl"}, {label: "S", value: "s"}])
// //     const [ObjectsMeasurementsOptions, setObjectMeasurement] = useState([{label: "PB", value: "PB"}, {label: "LD", value: "LD"},{label: "LP", value: "LP"},{label: "PT", value: "PT"}])
// //     // exam_category_id: "",
// //     // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
// //     const [schemeOptions, setSchemeOptions] = useState([{label: "Online", value: "online"},{label: "Offline", value: "offline"}])
// //     const [typeOptions, setTypeOptions] = useState([{label: "Pilihan Ganda", value: "MC"},{label: "Essay Singkat", value: "ES"},{label: "Benar Salah", value: "BS"},{label: "Essay", value: "E"}])
// //     const [genderOptions, setGenderOptions] = useState([{label: "Laki-Laki", value: "male"},{label: "Perempuan", value: "female"}])
// //     const [schoolOptions, setSchoolOptions] = useState([])
// //     const [admissionOptions, setAdmissionOptions] = useState([])
// //     const [schedulesOptions, setScheduleOptions] = useState([])
// //     const [selectedOption, setSelectedOption] = useState(null);
// //     const checked = false
// //     const navigate = useNavigate()
// //     const {
// //         register,
// //         handleSubmit,
// //         formState: { errors },
// //         control
// //       } = useForm({
// //         resolver: zodResolver(scheduleSchema),
// //         defaultValues: scheduleDefaultValues,
// //       });

// //     const {
// //         fields: sizeChartFields,
// //         replace: replaceSizeChart,
// //         append: appendSizeChart,
// //         remove: removeSizeChart,
// //     } = useFieldArray({
// //         control,
// //         name: "model_size_charts",
// //     });

// //     const [sizeRows, setSizeRows] = useState([
// //         { id: 1, sizeKey: '', itemSize: '', quantity: '' }
// //     ]);

// //     const sizeOptions = [
// //         { value: 'xs', label: 'XS' },
// //         { value: 's', label: 'S' },
// //         { value: 'm', label: 'M' },
// //         { value: 'l', label: 'L' },
// //         { value: 'xl', label: 'XL' },
// //         { value: 'xxl', label: '2XL' },
// //         { value: 'xxxl', label: '3XL' },
// //         { value: '4xl', label: '4XL' }
// //     ];

// //     const itemSizeOptions = [
// //         { value: 'PB', label: 'PB' },
// //         { value: 'LP', label: 'LP' },
// //         { value: 'LD', label: 'LD' },
// //         { value: 'PT', label: 'PT' }
// //     ];

// //     const addRow = () => {
// //         setSizeRows(prev => [
// //         ...prev,
// //         { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
// //         ]);
// //     };

// //     const removeRow = (id) => {
// //         if (sizeRows.length > 1) {
// //         setSizeRows(prev => prev.filter(row => row.id !== id));
// //         }
// //     };

// //     const handleInputChange = (id, field, value) => {
// //         setSizeRows(prev =>
// //         prev.map(row =>
// //             row.id === id ? { ...row, [field]: value } : row
// //         )
// //         );
// //     };

// //     // Convert the rows data to the desired JSON format
// //     const convertToOutputFormat = () => {
// //         const result = {};
        
// //         sizeOptions.forEach(size => {
// //         result[size.value] = {
// //             PB: 0,
// //             LD: 0,
// //             LP: 0,
// //             PT: 0
// //         };
// //         });

// //         sizeRows.forEach(row => {
// //         if (row.sizeKey && row.itemSize && row.quantity) {
// //             if (!result[row.sizeKey]) {
// //             result[row.sizeKey] = {};
// //             }
// //             result[row.sizeKey][row.itemSize] = parseInt(row.quantity) || 0;
// //         }
// //         });

// //         return result;
// //     };
// //     // const {id} = useParams()
// //     // useEffect(() => {
// //     //     if (otherSizeChart) {
// //     //     replaceSizeChart([{ name: "" }]);
// //     //     }
// //     // }, [otherSizeChart, replaceSizeChart]);

// //     useEffect( () => {
// //         // if(schoolOptions) {

// //             getSchoolsOptions()
// //             getAdmissionOptions()
// //         // }
// //         // getSchedule()
// //         // console.log(id)
// //         console.log(exam)
// //     },[schoolOptions])

// //     const getAdmissionOptions = async () => {
// //         let { data: schools, error } = await supabase
// //             .from('admission_ays')
// //             .select('*')
// //             console.log(schools)
// //             if(!error){
// //                 // setSchoolOptions(schools)
// //                 setSchoolOptions(
// //                     schools.map((e)=>(
// //                         // setScheduleOptions( e => {
// //                         { value:e.id, label: e.academic_year}
                        
// //                     ))
// //                 )
// //                     console.log(schoolOptions)
// //     }

// //     // Call API to update profile settings changes
// //     const saveExam = async (e) => {
// //         e.preventDefault()
// //         const outputData = convertToOutputFormat();
// //         console.log('Size Chart JSON Output:', outputData);
// //         const uniformModels = {
// //             model_name: model_name,
// //             model_gender: model_gender,
// //             model_size_charts: outputData,
// //             school_id: school_id, 
// //             file: model_url
// //         }
// //         console.log('exam in ad', model_name, model_name, model_size_charts, school_id)
// //         if(model_name=="" || model_name=="" || model_size_charts=="" || school_id=="" ){
// //             dispatch(showNotification({message : "Gagal Menambahkan Seragam. Data tidak valid.", status : 0}))
// //             return
// //         }
// //         // const {school_id, ...newUniformModels} = uniformModels
// //         const response = {}
// //         startTransition(() => {

// //             setTimeout( async() => {
    
// //                 response = await addUniformModels({uniformModels})
                
// //                 console.log('response', response)
// //             }, 2000);
// //         })
// //         // const {error, message, data} = await addExam({exam})
// //         // console.log('message', message)
// //         if(!response || response==null || response.error){
// //             dispatch(showNotification({message : "Gagal Menambahkan Seragam", status : 0}))
// //         }else if(!response.error) {
// //             console.log("masuk")
// //             dispatch(showNotification({message : response.message, status : 1}))
// //         navigate("/ad/exams/detail/"+response.data)
// //         }else{
// //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
// //         }
// //     }
 
// //     // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
// //     //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
// //     //     // console.log(updateType)
// //     // }
// //     const updateFormValue = ({updateType, nameInput, value, newValue=null}) => {
// //         console.log('nameInput', nameInput, value)
// //         console.log('value', value, newValue)
// //         // [nameInput] = value?value:newValue
// //         // set
// //         uniformModels[nameInput] = value?value:newValue
// //         // setExam(prev => ({...prev, [nameInput]:value?value:newValue}))
// //         console.log('exam>', exam)
// //         // setSchedule( (data) =>  ({...data, [nameInput]: value}))

// //         // console.log(updateType)
// //     }

// //     const getSchoolsOptions = async () => {
// //         let { data: schools, error } = await supabase
// //             .from('schools')
// //             .select('*')
// //             console.log(schools)
// //             if(!error){
// //                 // setSchoolOptions(schools)
// //                 setSchoolOptions(
// //                     schools.map((e)=>(
// //                         // setScheduleOptions( e => {
// //                         { value:e.school_id, label: e.school_name}
                        
// //                     ))
// //                 )
// //                     console.log(schoolOptions)
// //             // //     // schedulesOptions e.name

// //             // }))
// //             // name: schedule
// //             // setScheduleOptions(schedule => {.})
// //         }
// //     }
// //     // const handledSubmit = (e) => {
// //     //     e.preventDefault()


// //     // }



// //     const schedulesOptions2 = [
// //         {name : "Today", value : "TODAY"},
// //         {name : "Yesterday", value : "YESTERDAY"},
// //         {name : "This Week", value : "THIS_WEEK"},
// //         {name : "Last Week", value : "LAST_WEEK"},
// //         {name : "This Month", value : "THIS_MONTH"},
// //         {name : "Last Month", value : "LAST_MONTH"},
// //     ]

// //     return(
// //         <>
            
// //             <TitleCard title="Tambah Seragam" topMargin="mt-2">
// //                 <form onSubmit={saveExam}>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
// //                     <InputText labelTitle="Nama Model" register={register} registerName="model_name" nameInput="model_name" updateFormValue={updateFormValue}/>
// //                     {/* <InputText labelTitle="Nama" register={register} registerName="name" nameInput="name" updateFormValue={updateFormValue}/> */}
// //                     <InputText type="file" labelTitle="Gambar Model" register={register} registerName="model_url" nameInput="model_url" updateFormValue={updateFormValue}/>
// //                     <InputTextRadio labelTitle="Jenis Kelamin" nameInput="model_gender" type="radio" options={genderOptions} register={register} registerName={'gender'} error={errors.gender} error_msg={errors.gender?.message} updateFormValue={updateFormValue}/>
// //                     {/* <InputText labelTitle="Deskripsi" register={register} registerName="subtitle" nameInput="subtitle" updateFormValue={updateFormValue}/> */}
// //                     {/* <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/> */}
// //                     {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
// //                     <div className="overflow-x-auto">
// //                         <table className="w-full table-auto">
// //                             <thead>
// //                             <tr className="bg-gray-100">
// //                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size Key</th>
// //                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
// //                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
// //                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
// //                             </tr>
// //                             </thead>
// //                             <tbody>
// //                             {sizeRows.map((row) => (
// //                                 <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
// //                                 <td className="px-4 py-3">
// //                                     <select
// //                                     value={row.sizeKey}
// //                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                     required
// //                                     >
// //                                     <option value="">Select Size</option>
// //                                     {sizeOptions.map(option => (
// //                                         <option key={option.value} value={option.value}>
// //                                         {option.label}
// //                                         </option>
// //                                     ))}
// //                                     </select>
// //                                 </td>
                                
// //                                 <td className="px-4 py-3">
// //                                     <select
// //                                     value={row.itemSize}
// //                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                     required
// //                                     >
// //                                     <option value="">Select Item Size</option>
// //                                     {itemSizeOptions.map(option => (
// //                                         <option key={option.value} value={option.value}>
// //                                         {option.label}
// //                                         </option>
// //                                     ))}
// //                                     </select>
// //                                 </td>
                                
// //                                 <td className="px-4 py-3">
// //                                     <input
// //                                     type="number"
// //                                     min="0"
// //                                     value={row.quantity}
// //                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
// //                                     placeholder="Enter quantity"
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                     required
// //                                     />
// //                                 </td>
                                
// //                                 <td className="px-4 py-3">
// //                                     <button
// //                                     type="button"
// //                                     onClick={() => removeRow(row.id)}
// //                                     disabled={sizeRows.length === 1}
// //                                     className={`p-2 rounded-md transition-colors ${
// //                                         sizeRows.length === 1
// //                                         ? 'text-gray-400 cursor-not-allowed'
// //                                         : 'text-red-600 hover:bg-red-100 hover:text-red-700'
// //                                     }`}
// //                                     >
// //                                     <TrashIcon className="w-5 h-5" />
// //                                     </button>
// //                                 </td>
// //                                 </tr>
// //                             ))}
// //                             </tbody>
// //                         </table>
// //                     </div>

// //                     <div className="flex justify-between items-center pt-4">
// //                     <button
// //                         type="button"
// //                         onClick={addRow}
// //                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
// //                     >
// //                         <PlusCircleIcon className="w-5 h-5" />
// //                         Add Row
// //                     </button>

// //                     {/* <button
// //                         type="submit"
// //                         className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     >
// //                         Generate JSON
// //                     </button> */}
// //                     </div>
// //                     {/* <SelectBox
// //                         nameInput="size_id"
// //                         options={sizeChartOptions}
// //                         labelTitle="Jenjang"
// //                         placeholder="Pilih Ukuran"
// //                         containerStyle="w-72"
// //                         // defaultValue=
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     />
// //                     <SelectBox
// //                         nameInput="size_obj"
// //                         options={ObjectsMeasurementsOptions}
// //                         labelTitle="Bagian"
// //                         placeholder="Pilih Bagian Ukuran"
// //                         containerStyle="w-72"
// //                         // defaultValue=
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     />
// //                     <InputText labelTitle="Ukuran" register={register} registerName="" nameInput="size_number" updateFormValue={updateFormValue}/>
// //                     {
// //                         otherSizeChart && (
// //                             <>
// //                                 {fields.map((field, key) => (
// //                                     <div key={field.id}>

// //                                     <SelectBox
// //                                         nameInput="size_id"
// //                                         options={sizeChartOptions}
// //                                         labelTitle="Jenjang"
// //                                         placeholder="Pilih Ukuran"
// //                                         containerStyle="w-72"
// //                                         // defaultValue=
// //                                         // labelStyle="hidden"
// //                                         // defaultValue="TODAY"
// //                                         updateFormValue={updateFormValue}
// //                                     />
// //                                     <SelectBox
// //                                         nameInput="size_obj"
// //                                         options={ObjectsMeasurementsOptions}
// //                                         labelTitle="Bagian"
// //                                         placeholder="Pilih Bagian Ukuran"
// //                                         containerStyle="w-72"
// //                                         // defaultValue=
// //                                         // labelStyle="hidden"
// //                                         // defaultValue="TODAY"
// //                                         updateFormValue={updateFormValue}
// //                                     />
// //                                     <InputText labelTitle="Ukuran" register={register} registerName="size_number" nameInput="size_number" updateFormValue={updateFormValue}/>
// //                                     <IconButton
// //                                         disabled={sizeChartFields.length === 1}
// //                                         onClick={() => removeSizeChart(index)}
// //                                         color="error"
// //                                     >
// //                                         <DeleteForeverRoundedIcon />
// //                                     </IconButton>

// //                                     </div>
// //                                 ))}

// //                                 <IconButton
// //                                     sx={{ width: "fit-content" }}
// //                                     onClick={() => appendSizeChart({ name: "" })}
// //                                     color="success"
// //                                 >
// //                                     <AddCircleRoundedIcon />
// //                                 </IconButton>
// //                             </>
// //                         )
// //                     } */}
// //                     <SelectBox
// //                         nameInput="school_id"
// //                         options={schoolOptions}
// //                         labelTitle="Jenjang"
// //                         placeholder="Pilih Jenjang"
// //                         containerStyle="w-72"
// //                         // defaultValue=
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     />
// //                     <SelectBox
// //                         nameInput="admission_ays_id"
// //                         options={admissionOptions}
// //                         labelTitle="Tahun Ajaran"
// //                         placeholder="Pilih Tahun Ajaran"
// //                         containerStyle="w-72"
// //                         // defaultValue=
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     />
// //                     {/* <SelectBox
// //                         nameInput="admission_ays_id"
// //                         options={admissionOptions}
// //                         labelTitle="Tahun Ajaran"
// //                         placeholder="Pilih Tahun Ajaran"
// //                         containerStyle="w-72"
// //                         // defaultValue=
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     /> */}
// //                     {/* <InputTextRadio labelTitle="Tipe" register={register} registerName="question_type" nameInput="question_type" type="radio" options={typeOptions} defaultValue={'MC'} updateFormValue={updateFormValue}/> */}
// //                     {/* <SelectBox 
// //                     options={schedulesOptions}
// //                     labelTitle="Period"
// //                     placeholder="Select date range"
// //                     containerStyle="w-72"
// //                     labelStyle="hidden"
// //                     // defaultValue="TODAY"
// //                     updateFormValue={updateSelectBoxValue}
// //                 /> */}
// //                     {/* <InputDateTimePicker labelTitle="Waktu Mulai" register={register} registerName="started_at" nameInput="started_at" updateFormValue={updateFormValue}/>
// //                     <InputDateTimePicker labelTitle="Waktu Selesai" register={register} registerName="ended_at" nameInput="ended_at" updateFormValue={updateFormValue}/> */}
                    
// //                     {/* <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/> */}
// //                     {/* <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/> */}
// //                     {/* <InputText labelTitle="Lokasi" register={register} registerName="location" nameInput="location" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Ruangan" register={register} registerName="room" nameInput="room" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Gambar" register={register} registerName="model_url" nameInput="model_url" updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="randomQuestion" register={register} registerName="is_random_question" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="randomAnswer" register={register} registerName="is_random_answer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     <SelectBox
// //                         nameInput="schedule_id"
// //                         options={schedulesOptions}
// //                         labelTitle="Jadwal Ujian"
// //                         placeholder="Pilih Jadwal"
// //                         containerStyle="w-72"
// //                         register={register}
// //                         registerName="schedule_id"
// //                         // labelStyle="hidden"
// //                         // defaultValue="TODAY"
// //                         updateFormValue={updateFormValue}
// //                     /> */}
// //                     {/* <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/> */}
// //                     {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
// //                 </div>
// //                 <div className="divider" ></div>

// //                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                     <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
// //                     <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
// //                     <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
// //                     </div> */}

// //                 <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
// //                 </form>
// //                 {/* onClick={addExam}  */}
// //                 {/* onClick={() => updateSchedules()} */}
// //             </TitleCard>
            
// //         </>
// //     )
// // }


// // export default UniformModelCreate;

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import TitleCard from "../../components/Cards/TitleCard";
// import { showNotification } from '../common/headerSlice';
// import InputText from '../../components/Input/InputText';
// import InputTextRadio from '../../components/Input/InputTextRadio';
// import SelectBox from "../../components/Input/SelectBox";
// import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// import supabase from "../../services/database-server";
// import { addUniformModels } from "../../services/api/uniform_models";

// function UniformModelEdit() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const id = useParams().mid
//     // const [uniformModel, setUniformModel] = useState({
//     //     model_name: "",
//     //     model_gender: "",
//     //     model_size_charts: {},
//     //     model_url: null,
//     //     school_id: "",
//     //     admission_ays_id: ""
//     // });

//     const [sizeRows, setSizeRows] = useState([
//         { id: 1, sizeKey: '', itemSize: '', quantity: '' }
//     ]);

//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [admissionOptions, setAdmissionOptions] = useState([]);
//     const [uniformModel, setUniformModel] = useState({});
//     const [genderOptions] = useState([
//         {label: "Laki-Laki", value: "male"},
//         {label: "Perempuan", value: "female"}
//     ]);

//     const [loading, setLoading] = useState(false);

//     const sizeOptions = [
//         { value: 'xs', label: 'XS' },
//         { value: 's', label: 'S' },
//         { value: 'm', label: 'M' },
//         { value: 'l', label: 'L' },
//         { value: 'xl', label: 'XL' },
//         { value: 'xxl', label: '2XL' },
//         { value: 'xxxl', label: '3XL' }
//     ];

//     const itemSizeOptions = [
//         { value: 'PB', label: 'PB' },
//         { value: 'LP', label: 'LP' },
//         { value: 'LD', label: 'LD' },
//         { value: 'PT', label: 'PT' }
//     ];

//     useEffect(() => {
//         getSchoolOptions();
//         getAdmissionOptions();
//         getUniformModel(id)
//     }, []);

//     const getUniformModel = async (id) => {
//         let {data: uniform_models, error} = await supabase.from('school_uniform_models')
//                                             .select('*, schools(school_name), admission_ays(academic_year) ')
//                                             .eq('id', id)
//                                             .is('deleted_at', null)
//                                              if(uniform_models){
//                                                 setUniformModel(uniform_models[0])
//                                              }      
//     }
//     const getSchoolOptions = async () => {
//         try {
//             const { data: schools, error } = await supabase
//                 .from('schools')
//                 .select('*')
//                 .order('school_name');
            
//             if (!error) {
//                 setSchoolOptions(
//                     schools.map(school => ({
//                         value: school.school_id,
//                         label: school.school_name
//                     }))
//                 );
//             } else {
//                 console.error("Error fetching schools:", error);
//             }
//         } catch (error) {
//             console.error("Error fetching schools:", error);
//         }
//     };

//     const getAdmissionOptions = async () => {
//         try {
//             const { data: admissions, error } = await supabase
//                 .from('admission_ays')
//                 .select('*')
//                 .order('academic_year', { ascending: false });
            
//             if (!error) {
//                 setAdmissionOptions(
//                     admissions.map(admission => ({
//                         value: admission.id,
//                         label: admission.academic_year
//                     }))
//                 );
//             } else {
//                 console.error("Error fetching admissions:", error);
//             }
//         } catch (error) {
//             console.error("Error fetching admissions:", error);
//         }
//     };

//     const addRow = () => {
//         setSizeRows(prev => [
//             ...prev,
//             { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
//         ]);
//     };

//     const removeRow = (id) => {
//         if (sizeRows.length > 1) {
//             setSizeRows(prev => prev.filter(row => row.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setSizeRows(prev =>
//             prev.map(row =>
//                 row.id === id ? { ...row, [field]: value } : row
//             )
//         );
//     };

//     const convertToOutputFormat = () => {
//         const result = {};
        
//         // Initialize all sizes with 0 values
//         sizeOptions.forEach(size => {
//             result[size.value] = {
//                 PB: 0,
//                 LD: 0,
//                 LP: 0,
//                 PT: 0
//             };
//         });

//         // Fill with actual values from form
//         sizeRows.forEach(row => {
//             if (row.sizeKey && row.itemSize && row.quantity) {
//                 const quantity = parseInt(row.quantity);
//                 if (result[row.sizeKey] && result[row.sizeKey][row.itemSize] !== undefined) {
//                     result[row.sizeKey][row.itemSize] = quantity;
//                 }
//             }
//         });

//         return result;
//     };

//     const updateFormValue = ({ nameInput, value, newValue = null }) => {
//         setUniformModel(prev => ({
//             ...prev,
//             [nameInput]: value !== undefined ? value : newValue
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check file type
//             const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//             if (!validTypes.includes(file.type)) {
//                 dispatch(showNotification({message: "Format file tidak valid. Gunakan JPEG, PNG, GIF, atau WebP.", status: 0}));
//                 e.target.value = ''; // Reset file input
//                 return;
//             }
            
//             // Check file size (max 5MB)
//             if (file.size > 5 * 1024 * 1024) {
//                 dispatch(showNotification({message: "Ukuran file terlalu besar. Maksimal 5MB.", status: 0}));
//                 e.target.value = ''; // Reset file input
//                 return;
//             }
            
//             setUniformModel(prev => ({
//                 ...prev,
//                 model_url: file
//             }));
//         }
//     };

//     const upload = async (file, modelName, schoolId) => {
//         if (!file) return null;
        
//         try {
//             const fileExtension = file.name.split('.').pop();
//             const filepath = `${modelName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExtension}`;
//             const sch_id = schoolId || 'default';

//             const { error } = await supabase
//                 .storage
//                 .from('admissions/uniform-models')
//                 .upload(`${sch_id}/${filepath}`, file, {
//                     cacheControl: '3600',
//                     upsert: false
//                 });

//             if (error) {
//                 console.error("Gagal Upload Berkas", error.message);
//                 throw error;
//             }

//             const { data } = await supabase.storage
//                 .from("admissions/uniform-models")
//                 .getPublicUrl(`${sch_id}/${filepath}`);

//             return data.publicUrl;
//         } catch (error) {
//             console.error("Upload error:", error);
//             throw error;
//         }
//     };

//     const validateForm = () => {
//         if (!uniformModel.model_name.trim()) {
//             return "Nama model harus diisi";
//         }
//         if (!uniformModel.model_code.trim()) {
//             return "Kode model harus diisi";
//         }
//         if (!uniformModel.model_gender) {
//             return "Jenis kelamin harus dipilih";
//         }
//         if (!uniformModel.model_url) {
//             return "Gambar model harus diupload";
//         }
//         if (!uniformModel.school_id) {
//             return "Jenjang harus dipilih";
//         }
//         // if (!uniformModel.admission_ays_id) {
//         //     return "Tahun ajaran harus dipilih";
//         // }

//         // Validate size chart
//         const hasValidSizeRow = sizeRows.some(row => 
//             row.sizeKey && row.itemSize && row.quantity && parseInt(row.quantity) > 0
//         );
        
//         if (!hasValidSizeRow) {
//             return "Minimal satu ukuran harus diisi dengan quantity lebih dari 0";
//         }

//         return null;
//     };

//     const saveExam = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Validate form
//         const validationError = validateForm();
//         if (validationError) {
//             dispatch(showNotification({message: validationError, status: 0}));
//             setLoading(false);
//             return;
//         }

//         try {
//             // Upload image first
//             const imageUrl = await upload(
//                 uniformModel.model_url, 
//                 uniformModel.model_name, 
//                 uniformModel.school_id
//             );

//             if (!imageUrl) {
//                 throw new Error("Gagal mengupload gambar");
//             }

//             // Prepare data
//             const outputData = convertToOutputFormat();
//             const uniformModelData = {
//                 ...uniformModel,
//                 model_size_charts: outputData,
//                 model_url: imageUrl
//             };

//             // Remove the file object from the data
//             delete uniformModelData.model_url_file;

//             console.log('Submiltting data:', uniformModelData);
//             const {admission_ays_id, ...uniformModels} = uniformModelData

//             // Submit to API
//             const response = await addUniformModels({ uniformModels});
            
//             if (response && !response.error) {
//                 dispatch(showNotification({message: response.message, status: 1}));
//                 navigate("/ad/uniform-models/detail/" + response.data);
//             } else {
//                 const errorMessage = response?.message || "Gagal Menambahkan Seragam";
//                 dispatch(showNotification({message: errorMessage, status: 0}));
//             }
//         } catch (error) {
//             console.error("Save error:", error);
//             dispatch(showNotification({
//                 message: error.message || "Gagal Menambahkan Seragam", 
//                 status: 0
//             }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <TitleCard title="Edit Seragam" topMargin="mt-2">
//             <form onSubmit={saveExam}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText 
//                         labelTitle="Nama Model" 
//                         nameInput="model_name" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_name}
//                         required
//                     />
                    
//                     <InputText 
//                         labelTitle="Kode Model" 
//                         nameInput="model_code" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_code}
//                         required
//                     />
                    
//                     <div className="form-control w-full">
//                         <label className="label">
//                             <span className="label-text">Gambar Model*</span>
//                         </label>
//                         <input 
//                             name='model_url' 
//                             type="file" 
//                             onChange={handleFileChange} 
//                             accept="image/jpeg,image/png,image/gif,image/webp"
//                             required 
//                             className="file-input file-input-bordered w-full"  
//                         />
//                         <label className="label">
//                             <span className="label-text-alt">Format: JPEG, PNG, GIF, WebP (Max 5MB)</span>
//                         </label>
//                     </div>
                    
//                     <InputTextRadio 
//                         labelTitle="Jenis Kelamin*" 
//                         nameInput="model_gender" 
//                         type="radio" 
//                         options={genderOptions} 
//                         updateFormValue={updateFormValue}
//                         required
//                     />

//                     {/* Size Chart Table */}
//                     <div className="col-span-2">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">Size Chart*</h3>
//                             <button
//                                 type="button"
//                                 onClick={addRow}
//                                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 <PlusCircleIcon className="w-5 h-5" />
//                                 Tambah Ukuran
//                             </button>
//                         </div>
                        
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto">
//                                 <thead>
//                                     <tr className="bg-gray-100">
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sizeRows.map((row) => (
//                                         <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.sizeKey}
//                                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Pilih Size</option>
//                                                     {sizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.itemSize}
//                                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Pilih Item Size</option>
//                                                     {itemSizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     value={row.quantity}
//                                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
//                                                     placeholder="0"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 />
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeRow(row.id)}
//                                                     disabled={sizeRows.length === 1}
//                                                     className={`p-2 rounded-md transition-colors ${
//                                                         sizeRows.length === 1
//                                                             ? 'text-gray-400 cursor-not-allowed'
//                                                             : 'text-red-600 hover:bg-red-100 hover:text-red-700'
//                                                     }`}
//                                                 >
//                                                     <TrashIcon className="w-5 h-5" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     <SelectBox
//                         nameInput="school_id"
//                         options={schoolOptions}
//                         labelTitle="Jenjang*"
//                         placeholder="Pilih Jenjang"
//                         containerStyle="w-full"
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.school_id}
//                         required
//                     />

//                     <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran*"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-full"
//                         // defaultValue="56e1bb5f-2af8-48a6-b2df-ab399e29921c"
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.admission_ays_id}
//                         required
//                     />
//                 </div>

//                 <div className="divider"></div>

//                 <div className="mt-16 flex justify-end gap-4">
//                     <button 
//                         type="button" 
//                         className="btn  bg-orange-400"
//                         onClick={() => navigate(-1)}
//                     >
//                         Batal
//                     </button>
//                     <button 
//                         className="btn  bg-green-700" 
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <>
//                                 <span className="loading loading-spinner"></span>
//                                 Menyimpan...
//                             </>
//                         ) : (
//                             "Simpan"
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </TitleCard>
//     );
// }

// export default UniformModelEdit;

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import TitleCard from "../../components/Cards/TitleCard";
// import { showNotification } from '../common/headerSlice';
// import InputText from '../../components/Input/InputText';
// import InputTextRadio from '../../components/Input/InputTextRadio';
// import SelectBox from "../../components/Input/SelectBox";
// import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// import supabase from "../../services/database-server";
// import { updateUniformModels } from "../../services/api/uniform_models";

// function UniformModelEdit() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const id = useParams().mid
    
//     const [uniformModel, setUniformModel] = useState({
//         model_name: "",
//         model_gender: "",
//         model_size_charts: {},
//         model_url: "",
//         school_id: "",
//         admission_ays_id: ""
//     });

//     const [sizeRows, setSizeRows] = useState([
//         { id: 1, sizeKey: '', itemSize: '', quantity: '' }
//     ]);

//     const [schoolOptions, setSchoolOptions] = useState([]);
//     const [admissionOptions, setAdmissionOptions] = useState([]);
//     const [genderOptions] = useState([
//         {label: "Laki-Laki", value: "male"},
//         {label: "Perempuan", value: "female"}
//     ]);

//     const sizeOptions = [
//         { value: 'xs', label: 'XS' },
//         { value: 's', label: 'S' },
//         { value: 'm', label: 'M' },
//         { value: 'l', label: 'L' },
//         { value: 'xl', label: 'XL' },
//         { value: 'xxl', label: '2XL' },
//         { value: 'xxxl', label: '3XL' }
//     ];

//     const itemSizeOptions = [
//         { value: 'PB', label: 'PB' },
//         { value: 'LP', label: 'LP' },
//         { value: 'LD', label: 'LD' },
//         { value: 'PT', label: 'PT' }
//     ];

//     useEffect(() => {
//         getSchoolOptions();
//         getAdmissionOptions();
//         getSizeOptions()
//         getItemSizeOptions()
//         getUniformModels(id)
//     }, []);

//     const getUniformModels = async (id) => {
//         let {data: uniform_models, error} = await supabase.from('school_uniform_models')
//                                             .select('*, schools(school_name), admission_ays(academic_year) ')
//                                             .eq('id', id)
//                                             .is('deleted_at', null)
//                                              if(uniform_models){
//                                                 setUniformModel(uniform_models)
//                                              }      
//     }

//     const getSizeOptions = () => {

//     }

//     const getItemSizeOptions = () => {
        
//     }

//     const getSchoolOptions = async () => {
//         try {
//             const { data: schools, error } = await supabase
//                 .from('schools')
//                 .select('*');
            
//             if (!error) {
//                 setSchoolOptions(
//                     schools.map(school => ({
//                         value: school.school_id,
//                         label: school.school_name
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching schools:", error);
//         }
//     };

//     const getAdmissionOptions = async () => {
//         try {
//             const { data: admissions, error } = await supabase
//                 .from('admission_ays')
//                 .select('*');
            
//             if (!error) {
//                 setAdmissionOptions(
//                     admissions.map(admission => ({
//                         value: admission.id,
//                         label: admission.academic_year
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("Error fetching admissions:", error);
//         }
//     };

//     const addRow = () => {
//         setSizeRows(prev => [
//             ...prev,
//             { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
//         ]);
//     };

//     const removeRow = (id) => {
//         if (sizeRows.length > 1) {
//             setSizeRows(prev => prev.filter(row => row.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setSizeRows(prev =>
//             prev.map(row =>
//                 row.id === id ? { ...row, [field]: value } : row
//             )
//         );
//     };

//     const convertToOutputFormat = () => {
//         const result = {};
        
//         // Initialize all sizes with 0 values
//         sizeOptions.forEach(size => {
//             result[size.value] = {
//                 PB: 0,
//                 LD: 0,
//                 LP: 0,
//                 PT: 0
//             };
//         });

//         // Fill with actual values from form
//         sizeRows.forEach(row => {
//             if (row.sizeKey && row.itemSize && row.quantity) {
//                 result[row.sizeKey][row.itemSize] = parseInt(row.quantity) || 0;
//             }
//         });

//         return result;
//     };

//     const updateFormValue = ({ nameInput, value, newValue=null }) => {
//         setUniformModel(prev => ({
//             ...prev,
//             [nameInput]: value?value:newValue
//         }));
//         console.log(nameInput, value, newValue, uniformModel)
//     };
//     const upload = async (file, name, id ) => {

//         const filepath = `${name}-${Date.now()}`
//         const sch_id = id
//         const { data_, error_ } = await supabase
//             .storage
//             .from('admissions/uniform-models')
//             .upload(sch_id + "/" + filepath, file,
//             {cacheControl: '3600', upsert: true}
//             )
//         if (error_) {
//         ////console.error("Gagal Upload Berkas", error_.message)
//         return null
//         }
//         const { data } = await supabase.storage.from("admissions/uniform-models").getPublicUrl(sch_id+ "/" +filepath)
//         const data_url = {
//         path: data.publicUrl
//         }
//         ////console.log(data.publicUrl)
//         // setBerkasUrl(data.publicUrl)
//         // setBerkasUrl((data.publicUrl).toString())
//         // if(name == "Bird-Certificate"){
//         //   berkasUrl.a = data.publicUrl.toString()
//         // }
//         // if(name == "KK"){
//         //   berkasUrl.b = data.publicUrl.toString()
//         // }
//         // if(name == "Parent-KTP"){
//         //   berkasUrl.c = data.publicUrl.toString()
//         // }
//         // if(name == "Pas-Photo"){
//         //   berkasUrl.d = data.publicUrl.toString()
//         // }
//         // if(name == "Surat-Kesanggupan"){
//         //   berkasUrl.e = data.publicUrl.toString()
//         // }
//         // if(name == "Syahadah"){
//         //   berkasUrl.f = data.publicUrl.toString()
//         // }
//         // if(name == "Photo-Sampul-Ijazah"){
//         //   berkasUrl.g = data.publicUrl.toString()
//         // }
//         // berkasUrl.a = data.publicUrl.toString()
//         // ////console.log(berkasUrl)
//         return data.publicUrl??null
//         // const { data, error } = await supabase.storage.from('participant-documents').createSignedUrl(participant_id+ "/" +filepath, 3600)

//         // const path = {
//         //   signedUrl: data.signedUrl.toString()?? ""
//         // } 

//         // if (data) {
//         //   ////console.log('signedUrl > ', data.signedUrl)
//         //   ////console.log('data_ > ', data_)
//         //   return path
//         // }
//     }

//     const saveExam = async (e) => {
//         e.preventDefault();
        
//         const outputData = convertToOutputFormat();
//         const uniformModelData = {
//             ...uniformModel,
//             model_size_charts: outputData,
//             model_url: await upload(uniformModel.model_url)
//         };

//         console.log('uniformModel', uniformModel)

//         // Validation
//         // if (!uniformModelData.model_name || !uniformModelData.model_gender || 
//         //     !uniformModelData.school_id || !uniformModelData.admission_ays_id) {
//         //     dispatch(showNotification({message: "Gagal Menambahkan Seragam. Data tidak valid.", status: 0}));
//         //     return;
//         // }

//         try {
//             const response = await updateUniformModels({ uniformModel: uniformModelData });
            
//             if (response && !response.error) {
//                 dispatch(showNotification({message: response.message, status: 1}));
//                 navigate("/ad/uniform-models/detail/" + response.data);
//             } else {
//                 dispatch(showNotification({message: "Gagal Menambahkan Seragam", status: 0}));
//             }
//         } catch (error) {
//             dispatch(showNotification({message: "Gagal Menambahkan Seragam", status: 0}));
//         }
//     };

//     return (
//         <TitleCard title="Edit Seragam" topMargin="mt-2">
//             <form onSubmit={saveExam}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText 
//                         labelTitle="Nama Model" 
//                         nameInput="model_name" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_name}
//                     />
                    
//                     <InputText 
//                         type="file" 
//                         labelTitle="Gambar Model" 
//                         nameInput="model_url" 
//                         updateFormValue={updateFormValue}
//                         defaultValue={uniformModel.model_url}
//                     />
                    
//                     <InputTextRadio 
//                         labelTitle="Jenis Kelamin" 
//                         nameInput="model_gender" 
//                         type="radio" 
//                         options={genderOptions} 
//                         defaultValue={uniformModel.model_gender}
//                         updateFormValue={updateFormValue}
//                     />

//                     {/* Size Chart Table */}
//                     <div className="col-span-2">
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto">
//                                 <thead>
//                                     <tr className="bg-gray-100">
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size Key</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
//                                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {sizeRows.map((row) => (
//                                         <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.sizeKey}
//                                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Select Size</option>
//                                                     {sizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <select
//                                                     value={row.itemSize}
//                                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
//                                                     // defaultValue={uniformModel.}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 >
//                                                     <option value="">Select Item Size</option>
//                                                     {itemSizeOptions.map(option => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     value={row.quantity}
//                                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
//                                                     placeholder="Enter quantity"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                     required
//                                                 />
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeRow(row.id)}
//                                                     disabled={sizeRows.length === 1}
//                                                     className={`p-2 rounded-md transition-colors ${
//                                                         sizeRows.length === 1
//                                                             ? 'text-gray-400 cursor-not-allowed'
//                                                             : 'text-red-600 hover:bg-red-100 hover:text-red-700'
//                                                     }`}
//                                                 >
//                                                     <TrashIcon className="w-5 h-5" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="flex justify-between items-center pt-4">
//                             <button
//                                 type="button"
//                                 onClick={addRow}
//                                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 <PlusCircleIcon className="w-5 h-5" />
//                                 Add Row
//                             </button>
//                         </div>
//                     </div>

//                     <SelectBox
//                         nameInput="school_id"
//                         options={schoolOptions}
//                         labelTitle="Jenjang"
//                         placeholder="Pilih Jenjang"
//                         containerStyle="w-72"
//                         defaultValue={uniformModel.school_id}
//                         updateFormValue={updateFormValue}
//                     />

//                     <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-72"
//                         defaultValue={uniformModel.admission_ays_id}
//                         updateFormValue={updateFormValue}
//                     />
//                 </div>

//                 <div className="divider"></div>

//                 <div className="mt-16">
//                     <button className="btn btn-primary float-right" type="submit">
//                         Simpan
//                     </button>
//                 </div>
//             </form>
//         </TitleCard>
//     );
// }

// export default UniformModelEdit


// import moment from "moment"
// import { useTransition, useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import TitleCard from "../../components/Cards/TitleCard"
// import { showNotification } from '../common/headerSlice'
// import InputText from '../../components/Input/InputText'
// import InputTextRadio from '../../components/Input/InputTextRadio'
// import SelectBox from "../../components/Input/SelectBox"
// import TextAreaInput from '../../components/Input/TextAreaInput'
// import ToogleInput from '../../components/Input/ToogleInput'
// import InputDateTime from "../../components/Input/InputDateTime"
// import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   IconButton,
//   Radio,
//   RadioGroup,
//   TextField,
// } from "@mui/material";
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm, useFieldArray } from "react-hook-form"

// import supabase from "../../services/database-server"
// import {addExam} from "../../services/api/exams"

// import DateTimePicker from 'react-datetime-picker'
// import { useNavigate, useParams } from "react-router-dom"
// import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// // import DatePicker from 'rsuite/DatePicker';
// // import 'rsuite/DatePicker/styles/index.css';
// // importing styling datepicker
// // import "./css/react-datepicker/react-datepicker.css"

// import axios from "axios"
// import schools from "../../services/api/schools"
// import { root } from "postcss"
// import { addUniformModels } from "../../services/api/uniform_models"

// // import supabase from "../services/database"

// // type ValuePiece = Date | null

// // type Value = ValuePiece | [ValuePiece, ValuePiece]
// export const scheduleSchema = z.object({
//     name: z.string().min(1, "Nama wajib diisi"),        
//     subtitle: z.string().min(1, "Deskripsi wajib diisi"),        
//     icon: z.string().min(1, "Ikon wajib diupload"),        
//     // started_at: z.string().min(1, "Waktu Mulai wajid diisi"),
//     ended_at: z.string().min(1, "Waktu Selesai wajid diisi"),
//     scheme: z.string().min(1, "Deskripsi wajib diisi"),        
//     question_type: z.string().min(1, "Deskripsi wajib diisi"),        
//     location: z.string().min(1, "Deskripsi wajib diisi"),        
//     room: z.string().min(1, "Deskripsi wajib diisi"),
//     schedule_id: z.string().min(1, "Jenjang wajib diisi")
// })

// export const scheduleDefaultValues = {
//   name: "",
//   subtitle: "",
// //   icon: "",
//   scheme: "",
//   question_type: "",
//   location: "",
//   room: "",
//   started_at: "",
//   ended_at: "",
//   schedule_id: ""  
// };


// function UniformModelCreate(){

//     const dispatch = useDispatch()
//     // const navigate = useNavigate()
//     const [value, onChange] = useState(new Date())
    
//     const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "", schedule_id: "" })
//     const [uniformModels, setUniformModels] = useState({})
//     const [model_name, setModelName] = useState("")
//     const [model_gender, setModelGender] = useState("")
//     const [model_size_charts, setModelSizeCharts] = useState({})
//     const [model_url, setModelUrl] = useState("")
//     const [school_id, setSchoolId] = useState("")
//     const [ isPending, startTransition ] = useTransition()
//     const [sizeChartOptions, setSizeChartOptions] = useState([{label: "XS", value: "xs"}, {label: "S", value: "s"}, {label: "M", value: "m"}, {label: "L", value: "l"}, {label: "XL", value: "xl"}, {label: "XXL", value: "xxl"}, {label: "XXXL", value: "xxxl"}, {label: "S", value: "s"}])
//     const [ObjectsMeasurementsOptions, setObjectMeasurement] = useState([{label: "PB", value: "PB"}, {label: "LD", value: "LD"},{label: "LP", value: "LP"},{label: "PT", value: "PT"}])
//     // exam_category_id: "",
//     // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
//     const [schemeOptions, setSchemeOptions] = useState([{label: "Online", value: "online"},{label: "Offline", value: "offline"}])
//     const [typeOptions, setTypeOptions] = useState([{label: "Pilihan Ganda", value: "MC"},{label: "Essay Singkat", value: "ES"},{label: "Benar Salah", value: "BS"},{label: "Essay", value: "E"}])
//     const [genderOptions, setGenderOptions] = useState([{label: "Laki-Laki", value: "male"},{label: "Perempuan", value: "female"}])
//     const [schoolOptions, setSchoolOptions] = useState([])
//     const [admissionOptions, setAdmissionOptions] = useState([])
//     const [schedulesOptions, setScheduleOptions] = useState([])
//     const [selectedOption, setSelectedOption] = useState(null);
//     const checked = false
//     const navigate = useNavigate()
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         control
//       } = useForm({
//         resolver: zodResolver(scheduleSchema),
//         defaultValues: scheduleDefaultValues,
//       });

//     const {
//         fields: sizeChartFields,
//         replace: replaceSizeChart,
//         append: appendSizeChart,
//         remove: removeSizeChart,
//     } = useFieldArray({
//         control,
//         name: "model_size_charts",
//     });

//     const [sizeRows, setSizeRows] = useState([
//         { id: 1, sizeKey: '', itemSize: '', quantity: '' }
//     ]);

//     const sizeOptions = [
//         { value: 'xs', label: 'XS' },
//         { value: 's', label: 'S' },
//         { value: 'm', label: 'M' },
//         { value: 'l', label: 'L' },
//         { value: 'xl', label: 'XL' },
//         { value: 'xxl', label: '2XL' },
//         { value: 'xxxl', label: '3XL' },
//         { value: '4xl', label: '4XL' }
//     ];

//     const itemSizeOptions = [
//         { value: 'PB', label: 'PB' },
//         { value: 'LP', label: 'LP' },
//         { value: 'LD', label: 'LD' },
//         { value: 'PT', label: 'PT' }
//     ];

//     const addRow = () => {
//         setSizeRows(prev => [
//         ...prev,
//         { id: Date.now(), sizeKey: '', itemSize: '', quantity: '' }
//         ]);
//     };

//     const removeRow = (id) => {
//         if (sizeRows.length > 1) {
//         setSizeRows(prev => prev.filter(row => row.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setSizeRows(prev =>
//         prev.map(row =>
//             row.id === id ? { ...row, [field]: value } : row
//         )
//         );
//     };

//     // Convert the rows data to the desired JSON format
//     const convertToOutputFormat = () => {
//         const result = {};
        
//         sizeOptions.forEach(size => {
//         result[size.value] = {
//             PB: 0,
//             LD: 0,
//             LP: 0,
//             PT: 0
//         };
//         });

//         sizeRows.forEach(row => {
//         if (row.sizeKey && row.itemSize && row.quantity) {
//             if (!result[row.sizeKey]) {
//             result[row.sizeKey] = {};
//             }
//             result[row.sizeKey][row.itemSize] = parseInt(row.quantity) || 0;
//         }
//         });

//         return result;
//     };
//     // const {id} = useParams()
//     // useEffect(() => {
//     //     if (otherSizeChart) {
//     //     replaceSizeChart([{ name: "" }]);
//     //     }
//     // }, [otherSizeChart, replaceSizeChart]);

//     useEffect( () => {
//         // if(schoolOptions) {

//             getSchoolsOptions()
//             getAdmissionOptions()
//         // }
//         // getSchedule()
//         // console.log(id)
//         console.log(exam)
//     },[schoolOptions])

//     const getAdmissionOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('admission_ays')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 // setSchoolOptions(schools)
//                 setSchoolOptions(
//                     schools.map((e)=>(
//                         // setScheduleOptions( e => {
//                         { value:e.id, label: e.academic_year}
                        
//                     ))
//                 )
//                     console.log(schoolOptions)
//     }

//     // Call API to update profile settings changes
//     const saveExam = async (e) => {
//         e.preventDefault()
//         const outputData = convertToOutputFormat();
//         console.log('Size Chart JSON Output:', outputData);
//         const uniformModels = {
//             model_name: model_name,
//             model_gender: model_gender,
//             model_size_charts: outputData,
//             school_id: school_id, 
//             file: model_url
//         }
//         console.log('exam in ad', model_name, model_name, model_size_charts, school_id)
//         if(model_name=="" || model_name=="" || model_size_charts=="" || school_id=="" ){
//             dispatch(showNotification({message : "Gagal Menambahkan Seragam. Data tidak valid.", status : 0}))
//             return
//         }
//         // const {school_id, ...newUniformModels} = uniformModels
//         const response = {}
//         startTransition(() => {

//             setTimeout( async() => {
    
//                 response = await addUniformModels({uniformModels})
                
//                 console.log('response', response)
//             }, 2000);
//         })
//         // const {error, message, data} = await addExam({exam})
//         // console.log('message', message)
//         if(!response || response==null || response.error){
//             dispatch(showNotification({message : "Gagal Menambahkan Seragam", status : 0}))
//         }else if(!response.error) {
//             console.log("masuk")
//             dispatch(showNotification({message : response.message, status : 1}))
//         navigate("/ad/exams/detail/"+response.data)
//         }else{
//             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
//         }
//     }
 
//     // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
//     //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
//     //     // console.log(updateType)
//     // }
//     const updateFormValue = ({updateType, nameInput, value, newValue=null}) => {
//         console.log('nameInput', nameInput, value)
//         console.log('value', value, newValue)
//         // [nameInput] = value?value:newValue
//         // set
//         uniformModels[nameInput] = value?value:newValue
//         // setExam(prev => ({...prev, [nameInput]:value?value:newValue}))
//         console.log('exam>', exam)
//         // setSchedule( (data) =>  ({...data, [nameInput]: value}))

//         // console.log(updateType)
//     }

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 // setSchoolOptions(schools)
//                 setSchoolOptions(
//                     schools.map((e)=>(
//                         // setScheduleOptions( e => {
//                         { value:e.school_id, label: e.school_name}
                        
//                     ))
//                 )
//                     console.log(schoolOptions)
//             // //     // schedulesOptions e.name

//             // }))
//             // name: schedule
//             // setScheduleOptions(schedule => {.})
//         }
//     }
//     // const handledSubmit = (e) => {
//     //     e.preventDefault()


//     // }



//     const schedulesOptions2 = [
//         {name : "Today", value : "TODAY"},
//         {name : "Yesterday", value : "YESTERDAY"},
//         {name : "This Week", value : "THIS_WEEK"},
//         {name : "Last Week", value : "LAST_WEEK"},
//         {name : "This Month", value : "THIS_MONTH"},
//         {name : "Last Month", value : "LAST_MONTH"},
//     ]

//     return(
//         <>
            
//             <TitleCard title="Tambah Seragam" topMargin="mt-2">
//                 <form onSubmit={saveExam}>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                     <InputText labelTitle="Nama Model" register={register} registerName="model_name" nameInput="model_name" updateFormValue={updateFormValue}/>
//                     {/* <InputText labelTitle="Nama" register={register} registerName="name" nameInput="name" updateFormValue={updateFormValue}/> */}
//                     <InputText type="file" labelTitle="Gambar Model" register={register} registerName="model_url" nameInput="model_url" updateFormValue={updateFormValue}/>
//                     <InputTextRadio labelTitle="Jenis Kelamin" nameInput="model_gender" type="radio" options={genderOptions} register={register} registerName={'gender'} error={errors.gender} error_msg={errors.gender?.message} updateFormValue={updateFormValue}/>
//                     {/* <InputText labelTitle="Deskripsi" register={register} registerName="subtitle" nameInput="subtitle" updateFormValue={updateFormValue}/> */}
//                     {/* <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/> */}
//                     {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
//                     <div className="overflow-x-auto">
//                         <table className="w-full table-auto">
//                             <thead>
//                             <tr className="bg-gray-100">
//                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size Key</th>
//                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Size</th>
//                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
//                                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {sizeRows.map((row) => (
//                                 <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
//                                 <td className="px-4 py-3">
//                                     <select
//                                     value={row.sizeKey}
//                                     onChange={(e) => handleInputChange(row.id, 'sizeKey', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     required
//                                     >
//                                     <option value="">Select Size</option>
//                                     {sizeOptions.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                         {option.label}
//                                         </option>
//                                     ))}
//                                     </select>
//                                 </td>
                                
//                                 <td className="px-4 py-3">
//                                     <select
//                                     value={row.itemSize}
//                                     onChange={(e) => handleInputChange(row.id, 'itemSize', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     required
//                                     >
//                                     <option value="">Select Item Size</option>
//                                     {itemSizeOptions.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                         {option.label}
//                                         </option>
//                                     ))}
//                                     </select>
//                                 </td>
                                
//                                 <td className="px-4 py-3">
//                                     <input
//                                     type="number"
//                                     min="0"
//                                     value={row.quantity}
//                                     onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
//                                     placeholder="Enter quantity"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     required
//                                     />
//                                 </td>
                                
//                                 <td className="px-4 py-3">
//                                     <button
//                                     type="button"
//                                     onClick={() => removeRow(row.id)}
//                                     disabled={sizeRows.length === 1}
//                                     className={`p-2 rounded-md transition-colors ${
//                                         sizeRows.length === 1
//                                         ? 'text-gray-400 cursor-not-allowed'
//                                         : 'text-red-600 hover:bg-red-100 hover:text-red-700'
//                                     }`}
//                                     >
//                                     <TrashIcon className="w-5 h-5" />
//                                     </button>
//                                 </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className="flex justify-between items-center pt-4">
//                     <button
//                         type="button"
//                         onClick={addRow}
//                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                         <PlusCircleIcon className="w-5 h-5" />
//                         Add Row
//                     </button>

//                     {/* <button
//                         type="submit"
//                         className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Generate JSON
//                     </button> */}
//                     </div>
//                     {/* <SelectBox
//                         nameInput="size_id"
//                         options={sizeChartOptions}
//                         labelTitle="Jenjang"
//                         placeholder="Pilih Ukuran"
//                         containerStyle="w-72"
//                         // defaultValue=
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     />
//                     <SelectBox
//                         nameInput="size_obj"
//                         options={ObjectsMeasurementsOptions}
//                         labelTitle="Bagian"
//                         placeholder="Pilih Bagian Ukuran"
//                         containerStyle="w-72"
//                         // defaultValue=
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     />
//                     <InputText labelTitle="Ukuran" register={register} registerName="" nameInput="size_number" updateFormValue={updateFormValue}/>
//                     {
//                         otherSizeChart && (
//                             <>
//                                 {fields.map((field, key) => (
//                                     <div key={field.id}>

//                                     <SelectBox
//                                         nameInput="size_id"
//                                         options={sizeChartOptions}
//                                         labelTitle="Jenjang"
//                                         placeholder="Pilih Ukuran"
//                                         containerStyle="w-72"
//                                         // defaultValue=
//                                         // labelStyle="hidden"
//                                         // defaultValue="TODAY"
//                                         updateFormValue={updateFormValue}
//                                     />
//                                     <SelectBox
//                                         nameInput="size_obj"
//                                         options={ObjectsMeasurementsOptions}
//                                         labelTitle="Bagian"
//                                         placeholder="Pilih Bagian Ukuran"
//                                         containerStyle="w-72"
//                                         // defaultValue=
//                                         // labelStyle="hidden"
//                                         // defaultValue="TODAY"
//                                         updateFormValue={updateFormValue}
//                                     />
//                                     <InputText labelTitle="Ukuran" register={register} registerName="size_number" nameInput="size_number" updateFormValue={updateFormValue}/>
//                                     <IconButton
//                                         disabled={sizeChartFields.length === 1}
//                                         onClick={() => removeSizeChart(index)}
//                                         color="error"
//                                     >
//                                         <DeleteForeverRoundedIcon />
//                                     </IconButton>

//                                     </div>
//                                 ))}

//                                 <IconButton
//                                     sx={{ width: "fit-content" }}
//                                     onClick={() => appendSizeChart({ name: "" })}
//                                     color="success"
//                                 >
//                                     <AddCircleRoundedIcon />
//                                 </IconButton>
//                             </>
//                         )
//                     } */}
//                     <SelectBox
//                         nameInput="school_id"
//                         options={schoolOptions}
//                         labelTitle="Jenjang"
//                         placeholder="Pilih Jenjang"
//                         containerStyle="w-72"
//                         // defaultValue=
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     />
//                     <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-72"
//                         // defaultValue=
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     />
//                     {/* <SelectBox
//                         nameInput="admission_ays_id"
//                         options={admissionOptions}
//                         labelTitle="Tahun Ajaran"
//                         placeholder="Pilih Tahun Ajaran"
//                         containerStyle="w-72"
//                         // defaultValue=
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     /> */}
//                     {/* <InputTextRadio labelTitle="Tipe" register={register} registerName="question_type" nameInput="question_type" type="radio" options={typeOptions} defaultValue={'MC'} updateFormValue={updateFormValue}/> */}
//                     {/* <SelectBox 
//                     options={schedulesOptions}
//                     labelTitle="Period"
//                     placeholder="Select date range"
//                     containerStyle="w-72"
//                     labelStyle="hidden"
//                     // defaultValue="TODAY"
//                     updateFormValue={updateSelectBoxValue}
//                 /> */}
//                     {/* <InputDateTimePicker labelTitle="Waktu Mulai" register={register} registerName="started_at" nameInput="started_at" updateFormValue={updateFormValue}/>
//                     <InputDateTimePicker labelTitle="Waktu Selesai" register={register} registerName="ended_at" nameInput="ended_at" updateFormValue={updateFormValue}/> */}
                    
//                     {/* <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/> */}
//                     {/* <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/> */}
//                     {/* <InputText labelTitle="Lokasi" register={register} registerName="location" nameInput="location" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Ruangan" register={register} registerName="room" nameInput="room" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Gambar" register={register} registerName="model_url" nameInput="model_url" updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="randomQuestion" register={register} registerName="is_random_question" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="randomAnswer" register={register} registerName="is_random_answer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
//                     <SelectBox
//                         nameInput="schedule_id"
//                         options={schedulesOptions}
//                         labelTitle="Jadwal Ujian"
//                         placeholder="Pilih Jadwal"
//                         containerStyle="w-72"
//                         register={register}
//                         registerName="schedule_id"
//                         // labelStyle="hidden"
//                         // defaultValue="TODAY"
//                         updateFormValue={updateFormValue}
//                     /> */}
//                     {/* <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/> */}
//                     {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
//                 </div>
//                 <div className="divider" ></div>

//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
//                     </div> */}

//                 <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
//                 </form>
//                 {/* onClick={addExam}  */}
//                 {/* onClick={() => updateSchedules()} */}
//             </TitleCard>
            
//         </>
//     )
// }


// export default UniformModelCreate;