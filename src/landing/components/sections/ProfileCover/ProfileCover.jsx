import React from "react";
import cover from "../../../images/cover-image.jpg";
import { TbHome } from "react-icons/tb";

const ProfileCover = () => {
  return (
    <div className="h-20 w-full object-cover object-center bg-gray-100 shadow-gray-500">
        <span className="flex flex-row  gap-2 mx-20 text-2xl py-5">
          <a href="#">
            <TbHome className="flex mr-5"/> 
            <span className="flex-none"></span> / Beranda
          </a>
          </span>
        {/* <span className="h1 text-2xl my-5 justify-start items-center">Exam System Rabbaanii Islamic School</span> */}
      {/* <img
        src={cover}
        alt="cover"
        className="w-full h-full object-cover object-center"
      /> */}
    </div>
  );
};

export default ProfileCover;
