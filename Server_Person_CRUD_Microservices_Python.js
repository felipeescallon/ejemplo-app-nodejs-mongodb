const express = require("express");
const mongoose = require("mongoose");

const fetch = require("node-fetch");//importamos para acceder a urls externas
//PARA QUE FUNCIONE DEBE TRABAJARSE CON LA VERSIÓN DE node-fetch 2.6.5, ejecutando en la terminal los comandos:
//npm i node-fetch@2.6.5
//Pagina de la versión específica: https://www.npmjs.com/package/node-fetch/v/2.6.5


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


//AHORA CON NOTIFICACIONES A TRAVÉS DEL microservicio realizado en Python:
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
    
    //NOTIFICAR AL USUARIO via email y sms:
    let correo_destino = nuevaPersona.mail;
    let telefono_celular = nuevaPersona.celular;
    let asunto = 'Registro en la plataforma';    
    //Los string templates(``) son usados aquí para dinamizar.     
    let contenido = `Bienvendido/a ${nuevaPersona.nombre} ${nuevaPersona.apellido}, los demás datos registrados son: identificación: ${nuevaPersona.tipoDocument} ${nuevaPersona.identity}, dirección: ${nuevaPersona.direccion}, correo:${nuevaPersona.mail}, teléfono: ${nuevaPersona.telefono}, celular: ${nuevaPersona.celular}, sitio web:${nuevaPersona.web}, y descripcion: ${nuevaPersona.descripcion}!!!`;
    
    //Via email
    fetch(`http://127.0.0.1:5000/envio-correo?correo_destino=${correo_destino}&asunto=${asunto}&contenido=${contenido}`)//el ? se usa para el get. & se usa para agregar más parámetros a la petición    
      .then((data) => {
        console.log(data);//controlando: para darse cuenta que fue enviado o no

      })//.then usado para obtener la respuesta del fetch                
    
    //Via sms
    fetch(`http://127.0.0.1:5000/sms?telefono=${telefono_celular}&mensaje=${contenido}`)//el ? se usa para el get. & se usa para agregar más parámetros a la petición    
      .then((data) => {
        console.log(data);//controlando: para darse cuenta que fue enviado o no

      })//.then usado para obtener la respuesta del fetch    
      
    //YA CON LO ANTERIOR SE CORRE LA APP (ejecutando node nombre_archivo_servidor.js  en la terminal) y luego probando la funcionalidad con Postman
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


app.use(router);
app.listen(3000, () => {
    console.log("Servidor iniciado")
});