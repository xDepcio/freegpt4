import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { renderMarkdown } from "@/lib/utils";

async function getCompletions(question: string) {
    const response = await fetch('http://localhost:8080/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            question
        })
    });
    const data = await response.text();
    return data;
}

export default function Chat() {
    const [question, setQuestion] = useState('' as string)
    const [markdownResponse, setMarkdownResponse] = useState('' as string)

    const handleQuestionSubmit = useCallback(async () => {
        const completions = await getCompletions(question);
        setMarkdownResponse(completions);
    }, [])

    useEffect(() => {
        if (markdownResponse) {
            const markdownContainer = document.getElementById('markdown-container');
            if (markdownContainer) {
                const htmlContent = renderMarkdown(markdownResponse);
                markdownContainer.innerHTML = htmlContent;
            }
        }

    }, [markdownResponse])

    return (
        <main className="dark:bg-zinc-900 min-h-screen min-w-full">
            <div className="max-w-screen-lg mx-auto flex flex-col justify-between h-screen">
                <div className="py-6" id='markdown-container'>
                    dsd
                </div>
                <div className="py-6">
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
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
