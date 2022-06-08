import PacienteDatos from '../models/pacienteDatos.js';

export const getAtencionesBySearch = async (req, res) => {
  const { searchQuery, tags, vista, page, anomesStr, fechaAte1 } = req.query;
  let Ates = []
  try {
    const dni = new RegExp(searchQuery, "i");
    const apellidos = new RegExp(searchQuery, "i");
    const nombres = new RegExp(searchQuery, "i");
    let pacientes = []

    switch (vista) {
      case 'anomes':
        if (anomesStr !== 'null') {
          if (searchQuery !== '9a69dc7e834f617' || tags.length > 0) {
            console.log('tiene algo con Fecha Atención')

            if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
              pacientes = await PacienteDatos.find({
                $and: [
                  { $or: [{ dni }, { apellidos }, { nombres }] },
                  { tags: { $in: tags.split(',') } },
                  { "atenciones.anomesStr": anomesStr }
                ]
              });

            } else {
              if (searchQuery !== '9a69dc7e834f617') {
                pacientes = await PacienteDatos.find({
                  $and: [
                    { $or: [{ dni }, { apellidos }, { nombres }] },
                    { "atenciones.anomesStr": anomesStr }
                  ]
                });

              } else {
                console.log('Solo tiene tags');
                pacientes = await PacienteDatos.find({
                  $and: [
                    { tags: { $in: tags.split(',') } },
                    { "atenciones.anomesStr": anomesStr }
                  ]
                });
              }

            }
          } else {
            pacientes = await PacienteDatos.find({ "atenciones.anomesStr": anomesStr });
          }
        }

        break;

      case 'dia':

        if (searchQuery !== '9a69dc7e834f617' || tags.length > 0) {

          if (searchQuery !== '9a69dc7e834f617' && tags.length > 0) {
            pacientes = await PacienteDatos.find({
              $and: [
                { $or: [{ dni }, { apellidos }, { nombres }] },
                { tags: { $in: tags.split(',') } },
                { "atenciones.diaStr": fechaAte1 }
              ]
            });

          } else {
            if (searchQuery !== '9a69dc7e834f617') {
              pacientes = await PacienteDatos.find({
                $and: [
                  { $or: [{ dni }, { apellidos }, { nombres }] },
                  { "atenciones.diaStr": fechaAte1 }
                ]
              });

            } else {
              pacientes = await PacienteDatos.find({
                $and: [
                  { tags: { $in: tags.split(',') } },
                  { "atenciones.diaStr": fechaAte1 }
                ]
              });
            }

          }
        } else {
          pacientes = await PacienteDatos.find({ "atenciones.diaStr": fechaAte1 });
        }
        break;

      default:
        break;
    }


    if (pacientes) {
      const diaIni = false
      pacientes.forEach(pac => {
        const apellidos = pac.apellidos
        const nombres = pac.nombres
        const idPac = pac._id
        pac.atenciones.forEach(ate => {
          switch (vista) {
            case 'anomes':
              if (ate.anomesStr === anomesStr) {
                Ates.push({ apellidos, nombres, diagnostico: ate.diagnostico, practica: ate.practica, fecha: ate.fecha, notas: ate.notas, idPac, diaIni })
              }
              break;

            case 'dia':
              if (ate.diaStr === fechaAte1) {
                Ates.push({ apellidos, nombres, diagnostico: ate.diagnostico, practica: ate.practica, fecha: ate.fecha, notas: ate.notas, idPac, diaIni })
              }
              break;

            default:
              break;
          }
        })
      });


    }

    res.status(201).json({ data: Ates, message: '', error: false });

  } catch (error) {
    console.log(error)
    res.status(200).json({ data: Ates, message: error.message, error: true });
  }
}

export const getAtenciones = async (req, res) => {

  let Ates = []
  let ano = ''
  try {

    const pacientes = await PacienteDatos.find()
    if (pacientes) {
      pacientes.forEach(pac => {
        pac.atenciones.forEach(ate => {
          if (ate.anomesStr) {
            ano = ate.anomesStr.substring(0, 4)
            Ates.push(ano)
          }
        });
      })
    }

    const conjunto = new Set(Ates);
    Ates = [...conjunto];
    if (Ates?.length > 0) {
      Ates.sort(function (a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    };

    res.status(201).json({ data: Ates, message: '', error: false });

  } catch (error) {
    console.log(error)
    res.status(200).json({ data: Ates, message: error.message, error: true });
  }
}