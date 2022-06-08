
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import userRouter from "./routes/user.js";
import pacienteRoutes from './routes/pacientes.js';
import uploadRouter from './routes/uploads.js'
import downloadRouter from './routes/download.js'
import atencionesRouter from './routes/atenciones.js'


const app = express();
dotenv.config();

app.use(express.static('./public'));
app.use('/uploads', express.static('uploads'));


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

var allowedOrigins = ['http://localhost:3000',
  'http://yourapp.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use("/user", userRouter);
app.use('/pacientes', pacienteRoutes);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/atenciones', atencionesRouter);

//const CONNECTION_URL = 'mongodb+srv://wcasarino:MamiKa0503@cluster0.c1snyt4.mongodb.net/turnos_app?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);