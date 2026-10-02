import { useState } from "react";
import { Box } from "@chakra-ui/react";
import RunCodeButton from "./RunButton";

const Output = ({
  editorRef,
  language,
  uploadedFile,
  inputType,
  outputType,
}) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <Box w="50%">
      <RunCodeButton
        editorRef={editorRef}
        language={language}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
        setOutput={setOutput}
        uploadedFile={uploadedFile}
        inputType={inputType} // Pass inputType
        outputType={outputType} // Pass outputType
      />
      <Box
        height="75vh"
        p={16}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        backgroundColor={"#1E1E1E"}
        borderColor={isError ? "red.500" : "#333"}
        overflow="auto" // Add overflow auto to handle scroll
        whiteSpace="pre-wrap" // Preserve whitespace and wrap text
      >
        <div className="text-sm font-normal">{output}</div>
      </Box>
    </Box>
  );
};

export default Output;
