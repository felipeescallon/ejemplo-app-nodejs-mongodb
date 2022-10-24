const express = require("express");
const mongoose = require("mongoose");

const app = express();
const router = express.Router();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Modelos
const PersonShema = require('./Models/Person.js');

//Connection DataBase
//mongoose.connect("mongodb+srv://rot:1@mintic01.k4mvd.mongodb.net/ActividadesDB?retryWrites=true&w=majority");

//Conexión a la base de datos (ActividadesBD: dicha BD tiene una colección llamada Personas)
mongoose.connect("mongodb+srv://prog_web:ProgWebMintic2022@clusterprogweb.irmh1.mongodb.net/ActividadesBD?retryWrites=true&w=majority");//cadena de conexión (se debe poner el password y el nombre de la base de datos)


//CRUD
router.get('/', (req,res) => {
    res.send("Ya se inicio la API");
})
router.get('/persona', (req,res) => {
    PersonShema.find(
        function(err,datos){
            if (err){
                console.log("Error leyendo los datos de la DB");
            }else{
                res.send(datos);
            }
        }
    )
})

router.post('/persona', (req,res) => {
    const nuevaPersona = new PersonShema({
        tipoDocument: req.body.tipoDocument,
        identity: req.body.identity,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        mail: req.body.mail,
        telefono: req.body.telefono,
        celular: req.body.celular,
        web: req.body.web,
        descripcion: req.body.descripcion
    });
    nuevaPersona.save(
        function(err,datos){
            if(err){
                console.log(err);
            }
            res.send("Se creo a la persona en la base de datos");
        }
    )
})

router.delete('/persona/:id?', (req, res) => {
    const id = req.params.id;
    PersonShema.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            res.status(404).send("No se encontro una persona con ese ID");
        }else{
            res.send("Persona se elimino");
        }
    })
    .catch(err => {
        res.status(500).send("La persona con el id="+id+"no se ha podido eliminar")
    })
})

router.put('/persona/:id', (req,res) => {
    const id = req.params.id;
    PersonShema.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    .then(data => {
        if(!data){
            res.status(404).send("La persona que intento actualizar no se encontro")
        }else res.send("La persona ha sido actualizada")
    })
    .catch(err => {
        res.status(500).send("Error al acutualizar la persona con el id="+id);
    })
})


//AHORA NOTIFICACIONES A TRAVÉS DEL MÉTODO POST:

router.post('/envio-correo', (req, res) => {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: req.body.correo_destino, // Change to your recipient (test@example.com)
      from: 'andresfecambridgelc@gmail.com', // Change to your verified sender (test@example.com)
      subject: req.body.asunto,
      text: req.body.contenido,
      //html: `<strong>${text}</strong>`, //using template literals
    }
    sgMail
      .send(msg)
      .then(() => {
        //console.log('Email sent')
        res.send('Email sent')
      })
      .catch((error) => {
        //console.error(error)
        res.send(error)
      })
})
 
router.post('/sms', (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    client.messages
      .create({
        body: req.body.mensaje,        
        to: '+57'+req.body.telefono, // Text this number (+12345678901)- it must be a verified number in your Twilio account!!!
        from: '+14255377299', // From a valid Twilio number (+12345678901)
      })
      //.then((message) => console.log(message.sid));
      .then(message => {
        if(!message){
            //res.status(404).send("¡No se encontró ningún mensaje!"); 
            //res.sendStatus(404).send("¡No se encontró ningún mensaje!"); 
            res.send('SMS  not found');
        }else{
            //res.send(404).send("¡El mensaje se envió con éxito!"); 
            //res.sendStatus(404).send("¡El mensaje se envió con éxito!"); 
            res.send('SMS sent');
        }
      })
})


app.use(router);
app.listen(3000, () => {
    console.log("Servidor iniciado")
});