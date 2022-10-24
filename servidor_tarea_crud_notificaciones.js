//PROGRAMACIÓN FUNCIONAL CON JAVASCRIPT (nodejs "nativo/puro")
console.log("Hola mundo desde NodeJS");
//para esta prueba de una sola linea puede que no lleve ; al final de console.log("")

//IMPORTANDO PAQUETES Y OTROS ARCHIVOS + GUARDANDO EN CONSTANTES:
const express = require('express');//importando express y guardando en una constante llamada express
const mongoose = require('mongoose');//importando mongoose y guardando en una constante llamada mongoose
const TareaSquema = require("./modelos/Tarea.js");//importando el esquema de Tarea.js y guardando en una constante llamada TareaSquema

const app = express();//instanciando express y guardando en una constante llamada app

const router = express.Router();//definiendo las rutas como una puerta para que el usuario externo consulte nuestras funcionalidades
app.use(express.urlencoded({extended: true}));//para que se use la codificación de la url de express y que sea extendida
app.use(express.json());//para que se permita ingresar info en formato json

//Conexión a la base de datos (ActividadesBD: dicha BD tiene una colección llamada Tareas)
mongoose.connect("mongodb+srv://prog_web:ProgWebMintic2022@clusterprogweb.irmh1.mongodb.net/ActividadesBD?retryWrites=true&w=majority");//cadena de conexión (se debe poner el password y el nombre de la base de datos)

//Operaciones CRUD: se muestran como ejemplo las operaciones de creación (CREATE-app.post()) y lectura(READ-app.get()). 
//CONSULTA PRÁCTICA en equipos: terminar de hacer las otras operaciones del CRUD pendientes (update/delete)
//modelo cliente(request)-servidor(response): el servidor recibe la req del cliente y le responde al mismo cliente con res
router.get('/', (req, res) => {//al principio el navegador arrojaba Error pero con esto lo solucionamos porque ya apuntamos a la raíz ('/') del servidor
    res.send("El inicio de mi API");//respuesta del servidor cuando haya una petición del cliente (localhost:3000)
})//no va ; porque es una función

router.get('/tarea', (req, res) => {//es para pedir(READ) info desde el lado del cliente viniendo del servidor
    TareaSquema.find(function(err,datos){//esa función es un callback
        if(err){
            console.log("Error leyendo las tareas");  
        }else{
            res.send(datos);
        }        
    })//no va ; porque es una función    
})

router.post('/tarea', (req, res) => {//es para poner(CREATE) info desde el lado del cliente hacia el servidor
    let nuevaTarea = new TareaSquema({//se define un objeto dentro del constructor de TareaSquema
        //estos son los parámetros
        //obtengo el body (para eso era el url encoded y el json usando express)
        idTarea: req.body.idTarea,
        nombreTarea: req.body.nombreTarea,
        detalleTarea: req.body.detalleTarea//no es necesario la , aquí porque esta finalizando el bloque de código         
    });//la anterior sería la información que llega para construir una nueva tarea

    //a través de mongoose: permitir que el esquema nuevaTarea guarde la información...
    //...y que precisamente la función pasada es la que se va a ejecuar luego de que se guarde la info
    nuevaTarea.save(function(err,datos){//esa función es un callback
        if(err){
            console.log(err);//muestra info en caso de error  
        }
        //si no entra a error es porque se guardó la info, y para eso desde el servidor se le informa al cliente que la operación fue exitosa
        res.send("Tarea almacenada correctamente.")//no es necesario el ; aquí porque esta finalizando el bloque de código        
    })//no va ; porque es una función
})


router.delete('/tarea/:id?', (req, res) => {
    const id = req.params.id;
    TareaSquema.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            res.status(404).send("No se encontro una tarea con ese ID");
        }else{
            res.send("Tarea se elimino");
        }
    })
    .catch(err => {
        res.status(500).send("La tarea con el id="+id+"no se ha podido eliminar")
    })
})

router.put('/tarea/:id', (req,res) => {
    const id = req.params.id;
    TareaSquema.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    .then(data => {
        if(!data){
            res.status(404).send("La tarea que intento actualizar no se encontro")
        }else res.send("La tarea ha sido actualizada")
    })
    .catch(err => {
        res.status(500).send("Error al actualizar la tarea con el id="+id);
    })
})

//NOTIFICACIONES:
//Para sms:

//Teniendo la TWILIO_ACCOUNT_SID y el TWILIO_AUTH_TOKEN ya creados dentro de Twilio:
//From the command line, set environment variables to contain your credentials
//Add your credentials as environment variables in a twilio.env file and source them:
//echo "export TWILIO_ACCOUNT_SID='your_account_sid'" > twilio.env
//echo "export TWILIO_AUTH_TOKEN='your_auth_token'" >> twilio.env
//source ./twilio.env
//Make sure that Git ignores the twilio.env file:
//echo "twilio.env" >> .gitignore

//Installation
//The easiest way to install twilio-node is from NPM. You can run the command below from your project directory to install the library:
//npm install twilio

//Codigo (para node.js) copiado desde la interfaz de Twilio /tuilio/
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token in Account Info
// and set the environment variables. See http://twil.io/secure

/*
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//client.messages 
//.create({body: 'Hi there from Twilio!', from: '+14255377299', to: '+573165329053'})
//.then(message => console.log(message.sid));

//Or to test locally by hardcoding:

//const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Your Account SID from www.twilio.com/console
//const authToken = 'your_auth_token'; // Your Auth Token from www.twilio.com/console

//const twilio = require('twilio');
//const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from Node.js sent via Twilio',
    //to: '+573165329053', // Text this number (+12345678901)- it must be a verified number in your Twilio account!!!
    to: '+573152826559', // Text this number (+12345678901) - it must be a verified number in Twilio account!!!
    from: '+14255377299', // From a valid Twilio number (+12345678901)
  })
  .then((message) => console.log(message.sid));
*/
   



//Para Email:
//Codigo (para node.js) copiado desde la interfaz de SendGrid /sendgrid/
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs


//Teniendo la API KEY ya creada dentro de SendGrid:
//(This allows your application to authenticate to our API and send mail)
//Create an environment variable
//echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
//echo "sendgrid.env" >> .gitignore
//source ./sendgrid.env

//Install the package
//npm install --save @sendgrid/mail

//Send your first email
//The following is the minimum needed code to send an email:

//javascript
/*
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'andresescallon.tic@ucaldas.edu.co', // Change to your recipient (test@example.com)
  from: 'andresfecambridgelc@gmail.com', // Change to your verified sender (test@example.com)
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
*/

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


app.use(router);//para agregarle las rutas creadas a nuestra app
//con la linea 4 y la siguiente linea se puede incializar un servidor web escuchando por el puerto 3000 y pasandole una funcion anónima (lambda/"flecha") de javascript

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000")//esta función solo muestra este mensaje
    //En un browser digitamos localhost:3000 y sale el mensaje Cannot GET / 
    //Con lo anterior se demuestra que si funciona aunque todavía no hay una ruta para la raíz del servidor
});