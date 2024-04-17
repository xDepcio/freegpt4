import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { renderMarkdown } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import 'highlight.js/styles/github-dark.css';
import ReactDOM from 'react-dom';
import { IoClipboardOutline } from "react-icons/io5";

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



function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((codeBlock) => {
        const copyDiv = document.createElement('div');
        copyDiv.style.position = 'absolute';
        copyDiv.style.top = '0.5rem';
        copyDiv.style.right = '0.5rem';
        codeBlock.appendChild(copyDiv);
        // @ts-ignore
        codeBlock.style.position = 'relative';
        const CopyButton =
            <Button onClick={() => {
                navigator.clipboard.writeText(codeBlock.children[0].textContent || '');
            }} className="text-xs dark:bg-zinc-700 text-zinc-100 gap-2 px-2 h-fit py-2">
                <IoClipboardOutline />
                <p>copy code</p>
            </Button>
        const reactElement = React.createElement(CopyButton.type, CopyButton.props);
        ReactDOM.render(reactElement, copyDiv);
    });

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
                addCodeCopyButtons()
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
        <main className="min-h-screen min-w-full h-full dark:bg-zinc-800">
            <ModeToggle />
            <div className="max-w-screen-md mx-auto flex flex-col justify-between h-screen">
                <div className="py-6" id='markdown-container'>
                    dsd
                </div>
                <div className="py-6">
                    <Textarea
                        className="dark:bg-zinc-900"
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
