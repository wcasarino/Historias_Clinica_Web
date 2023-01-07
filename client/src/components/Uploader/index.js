import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Axios from "axios";

const Uploader = ({ files = [], remove }) => {
  return (
    <div
      className="uploader"
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
          Subir Archivo
        </div>
        <ul
          className="list-group list-group-flush"
          style={{ maxHeight: "300px", overflow: "hidden", overflowY: "auto" }}
        >
          {files.map((file, idx) => (
            <UploadItem
              key={idx}
              removeFile={() => remove(file.uploadId)}
              {...file}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const UploadItem = ({
  idPaciente,
  IdAtencion,
  data,
  setAtenciones,
  setAtencion,
  atencion,
  viejaAte,
  cantArch,
  removeFile,
}) => {
  const [uploadInfo, setUploadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0,
    cantidad: 0,
    error: false,
  });

  useEffect(() => {
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        setUploadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
          cantidad: cantArch || 1,
          error: false,
        });
      },
    };
    const urlFile = `http://localhost:5001/upload/${idPaciente}/UpdateSelectedFilesAtencion`;

    Axios.post(urlFile, data, options)
      .then((res) => {
        const newAtenciones = res.data.atenciones;

        if (viejaAte) {
          let newAte = {};
          res.data.atenciones.forEach((ate) => {
            if (ate._id === IdAtencion) {
              newAte = ate;
            }
          });
          if (newAte) {
            const newSelectedFiles = newAte.selectedFiles;
            setAtencion({ ...atencion, selectedFiles: newSelectedFiles });
          }
        }
        setAtenciones(newAtenciones);

        setUploadInfo((info) => ({
          ...info,
          completed: true,
        }));

        setTimeout(() => {
          removeFile();
        }, 3000);
      })
      .catch((err) => {
        console.log("Error al Subir", err);
        setUploadInfo((info) => ({
          ...info,
          error: true,
        }));
        setTimeout(() => {
          removeFile();
        }, 3000);
      });
  }, []);

  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-12 d-flex">
          <div className="d-inline font-weight-bold text-truncate">
            Subiendo {uploadInfo.cantidad} Archivo
            {uploadInfo.cantidad > 1 && <>s</>}
          </div>
          <div className="d-inline ml-10">
            <small>
              {uploadInfo.loaded > 0 && (
                <>
                  <span className="text-success">
                    {formatBytes(uploadInfo.loaded)}
                  </span>
                  / {formatBytes(uploadInfo.total)}
                </>
              )}

              {uploadInfo.loaded === 0 && <>Subiendo...</>}
            </small>
          </div>
          <div className="d-inline ml-10">
            {uploadInfo.completed && (
              <span className="text-success">Completado</span>
            )}
            {uploadInfo.error && (
              <span className="text-danger bg-dark">Errores al Subir</span>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 mt-2">
            <ProgressBar
              variant="success"
              now={uploadInfo.progress}
              striped={true}
              label={`${uploadInfo.progress}%`}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default Uploader;
