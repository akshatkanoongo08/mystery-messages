import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { verifySchema } from "@/Schemas/verifySchema";

const VerifyCodeSchema=z.object({
    code:verifySchema.shape.code
})

export async function POST(request:Request){
    await dbConnect()
    try{
            const {username,code}=await request.json()
            await request.json()
            const decodedUsername=decodeURIComponent(username)
            const user= await UserModel.findOne({username:decodedUsername})
            if(!user){
                return Response.json(
                    {
                        success:false,
                        message:"User not found"
                    },
                    {status:404}
                )
            }
          const iscodeValid=user.verifycode===code
          const isCodeNotExpired=user.verifycodeExpiry>new Date()
          if(!iscodeValid || !isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message:"Invalid or expired code"
                },
                {status:400}
            )
          }
          user.isVerified=true
          await user.save()
          return Response.json({success:true,message:"Code verified successfully"})
          
    } catch(error) {
        console.error("Error verifying code",error)
        return Response.json(
            {
                success:false,
                message:"Error verifying code"
            },
            {status:500}
        )
    }
    
}
