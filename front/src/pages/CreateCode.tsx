import React from "react";

import { Box } from "@chakra-ui/react";
import CodeEditor from "../components/program/CodeEditor";
export default function CreateCode(props) {
  return (
    <div className="mt-20 mx-6">
      <Box>
        <div className="flex justify-center mb-6">
          <h1 className="font-semibold text-xl ">Create Program</h1>
        </div>
        <CodeEditor />
      </Box>
    </div>
  );
}
