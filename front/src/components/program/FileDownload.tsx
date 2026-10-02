import React from "react";
import axios from "axios"; // Assurez-vous que vous avez installé axios
import { API_BASE_URL } from "../../utils/utils";

const FileDownload = () => {
  const downloadFile = async () => {
    try {
      // Faites un appel GET à l'API pour récupérer le fichier
      const response = await axios({
        url: API_BASE_URL + "/program/execute", // URL de votre route Express
        method: "POST",
        responseType: "blob", // Important pour le téléchargement de fichiers
        data: {
          code: "print('Hello World')",
          language: "python",
          outputFileType: "s",
        },
      });
      // Créez un lien temporaire pour le téléchargement du fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.txt"); // Nom du fichier à télécharger (peut être dynamique)
      document.body.appendChild(link);
      link.click();

      // Nettoyer le lien après le téléchargement
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Nettoyer l'URL créée
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
    }
  };

  return (
    <div>
      <button onClick={downloadFile}>Télécharger le fichier</button>
    </div>
  );
};

export default FileDownload;
