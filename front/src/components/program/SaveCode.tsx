import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { createProgram, updateProgram } from "../../api/programs";
import { getSession } from "../../services/sessionService";

interface SaveCodeProps {
  initialCode: string;
  initialLanguage: string;
  token: string;
  programData: any;
  isModifiable: boolean;
  inputFileType: string;
  outputFileType: string;
}

const SaveCode: React.FC<SaveCodeProps> = ({
  initialCode,
  initialLanguage,
  token,
  programData,
  isModifiable,
  inputFileType,
  outputFileType,
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [name, setName] = useState<string>(programData.name);

  useEffect(() => {
    setCode(initialCode);
    setLanguage(initialLanguage);
  }, [initialCode, initialLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    const content = {
      name: name,
      content: code,
      language: language,
      inputFileType: inputFileType,
      outputFileType: outputFileType,
    };

    try {
      const sessionToken = getSession();

      programData.name = name;
      const create = await updateProgram(
        sessionToken,
        programData._id,
        content
      );

      toast.success(`${name} saved successfully`);
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error(`Failed to save ${name}`);
    }
  };

  return (
    <Box>
      <input
        className="font-medium rounded px-2 outline-none"
        type="text"
        value={name}
        onChange={handleChange}
        disabled={!isModifiable}
      />
      {isModifiable && (
        <Button
          className="btn mb-2 px-2 min-h-0 h-6"
          onClick={() => handleSave()}
        >
          Save Code
        </Button>
      )}
    </Box>
  );
};

export default SaveCode;
