const m1 = require("./db/conn");
const hbs = require("hbs");
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = process.env.PORT ||3000;
const Register = require("./models/registers");
const Register2 = require("./models/registers2");
const static_path = path.join(__dirname,"../public");
const imgPath = path.join(__dirname,"../views/images");
const { kStringMaxLength } = require('buffer');
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use('/images',express.static(imgPath));
// console.log(path.join(__dirname,"../views/images"));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'library.modern123@gmail.com', // Replace with your Gmail email address
      pass: 'nqjakawyukmovxmh' // Replace with your Gmail password or an application-specific password
    }
});
app.use(express.static(static_path));
app.set("view engine","hbs");

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/index2',(req,res)=>{
    res.render('index2');
});
app.get('/index3',(req,res)=>{
    res.render('index3');
});
app.get('/index4',async(req,res)=>{
    try{
        const student = await Register.find();
        res.render('index4',{student});
    }
    catch(e)
    {
        console.log(e);
    }
});
app.get('/index5',async(req,res)=>{
    try{
        const Books = await Register2.find();
        res.render('index5',{Books});
    }
    catch(e)
    {
        console.log(e);
    }
});
app.get('/index6/:ID',async(req,res)=>{
    try{
        const SCode = req.params.ID;
        const student = await Register.findOne({ID : SCode});
        res.render('index6',{student});
    }
    catch(e)
    {
        console.log(e);
    }
});
app.get('/index7/:Code',async(req,res)=>{
    try{
        const BCode = req.params.Code;
        const book = await Register2.findOne({Code : BCode});
        res.render('index7',{book});
    }
    catch(e)
    {
        console.log(e);
    }
});
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
});
app.post('/index2',async(req,res)=>{
    try{
        const student = new Register({
            Name: req.body.Name,
            ID: req.body.ID,
            Email: req.body.Email,
            Phone: req.body.Phone
        })
        const mailOptions = {
            from: 'library.modern123@gmail.com', // Replace with your Gmail email address
            to: req.body.Email, // Replace with the recipient's email address
            subject: 'Successfull Registration',
            text: 'Hello, this mail is to inform you about the successfull registration as a student in the library .Regards'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error occurred while sending email:', error);
            } else {
              console.log('Email sent successfully:', info.response);
            }
          });          
        const registered = await student.save()

        res.status(201).render("index2");
    }
    catch(error)
    {
        res.status(400).send(error);
    }
});

app.post('/index3',async(req,res)=>{
    try{
        const registerBook = new Register2({
            Title: req.body.Title,
            Code: req.body.Code,
            Author: req.body.Author,
            Description: req.body.Description
        })
        const registered1 = await registerBook.save()
        res.status(201).render("index3");
    }
    catch(error)
    {
        res.status(400).send(error);
    }
});

app.post('/update/:Code',async(req,res)=>{
    try{
        const book = await Register2.findOne({ Code: req.params.Code });
        if (book) {
            book.Title = req.body.Title;
            book.Author = req.body.Author;
            book.Code = req.body.Code;
            book.Description = req.body.Description;
            book.Alloted = false;
            book.StCode = null;
            await book.save();
        }
        res.render("index7",{book});
    }
    catch(e)
    {
        console.log(e);
    }
});

app.post('/update1/:ID',async(req,res)=>{
    try{
        const student = await Register.findOne({ ID: req.params.ID });
        if (student) {
            student.ID = req.body.ID;
            student.Name = req.body.Name;
            student.Email = req.body.Email;
            student.Phone = req.body.Phone;
            await student.save();
        }
        res.render("index6",{student});
    }
    catch(e)
    {
        console.log(e);
    }
});
app.post('/delete/:Code',async(req,res)=>{
    try{
        // const BCode = req.params.Code;
        const Bt = await Register2.findOne({Code:req.params.Code});
        if(Bt.Alloted==true)
        {
            console.log("Book h kisi bhai ke pass");
        }
        else
        {
            await Register2.findOneAndDelete({Code:req.params.Code});
        }
        const Books = await Register2.find();
        res.render("index5",{Books});
    }
    catch(e)
    {
        console.log(e);
    }
});

app.post('/delete1/:ID',async(req,res)=>{
    try{
        // const BCode = req.params.Code;
        const St = await Register.findOne({ID:req.params.ID});
        if(St.books.length>0)
        {
            console.log("books h bhai ke pass");
        }
        else
        {
            await Register.findOneAndDelete({ID:req.params.ID});
        }
        const student = await Register.find();
        res.render("index4",{student});
    }
    catch(e)
    {
        console.log(e);
    }
});

app.post('/update11',async(req,res)=>{

        const SCode = req.body.ID;
        const BCode = req.body.Code;
        const s1 = await Register.findOne({ID:SCode});
        const b1 = await Register2.findOne({Code:BCode});
        if(!s1)
        {
            console.log("Student dont exist");
        }
        else if(!b1)
        {
            console.log("Book dont exist");
        }
        else
        {
            if(req.body.Add)
            {
                const student = await Register.findOne({ID:SCode});
                const book = await Register2.findOne({Code:BCode});
                if(book)
                {
                    if(book.Alloted == false)
                    {
                        student.books.push(BCode);
                        book.Alloted = true;
                        book.StCode = SCode;
                        await book.save();
                        await student.save();
                        res.render("index6",{student});
                    }
                    else
                    {
                        console.log("DI hui h ");
                    }
                }
                
            }
            else if(req.body.Delete)
            {
                try{
                    const Ustudent = await Register.updateOne(
                        {ID:SCode},
                        {$pull:{books:BCode}}
                    );
                    if(Ustudent.modifiedCount>0)
                    {
                        const book = await Register2.findOne({Code:BCode});
                        book.Alloted = false;
                        book.StCode = null;
                        await book.save();
                        const student = await Register.findOne({ ID: SCode });
                        res.render("index6",{student});
                    }
                    else
                    {
                        const student = await Register.findOne({ ID: SCode });
                        res.render("index6",{student});
                        console.log("Book ni mili user ke pass");
                    }
                }
                catch(e)
                {
                    console.log(e);
                }
            }
        }
});

app.post("/update12",async(req,res)=>{
    const SCode = req.body.ID;
    const BCode = req.body.Code;
    const s1 = await Register.findOne({ID:SCode});
    const b1 = await Register2.findOne({Code:BCode});
    if(!s1)
    {
        console.log("Student dont exist");
    }
    else if(!b1)
    {
        console.log("Book dont exist");
    }
    else
    {
        if(req.body.Assign)
        {
            const student = await Register.findOne({ID:SCode});
            const book = await Register2.findOne({Code:BCode});
            if(student)
            {
                student.books.push(BCode);
                book.StCode = SCode;
                book.Alloted = true;
                await book.save();
                await student.save();
                res.render("index7",{book});
            }
        }
        else if(req.body.Deassign)
        {
            try {
                const Ustudent = await Register.updateOne(
                    {ID:SCode},
                    {$pull:{books:BCode}}
                );
                if(Ustudent.modifiedCount>0)
                {
                    const book = await Register2.findOne({Code:BCode});
                    book.Alloted = false;
                    book.StCode = null;
                    await book.save();
                    res.render("index7",{book});
                }
                else
                {
                    console.log("Bande ke pass book ni");
                    const book = await Register.findOne({Code:BCode});
                    res.render("index7",{book});
                }
                
            } 
            catch (error) 
            {
                console.log(error);   
            }
            
        }
    }
})

