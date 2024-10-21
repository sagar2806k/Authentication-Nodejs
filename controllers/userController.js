import UserModel from "../models/user.js"; // Import the User model for database interactions
import bcrypt from 'bcrypt'; // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for handling JWT
import transporter from "../config/emailConfig.js";

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
                        const hashPassword = await bcrypt.hash(password, salt)

                        // Create a new user document with the provided data
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword, // Hash the password before saving
                            tc: tc
                        })

                        // Save the new user to the database
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email })
                        // Generate JWT token
                        const token = jwt.sign({ user_id: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        // Send success response if user is registered
                        res.send({ "status": "success", "message": "Registration successful.", "token": token })

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

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {

                        // Generate JWT token
                        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.send({ "status": "success,", "message": "Login successful...", "token": token })
                    } else {
                        res.send({ "status": "failed", "message": "Invalid credentials." });
                    }
                } else {
                    res.send({ "status": "failed", "message": "You are not registerd User." });
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required." });
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({ "status": "failed", "message": "Unable to Login" });
        }

    }

    static changePassword = async (req, res) => {
        const { password, password_confirmation } = req.body
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "Password and confirm password do not match." });
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
                    res.send({"status": "success", "message":"Password changed successfully"})
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required." });
            }
    }

    static loggedUser = (req,res)=>{
        res.send({"user":req.user})

    }

    static sendUserPasswordResetEmail = async(req,res)=>{
        const { email } = req.body
        if (email){
            const user = await UserModel.findOne({email:email})
            if (user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id},secret,{expiresIn:'5m'})
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)

                // Send email with the link to reset password
                let info  =  await transporter.sendMail({
                    from : process.env.EMAIL_FROM,
                    to : user.email,
                    subject : "Reset Password Link",
                    html: `<a href=${link}>Click Here</a> to Reset Your Password`,
                })
               
                res.send({"status":"success","message":"Password Reset Email Sent... Please Check Your Email","info":info})
            }else{
                res.send({"status": "failed", "message": "Email does not exist"})
            }
        }else{
            res.send({"status": "failed", "message": "Email is required."})
        }

    }

    static userPasswordRest = async (req,res) =>{
        const {password,password_confirmation} = req.body
        const {id,token} = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,new_secret)
            if (password && password_confirmation){
                if (password!==password_confirmation){
                    res.send({"status": "failed", "message": "Password and confirm password do not match."})
                }else {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}}) 
                    res.send({ "status": "success", "message": "Password Reset Successfully" })
                }
            }else {
                res.send({"status": "failed", "message": "All fields are required."})
            }

        }catch (error) {
            console.log(error)
            res.status(500).send({"status": "failed", "message": "Unable to Reset Password"})
        }
    }
}

export default UserController; // Export the UserController class for use in routes
