import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse} from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
        const result = await resend.emails.send({
            from:'Mystery Message <onboarding@resend.dev>',
            to:email,
            subject:'Mystery Message | Verification code',
            react:VerificationEmail({username,otp:verifyCode})
        });
        if (result?.error) {
            console.error("Resend API error:", result.error)
            return{success:false,message: result.error.message ?? 'failed to send verification email'}
        }
        return{success:true,message:'Verification email sent successfully'}
    }catch(emailError:any){
        console.error("Error sending verification email", emailError?.message ?? emailError)
        return{success:false,message: emailError?.message ?? 'failed to send verification email'}
    }
}