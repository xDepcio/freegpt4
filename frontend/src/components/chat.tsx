import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { renderMarkdown } from "@/lib/utils";

type ChatMessage = {
    content: string,
    role: "assistant" | "user"
}

type Chat = ChatMessage[]

async function getCompletions(chat: Chat) {
    const response = await fetch('/api/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat
        })
    });
    const data = await response.text();
    return data;
}

export default function Chat() {
    const [inputQuestion, setInputQuestion] = useState('' as string)
    const [markdownResponse, setMarkdownResponse] = useState('' as string)
    const [chat, setChat] = useState([] as Chat)

    const handleQuestionSubmit = async () => {
        console.log(inputQuestion)
        setChat((prevChat) => [...prevChat, { content: inputQuestion, role: 'user' }])
        const completions = await getCompletions([...chat, { content: inputQuestion, role: 'user' }]);
        setChat((prevChat) => [...prevChat, { content: completions, role: 'assistant' }])
        setMarkdownResponse(completions);
    }

    useEffect(() => {
        if (markdownResponse) {
            const markdownContainer = document.getElementById('markdown-container');
            if (markdownContainer) {
                const htmlContent = renderMarkdown(markdownResponse);
                markdownContainer.innerHTML = htmlContent;
            }
        }

    }, [markdownResponse])

    useEffect(() => {
        const markdown = chat.map((message) => {
            return `**${message.role}:** ${message.content}`
        }).join('\n\n');
        setMarkdownResponse(markdown)
    }, [chat])

    return (
        <main className="dark:bg-zinc-900 min-h-screen min-w-full">
            <div className="max-w-screen-lg mx-auto flex flex-col justify-between h-screen">
                <div className="py-6" id='markdown-container'>
                    dsd
                </div>
                <div className="py-6">
                    <Textarea
                        value={inputQuestion}
                        onChange={(e) => {
                            console.log(inputQuestion)
                            setInputQuestion(e.target.value)
                        }}
                        placeholder="Enter your prompt"
                    />
                    <Button onClick={handleQuestionSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </main>
    )
}
