const mongoose =  require('mongoose');

const PersonsShema = new mongoose.Schema({
    tipoDocument : String,
    identity : Number,
    nombre : String,
    apellido : String,
    direccion : String,
    mail : String,
    telefono : String,
    celular : String,
    web : String,
    descripcion : String
});

module.exports = mongoose.model('persona',PersonsShema,'Personas');