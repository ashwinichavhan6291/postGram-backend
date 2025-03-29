const mongoose=require("mongoose");

connectDb=async()=>{
await mongoose.connect("mongodb+srv://AshwiniChavhan:eV5TuKSO9G2HTXjw@namastenode.4nzgu.mongodb.net/node-intern");
}

module.exports=connectDb;

