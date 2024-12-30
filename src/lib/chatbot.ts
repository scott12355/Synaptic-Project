import { supabase } from "./db";

const apiEndpoint = 'https://scott12355-dockettest.hf.space/chat';

export async function keepBotOnline() {
    let conversationHistory =
        [{ role: "user", content: "reply with only 1 letter" }]
        ;
    try {
        console.log(conversationHistory)
        // Make the POST request
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conversationHistory }) // Send the text as JSON
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from API.');
        }
        const data = await response.json();
        console.log(data.output);
        return true;
        // Add API response to the messages array
    } catch (error) {
        console.error('Error:', error);

    }

}

export async function chatbot(conversationHistory: any, messageFromChatId: any) {
    try {
        console.log(conversationHistory)
        // Make the POST request
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conversationHistory }) // Send the text as JSON
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from API.');
        }

        const data = await response.json();

        const apiMessage = { role: "api", content: data.output };
        conversationHistory.push(apiMessage);

        // Update the chat history in Supabase
        const { error: updateError } = await supabase
            .from("chats")
            .update({
                chat_history: conversationHistory,
            })
            .eq("id", messageFromChatId);

        if (updateError) {
            console.error("Error updating chat history:", updateError);
        }
        return true;
        // Add API response to the messages array
    } catch (error) {
        console.error('Error:', error);

    }
}
