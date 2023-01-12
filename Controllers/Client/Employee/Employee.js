const Employee = require("../../../Models/Employee");
const { v4: uuidv4 } = require("uuid");

const addEmployee = async (req, res) => {
    try{
        const body = req.body
        const id = uuidv4();

        const employeeData = await Employee.find({ name : body.name })
        if(employeeData?.length === 0){
            const employee = new Employee({
                ...body,
                id
            })
            await employee.save();
        }else{
            res.status(400).json({ message: "name Already Occupied" });
        }
        
        res.json({ message: "Employee Added Successfully" });

    }catch(e){
        res.status(400).json({ message: "Something Went Wrong" });
    } 
}


const updateEmployee = async (req,res) => {
    try{
        const body = req.body
        await Employee.findOneAndUpdate(
            {_id: body?._id},
            {
               ...body 
            }
        )
        res.json({message: "Updated Successfully" });

    }catch(e){
        res.status(400).json({ message: "Employee Not Found" });
    } 
}

const deleteEmployee = async (req,res) => {
    try{
        const { id } = req.body
        if(id){
            await Employee.deleteOne({_id: id});
        }
        res.json({message: "Employee Deleted Successfully" });

    }catch(e){
        res.status(400).json({ message: e });
    } 
}

const getEmployeeById = async (req,res) => {
    try{
        const { id } = req.query
        let data = {}
        if(id){
            data = await Employee.findOne({_id: id});
            if(data === null){
                res.status(400).json({ message: "Employee Not Found" });
            }
        }
        res.json({ data , message: "Employee Fetched Successfully" });
    }catch(e){
        res.status(400).json({ message: e });
    } 
}

const getEmployeeList = async (req, res) => {
    try{
        const { type,position } = req.query
        if(type && position){
            data = await Employee.find({ workPlace : type, positions : position},{_id : 1,name:1});
        }else{
            data = await Employee.find();
        }
        res.json({ data , message: "Employee Fetched Successfully" });

    }catch(e){
        res.status(400).json({ message: e });
    } 
}

module.exports = {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeList
    
};
