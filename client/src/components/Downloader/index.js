import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Axios from "axios";

const Downloader = ({ files = [], remove }) => {
  return (
    <div
      className="downloader"
      style={{
        width: "500px",
        minHeight: "128px",
        position: "fixed",
        right: "18px",
        top: "18px",
        maxHeight: "700px",
        overflowY: "auto",
      }}
    >
      <div className="card">
        <div
          className="card-header"
          style={{
            color: "#fff",
            backgroundColor: "rgb(93 11 11 / 92%)",
          }}
        >
          Descargar Archivo
        </div>
        <ul
          className="list-group list-group-flush"
          style={{ maxHeight: "300px", overflow: "hidden", overflowY: "auto" }}
        >
          {files.map((file, idx) => (
            <DownloadItem
              key={idx}
              removeFile={() => remove(file.downloadId)}
              {...file}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const DownloadItem = ({ name, idPaciente, IdAtencion, file, removeFile }) => {
  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0,
    error: false,
  });

  useEffect(() => {
    const options = {
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        setDownloadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
          error: false,
        });
      },
    };

    const urlFile = `http://localhost:5001/download/${idPaciente}/${IdAtencion}/${file}/downloadFile`;

    Axios.get(urlFile, {
      responseType: "blob",
      ...options,
    })
      .then(function (response) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers["content-type"],
          })
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();

        setDownloadInfo((info) => ({
          ...info,
          completed: true,
        }));

        setTimeout(() => {
          removeFile();
        }, 2000);
      })
      .catch((err) => {
        console.log("Error Dow", err);
        setDownloadInfo((info) => ({
          ...info,
          error: true,
        }));

        setTimeout(() => {
          removeFile();
        }, 2000);
      });
  }, []);

  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-12 d-flex">
          <div className="d-inline font-weight-bold text-truncate">{name}</div>
          <div className="d-inline ml-2">
            <small>
              {downloadInfo.loaded > 0 && (
                <>
                  <span className="text-success">
                    {formatBytes(downloadInfo.loaded)}
                  </span>
                  / {formatBytes(downloadInfo.total)}
                </>
              )}

              {downloadInfo.loaded === 0 && <>Descargando...</>}
            </small>
          </div>
          <div className="d-inline ml-2 ml-auto">
            {downloadInfo.completed && (
              <span className="text-success">Completado</span>
            )}
            {downloadInfo.error && (
              <span className="text-danger bg-dark">Error</span>
            )}
          </div>
        </div>
        <div className="col-12 mt-2">
          <ProgressBar
            variant="success"
            now={downloadInfo.progress}
            striped={true}
            label={`${downloadInfo.progress}%`}
          />
        </div>
      </div>
    </li>
  );
};

export default Downloader;
