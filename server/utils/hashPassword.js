import bcrypt from "bcryptjs"

const password="qwerty123";

const generateHash=async(password)=>{
    const hash=await bcrypt.hash(password,10);
    return hash;
    
}

