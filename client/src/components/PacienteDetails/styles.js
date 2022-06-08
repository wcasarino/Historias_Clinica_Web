import { makeStyles } from '@mui/styles';


export default makeStyles((theme) => ({
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    maxWidth: '120px',
    //width: '100%',
    maxHeight: '120px',
    //height: '100%',

  },
  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
    width: '100%',
  },
  imageSection: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },

  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  atencionesOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  atencionesInnerContainer: {
    height: '380px',
    overflowY: 'auto',
    marginRight: '30px',
  },

  toolbar: {
    justifyContent: 'flex-end',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },

  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  camposAtencion: {
    marginLeft: 100,
  },

}));
