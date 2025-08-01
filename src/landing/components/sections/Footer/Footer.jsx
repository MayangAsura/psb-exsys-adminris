import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white p-4 absolute bottom-0 left-0 w-full">
      <div className="container px-4">
        <p className="text-sm text-gray-400 text-center">
          Copyright @
          <a
            className="text-green-600"
            href="https://rabbaanii.sch.id/"
            rel="nofollow"
          >
            {" "}
            Rabbaanii Islamic School
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
