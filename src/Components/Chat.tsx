"use client"
import { Chat, ChatDTO, Faculty, QUEUEIT_URL, User } from '@/Utils/Global_variables'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import { IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { useUserContext } from '@/Contexts/AuthContext'
import { useWebSocket } from '@/WebSocket/WebSocketContext'

interface ChatProps {
  faculty: Faculty | null
}

const Chat: React.FC<ChatProps> = ({ faculty }) => {
    const user = useUserContext().user
    const inputRef = useRef<HTMLInputElement>(null) // Use useRef for the input field
    const client = useWebSocket()
    const [chats, setChats] = useState([]);
    useEffect(() => {
        if (client && faculty) {
            const subscription = client.subscribe(`/topic/chat/adviser/${faculty.uid}`, (message) => {
                const receivedMessage:ChatDTO = JSON.parse(message.body);
                console.log(receivedMessage)
                setChats((prev)=> [...prev, receivedMessage])
            });

            return () => {
                console.log('Unsubscribing');
                subscription.unsubscribe();
            };
        }
    }, [client, faculty]);

    const sendMessage = async () => {
        // Check if the input field is available and the user and faculty exist
        if (!inputRef.current || !user || !faculty) {
        return
        }

        const message = inputRef.current.value
        if (message.trim() === '') {
        return
        }

        try {
        const response = await fetch(`${QUEUEIT_URL}/chat`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', // Set proper header for JSON
            },
            body: JSON.stringify({
            userID: user.uid,
            adviserID: faculty.uid,
            message,
            firstname: user.firstname,
            lastname: user.lastname,
            }),
        })
        // Optionally clear the input after sending the message
        inputRef.current.value = ''
        } catch (err) {
        console.error('Error sending message:', err)
        }
    }

    return (
        <div className='border-2 p-3 border-black rounded-md bg-white flex flex-col flex-grow min-h-96 justify-end'>
            <div className='overflow-auto flex flex-col h-80 md:h-full lg:h-full xl:h-full'>
                {faculty ? (
                    <Typography variant='subtitle2' fontWeight={'bold'} className='text-center'>
                        Welcome to {capitalizeFirstLetter(faculty.firstname)} {`${capitalizeFirstLetter(faculty.lastname)}'s chat.`}
                    </Typography>
                    ) : (
                    <></>
                )}
                {chats.map((chat:ChatDTO,index)=>(
                    <div key={index} style={{display:'flex',justifyContent:chat.userID==user?.uid?'end':'start', flexDirection:chat.userID == user?.uid?'row-reverse':'row', gap:'8px', maxWidth:'100%', overflow:'hidden',flexGrow:1}}>
                        <div id="chatProfile"></div>
                        <div style={{display:'flex', flexDirection:'column', flexGrow:1, maxWidth:'100%'}}>
                            <div style={{fontSize:'0.7em',alignSelf:chat.userID == user?.uid?'end':'', color:'gray'}}>{`${chat.firstname.charAt(0).toUpperCase()}${chat.firstname.slice(1)} ${chat.lastname.charAt(0).toUpperCase()}${chat.lastname.slice(1)}`}</div>
                            <div style={{backgroundColor:'rgba(217,217,217,0.5)', paddingBlock:'5px', borderRadius:'20px', paddingInline:'15px', display:'flex',wordBreak:'break-word', maxWidth:'70%',alignSelf:chat.userID == user?.uid?'end':'start'}}>
                                {chat.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex justify-self-end'>
                <input
                ref={inputRef} // Attach ref to the input element
                id='message'
                type='text'
                className='border-2 border-black rounded-md p-3 flex-grow text-black'
                />
                <IconButton onClick={sendMessage}>
                <SendIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
