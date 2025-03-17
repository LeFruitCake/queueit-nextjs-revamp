import { NotificationRecipient, NotificationType } from '@/Utils/Global_variables'
import { randomAvatar, randomGroupImage } from '@/Utils/Utility_functions'
import { Typography } from '@mui/material'
import React, { useRef } from 'react'

interface NotificationProps{
    notification:NotificationRecipient
}

const Notification:React.FC<NotificationProps> = ({notification}) => {
    const  avatar = useRef(notification.notification.notificationType === NotificationType.TEAM_ENQUEUE?randomGroupImage():randomAvatar())
    return (
        <div className={`flex relative border-2 p-3 shadow-md ${notification.notification.notificationType === NotificationType.APPOINTMENT_CANCELLED || notification.notification.notificationType === NotificationType.QUEUEING_CLOSE || notification.notification.notificationType === NotificationType.APPOINTMENT_DEFAULTED?'shadow-red-300':
            notification.notification.notificationType === NotificationType.AUTOMATED_APPOINTMENT_STARTED?'shadow-blue-300':'shadow-green-300'
         }`}>
                <img src={avatar.current} alt="avatar" style={{height:'15%', width:'15%'}}/>
            <div className='flex-1 flex flex-col justify-center'>
                <Typography variant='subtitle2' fontWeight={"bold"}>{notification.notification.notificationMessage}</Typography>
                <Typography variant='caption' color='gray'>{new Date(notification.notification.dateTimeGenerated).toDateString()}</Typography>
            </div>
        </div>
    )
}

export default Notification
