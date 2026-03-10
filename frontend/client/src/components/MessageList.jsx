import React from 'react'
import MessageBubble from './MessageBubble'

function MessageList({messages}) {
  return (
    <>
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} content={msg.content} role={msg.role} />
      ))}
    </>
  )
}

export default MessageList