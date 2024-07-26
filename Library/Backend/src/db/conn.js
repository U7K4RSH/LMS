const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://21ucs155:Pranjal%402310@cluster0.zhjctek.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connection successfull`);
}).catch((e)=>{
    console.log(e);
})
module.exports = mongoose;