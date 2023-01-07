import Uploader from "../components/Uploader";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

const useFileUploader = () => {
  const [files, setFiles] = useState(() => []);

  const upload = (file) =>
    setFiles((fileList) => [...fileList, { ...file, uploadId: uuid() }]);

  const remove = (removeId) =>
    setFiles((files) => [
      ...files.filter((file) => file.uploadId !== removeId),
    ]);

  return [
    (e) => upload(e),
    files.length > 0 ? (
      <Uploader files={files} remove={(e) => remove(e)} />
    ) : null,
  ];
};

export default useFileUploader;
