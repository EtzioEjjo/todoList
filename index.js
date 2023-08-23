import express from 'express';
import bodyParser from 'body-parser';
import { render } from 'ejs';
import mongoose from 'mongoose';
const app=express();
const port=3000;
let Item=null;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(port,async()=>{
Item=await getDBConn();
});


/* handle TODAY todoItems */
app.route('/')
.get(async(req,res) =>{
    const items=await renderItems('today')
    res.render('today.ejs',{
        items:items,
    type:'/',
    date:date()});
})
.post( async (req, res) => {
 addItem('today',req.body.toDoItem);
 res.redirect('/');
});




/* handle WORK todoItems */

app.route('/work')
.get(async (req,res) =>{
    const items=await renderItems('work')

    res.render('today.ejs',{
        items:items,
        type:'work',
        date:date()
    }
        );

})
.post((req,res) =>{
    addItem('work',req.body.toDoItem);
    res.redirect('/work');
})



/* Connect to the databse */
const getDBConn=async function(){
    await mongoose.connect('mongodb://localhost:27017/toDoListDB');
    const todoItemSchema=mongoose.Schema({
    _id:Number,
    item:String,
    type:String
    });
    const Item= mongoose.model('Item',todoItemSchema);
    return Item;
}

const addItem=async function(type,toDoItem){
    try {
        const id = await Item.countDocuments() + 1;

        const item = new Item({
            _id: id,
            item: toDoItem,
            type:type
        });

        await item.save();
        console.log('Item saved successfully');
     
    } catch (err) {
        console.error('Error:', err);
   
    }
}

const renderItems=async function(type){
    const itemsByType=await Item.find({type:type},{_id:0,item:1,type:1})
    const filteredValues = itemsByType.map(el => el.item)  ;
      return filteredValues;
  
}
/*get today's Date */
const date= function(){
    const today=new Date();
    const year=today.getFullYear();
    const day=today.getDate();
    const month=today.getMonth();
    const formattedDate=`${month}-${day}-${year}`;
    return formattedDate;
}