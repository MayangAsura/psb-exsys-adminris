import React from "react";
import cover from "../../../images/cover-image.jpg";
import { TbHome } from "react-icons/tb";

const ProfileCover = ({page}) => {
  return (
    <div className="h-10 w-full object-cover object-center bg-gray-100 shadow-gray-500">
        <span className="h-10 flex flex-row justify-start items-center gap-2 mx-10 text-2xl py-5">
          <a href="/" className="flex flex-row gap-2 text-sm">
            <TbHome className=""/> 
            {/* <span className="flex-none"></span>  */}
          </a>
          <a href="/" className="flex flex-none gap-2 text-sm">
            / {page}
            {/* <span className="flex-none"></span>  */}
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
