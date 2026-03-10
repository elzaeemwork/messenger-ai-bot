// components/conversations/MessageBubble.tsx — Chat message bubble with avatars

import { Bot, User } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isBot = message.role === 'assistant';

    return (
        <div className={cn('flex gap-3 mb-4', isBot ? 'flex-row' : 'flex-row-reverse')}>
            <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full shrink-0',
                isBot ? 'bg-gradient-to-br from-indigo-500 to-cyan-500' : 'bg-slate-700'
            )}>
                {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
            </div>
            <div className={cn(
                'max-w-[70%] rounded-2xl px-4 py-3',
                isBot
                    ? 'bg-slate-800/80 border border-slate-700 rounded-tl-md'
                    : 'bg-indigo-500/20 border border-indigo-500/30 rounded-tr-md'
            )}>
                <p className="text-sm text-slate-200 whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-500">
                        {formatDate(message.created_at, 'HH:mm')}
                    </span>
                    {isBot && message.tokens_used > 0 && (
                        <span className="text-[10px] text-slate-600">
                            {message.tokens_used} tokens
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
