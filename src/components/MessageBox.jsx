import React from 'react'

function MessageBox({msg, idx, isMe}) {
    const formatTime = (dateStr) =>
        new Date(dateStr).toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit'
        });
    return (
        <div
            key={idx}
            className={`my-2 px-4 py-2 max-w-[70%] rounded-xl relative ${isMe ? 'bg-blue-500/10 text-white self-end ml-auto' : 'bg-blue-900/90 text-white self-start mr-auto'
                }`}
        >
            <div className="text-sm font-semibold mb-1 text-purple-200">
                {isMe ? "You" : msg.senderName}
            </div>

            {/* 💬 Text */}
            <div>{msg.text}</div>

            {/* 🕒 Time */}
            <div className="text-xs text-gray-300 absolute bottom-1 right-2">
                {formatTime(msg.createdAt)}
            </div>
        </div>
    )
}

export default MessageBox
