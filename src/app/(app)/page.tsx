"use client"

import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@react-email/components"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


const HomePage = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    // Fetch messages on load
    const fetchMessages = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/get-messages')
            const data = await response.json()
            setMessages(data.messages || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch messages",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (session?.user) {
            fetchMessages()
        }
    }, [session, fetchMessages])

    // Render message cards inside the carousel
    const renderMessagesCarousel = () => {
        return messages.map((message, index) => (
            <CarouselItem key={message._id as string}>
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:scale-105 transition-all duration-300 rounded-xl shadow-xl mb-6">
                    <div className="text-white">
                        <h3 className="font-bold text-xl">{message.title}</h3>
                        <p className="text-sm mt-2">{message.content}</p>
                    </div>
                    <Button
                        onClick={() => alert('Message accepted')}
                        className="px-4 py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
                    >
                        Accept
                    </Button>
                </div>
            </CarouselItem>
        ))
    }

    if (!session?.user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-xl font-semibold text-gray-700">Please log in to see your messages</h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome back, {session.user.name}!
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Here are your latest messages.
                    </p>
                </header>

                {/* Carousel Section */}
                {isLoading ? (
                    <div className="text-center">
                        <p className="text-gray-600">Loading messages...</p>
                    </div>
                ) : (
                    <Carousel plugins={[Autoplay({ delay: 3000 })]}>
                        <CarouselContent>
                            {renderMessagesCarousel()}
                        </CarouselContent>

                        <CarouselPrevious>
                            <Button className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 transition-all rounded-md">
                                Previous
                            </Button>
                        </CarouselPrevious>

                        <CarouselNext>
                            <Button className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 transition-all rounded-md">
                                Next
                            </Button>
                        </CarouselNext>
                    </Carousel>
                )}

                {/* Profile Section */}
                <div className="mt-10 text-center">
                    <Button
                        onClick={() => window.location.href = `/u/${session.user.username}`}
                        className="px-6 py-3 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-all"
                    >
                        Visit Your Profile
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HomePage
