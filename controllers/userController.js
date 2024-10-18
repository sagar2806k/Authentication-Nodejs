import UserModel from "../models/user.js"; // Import the User model for database interactions
import bcrypt from 'bcrypt'; // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for handling JWT

class UserController {
    
    // User registration function
    static userRegistration = async (req, res) => {
        // Extracting the required fields from request body
        const { name, email, password, password_confirmation, tc } = req.body

        // Check if the user already exists with the same email
        const user = await UserModel.findOne({ email: email })

        if (user) {
            // If the email is already taken, send a failed response
            res.send({ "status": "failed", "message": "Email already in use." })
        } else {
            // Check if all the required fields are provided
            if (name && email && password && password_confirmation && tc) {

                // Check if password and confirm password match
                if (password === password_confirmation) {
                    try {
                        // Generate salt for password hashing
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password,salt)

                        // Create a new user document with the provided data
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword, // Hash the password before saving
                            tc: tc
                        })

                        // Save the new user to the database
                        await doc.save()
                        const saved_user = await UserModel.findOne({email:email})
                        // Generate JWT token
                        const token = jwt.sign({user_id:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                        // Send success response if user is registered
                        res.send({ "status": "success", "message": "Registration successful.","token":token })

                    } catch (error) {
                        console.log(error) // Log any errors that occur

                        // Send error response in case of failure
                        res.send({ "status": "failed", "message": "Error occurred during user registration." })
                    }

                } else {
                    // Send error if password and confirm password don't match
                    res.send({ "status": "failed", "message": "Password and confirm password do not match." })
                }

            } else {
                // Send error if any field is missing
                res.send({ "status": "failed", "message": "All fields are required." })
            }
        }
    }

    static userLogin = async(req,res)=>{
        try{
            const {email,password}=req.body;
            if (email&&password){
                const user = await UserModel.findOne({ email: email });
                if (user != null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if ((user.email ===email )&& isMatch){

                        // Generate JWT token
                        const token = jwt.sign({user_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                        res.send({"status": "success,", "message":"Login successful...","token":token})
                    }else{
                        res.send({ "status": "failed", "message": "Invalid credentials." });
                    }
                }else{
                    res.send({ "status": "failed", "message": "You are not registerd User." });
                }
            }else{
                res.send({ "status": "failed", "message": "All fields are required."});
            }

        }catch(error){
            console.log(error)
            res.status(500).send({"status": "failed", "message": "Unable to Login"});
        }

    }
}

export default UserController; // Export the UserController class for use in routes
