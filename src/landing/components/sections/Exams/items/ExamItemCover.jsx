import React from "react";
import { FaTasks } from "react-icons/fa";
// import cover from "../../../images/cover-image.jpg";

const ExamItemCover = (props) => {
    const icon  = props.icon
    const title  = props.title
  return (
    <div className="h-24 w-full rounded-md bg-green-600" >
        <div className="relative w-16 h-16 flex m-5 -top-5 -bottom-3 items-center justify-center rounded-md text-3xl mb-5 bg-purple-100 text-green-600 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
          {!icon && (<FaTasks/>)}
        </div>
            <h3 className="text-2xl m-5 -mt-8 flex-wrap -2lg font-medium text-gray-900 mb-2">{title}</h3>
        <div>
        </div>
      {/* <img
        src={cover}
        alt="cover"
        className="w-full h-full object-cover object-center"
      /> */}
    </div>
  );
};

export default ExamItemCover;
