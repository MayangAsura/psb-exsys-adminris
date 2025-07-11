import React from "react";
import ExamItemCover from "./ExamItemCover";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ExamItem = (props) => {
  const { icon, name, status, location, schedule_name, started_at, id } = props.exam;
  const navigate = useNavigate()
  return (
    <div className="w-full lg:w-1/2">
      <div className="my-4 md:mx-4 shadow p-6 rounded-md bg-white group hover:shadow-md">
        <ExamItemCover icon={icon} title={name} />
        <div className="flex flex-col">
          <div className="flex flex-col gap-1 my-3 mr-2">
            <p className="text-sm  font-bold text-gray-600">Status</p>
            <p className="text-lg text-gray-400">{status?? 'Belum Ujian'}</p>
          </div>
          <div className="flex flex-col my-3 mr-2">
            <p className="text-sm  font-bold text-gray-600">Jadwal Ujian</p>
            <p className="text-lg text-gray-400">{schedule_name?? 'Seleksi PSB SDIT RABBAANII'}</p>
          </div>
          <div className="flex flex-col mr-2">
            <p className="text-base  font-bold text-gray-600">Lokasi Ujian</p>
            <p className="text-lg text-gray-400">{location?? 'SDIT RABBAANII'}</p>
          </div>
          {status!=='done' && (
          <button className="flex flex-1 justify-center items-center bg-green-600 rounded-md py-5 px-2 mt-10 hover:bg-black-200" onClick={navigate(`/u/exam/${id}/show`)}>
              <FaPencilAlt className="mr-1 text-center text-base" /> Mulai
          </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExamItem;
