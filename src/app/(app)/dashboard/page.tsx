"use client"

import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@react-email/components"
import axios, { AxiosError } from "axios"
import { X } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"


const page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form;

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>("api/accept-messages")
            setValue("acceptMessages", response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages")
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing latest messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    //handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages", {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            toast({
                title: response.data.message,
                variant: "default"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        }
    }

    const { username } = session?.user as User
    //TODO: there is more way to include url in code 

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL copied",
            description: "Profile url is copied to clipboard",
        })
    }

    if (!session || !session.user) {
        return <div>Please login</div>
    }
    return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen text-white p-8 rounded-lg shadow-lg">
            <div className="mb-6">
                <h1 className="text-4xl font-extrabold text-center text-yellow-400">Welcome, {session.user.username}!</h1>
            </div>

            {/* Profile URL Section */}
            <div className="mb-8 flex justify-center">
                <Button
                    onClick={copyToClipboard}
                    className="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 transition-all ease-in-out duration-300 rounded-lg text-lg font-semibold shadow-xl"
                >
                    Copy Profile URL
                </Button>
            </div>

            {/* Accept Messages Switch */}
            <div className="mb-8 flex items-center justify-center space-x-6">
                <label htmlFor="acceptMessages" className="text-2xl font-bold text-yellow-300">Accept Messages</label>
                <Switch
                    id="acceptMessages"
                    checked={acceptMessages}
                    onChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 hover:scale-110 transition-all ease-in-out duration-300 rounded-full w-14 h-7"
                />
                {isSwitchLoading && <span className="text-lg text-gray-300">Loading...</span>}
            </div>

            {/* Messages List */}
            <div className="mt-10">
                <h2 className="text-3xl font-bold text-center text-yellow-300 mb-5">Messages</h2>
                {isLoading ? (
                    <div className="text-center text-xl text-gray-300">Loading Messages...</div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message._id as string}
                                className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:scale-105 transition-all duration-300 rounded-xl shadow-xl"
                            >
                                <div className="text-white">
                                    <p className="text-2xl font-bold">{message.title}</p>
                                    <p className="mt-2 text-lg">{message.content}</p>
                                </div>
                                <Button
                                    onClick={() => handleDeleteMessage(message._id as string)}
                                    className="bg-red-500 hover:bg-red-400 transition-all ease-in-out duration-300 rounded-full p-2"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

 export default page