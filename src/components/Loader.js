import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <div
      className="
        fixed inset-0 
        flex flex-col items-center justify-center 
        backdrop-blur-sm bg-white/20
        z-50
        pointer-events-auto
      "
      style={{
        pointerEvents: "all", // block user clicks
      }}
    >
      <div className="flex flex-col items-center">
        <Oval
          height={60}
          width={60}
          color="#2563eb"
          secondaryColor="#93c5fd"
          strokeWidth={4}
          visible={true}
          ariaLabel="oval-loading"
        />
      </div>
    </div>
  );
};

export default Loader;
