import React from 'react'
import MessageBubble from './MessageBubble'

function MessageList({messages}) {
  return (
    //render messages in Message Bubbles
    <>
{messages.map((msg, index) => (
          <MessageBubble
            key={index}
            content={msg.content}
            role={msg.role}
            isLast={index === messages.length - 1}
          />
        ))}
    </>
  )
}

export default MessageList