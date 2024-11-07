import React from "react";
import { LoaderCircle } from "lucide-react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full py-8 mx-auto text-purple-600">
      <LoaderCircle className="w-8 h-8  animate-spin" />{" "}
    </div>
  );
}

export default Loader;
