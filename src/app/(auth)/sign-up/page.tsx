'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import {useDebounceCallback} from 'usehooks-ts'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"
function page() {
    const [username,setUsername]=useState('')
    const[usernameMessage,setUsernameMessage]=useState('')
    const[isCheckingusername,setIsCheckingUsername]=useState(false)
    const [isSubmitting,setIsSubmitting]=useState(false)
    const debounced=useDebounceCallback(setUsername,300)
    const router=useRouter()

    //zod implementation
    const form=useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })
    useEffect(()=>{
        const CheckUsernameUnique=async()=>{
        if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try{
                const response=await axios.get(`/api/check-username-unique?username=${username}`)
                setUsernameMessage(response.data.message)
            }catch(error){
                const axiosError=error as AxiosError<ApiResponse>;
                setUsernameMessage(
                    axiosError.response?.data.message ?? "Error checking username"
                )
            } finally{
                setIsCheckingUsername(false)
            }
        }
    }
        CheckUsernameUnique()
        },[username])
    


    const onSubmit=async(data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true)
        try{
          const response=await axios.post<ApiResponse>('/api/sign-up',data);
          toast(response.data.message)
          router.replace(`/verify/${username}`)
          setIsSubmitting(false)
        }catch(error){
            console.error("Error in signup of user",error)
            const axiosError=error as AxiosError<ApiResponse>;
            let errorMessage=axiosError.response?.data.message;
            toast(errorMessage)
            setIsSubmitting(false)
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">

                <h1 className="text-4xl font-extrabold tracing-tight lg:text-5xl mb-6">
                    Join Mystery Message
                </h1>
                <p className="mb-4">Signup to start your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
            name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e)=>{
                    field.onChange(e)
                    debounced(e.target.value)
                }} />    
              </FormControl>
              {isCheckingusername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' :'text-red-500'}`}>
                test{usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
            name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}> 
           {
            isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 animate-spin" />please wait
                </>
            ):('Signup')
        }
        </Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default page