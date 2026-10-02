import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { createProgram } from "../../api/programs";
import { getSession } from "../../services/sessionService";

interface CreateCodeProps {
  initialCode: string;
  initialLanguage: string;
  token: string;

  inputType: string;
  outputType: string;
}

const CreateCode: React.FC<CreateCodeProps> = ({
  initialCode,
  initialLanguage,
  token,
  inputType,
  outputType,
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [name, setName] = useState<string>("Untitled Program");

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
      inputFileType: inputType,
      outputFileType: outputType,
    };

    try {
      const sessionToken = getSession();

      const create = await createProgram(sessionToken, content);

      window.location.href = "/";
      toast.success(`${name} created successfully`);
    } catch (error) {
      console.error("Error creating code:", error);
      toast.error(`Failed to create ${name}`);
    }
  };

  return (
    <Box>
      <input
        className="font-medium rounded px-2 outline-none"
        type="text"
        value={name}
        onChange={handleChange}
      />
      <summary
        className="btn mb-2 px-2 min-h-0 h-6 "
        onClick={() => handleSave()}
      >
        Create Code
      </summary>
    </Box>
  );
};

export default CreateCode;
