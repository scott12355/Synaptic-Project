<script lang="ts">
	import { supabase } from './db';
	import { chatbot } from './chatbot';
	import UpdateUserName from '$lib/UpdateUserName.svelte';
	import ChatSuggestions from './ChatSuggestions.svelte';
	export let user;
	let showModal = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	function closeAuth() {
		dispatch('closeAuth');
	}
	let userInput: string = '';
	let allowSend = false;
	let awaitingResponse = false;
	// Add this reactive statement to control allowSend
	$: allowSend = userInput.trim().length > 0 && !awaitingResponse;

	// Load chat history on component mount
	import { onMount } from 'svelte';
	let chatList = [];

	onMount(async () => {
		chatList = await getChatHistory();
	});

	import { writable } from 'svelte/store';
	export const currentChatHistory = writable([]);

	// example chat history
	//   [
	//   {
	//     "role": "user",
	//     "content": "hi"
	//   },
	//   {
	//     "role": "api",
	//     "content": "Hello! How can I assist you today?"
	//   },
	//   {
	//     "role": "user",
	//     "content": "whats the weather in MCR"
	//   }
	// ]
	async function getChatHistory() {
		const { data, error } = await supabase
			.from('chats')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching chat history:', error);
			return [];
		}

		// Transform the data to match the chat list format
		return (data || []).map((chat) => ({
			id: chat.id,
			name: chat.chat_name, // You might want to customize this
			lastMessage: chat.chat_history[0].content || 'No messages',
			allMessages: chat.chat_history,
			timestamp: new Date(chat.created_at).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})
		}));
	}

	let selectedChat = null;
	let isNewChat = false;

	function handleNewChat() {
		selectedChat = null;
		isNewChat = true;
		currentChatHistory.set([]);
	}

	function selectChat(chatId) {
		selectedChat = chatId;
		isNewChat = false;
		const chat = chatList.find((chat) => chat.id === chatId);
		currentChatHistory.set(chat?.allMessages || []);
	}

	async function handleLogout() {
		await supabase.auth.signOut();
		closeAuth();
	}

	async function handleSendMessage() {
		if (!userInput.trim()) return;

		const newMessage = {
			role: 'user',
			content: userInput.trim()
		};
		userInput = '';
		let messageFromChatId = null;
		awaitingResponse = true;

		// If there's no selected chat, create a new one
		if (!selectedChat) {
			const { data: newChat, error } = await supabase
				.from('chats')
				.insert([
					{
						user_id: user.id,
						chat_history: [newMessage],
						chat_name: 'Chat ' + (chatList.length + 1)
					}
				])
				.select()
				.single();

			if (error) {
				console.error('Error creating new chat:', error);
				return;
			}

			// Add the new chat to the chat list
			const formattedChat = {
				id: newChat.id,
				name: 'Chat ' + (chatList.length + 1),
				lastMessage: newMessage.content,
				allMessages: [newMessage],
				timestamp: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				})
			};
			chatList = [formattedChat, ...chatList];
			selectedChat = newChat.id;
			messageFromChatId = newChat.id;
		} else {
			messageFromChatId = selectedChat;
		}

		currentChatHistory.update((messages) => [...(messages || []), newMessage]);
		const response = await chatbot($currentChatHistory, messageFromChatId);
		if (response) {
			chatList = await getChatHistory();
			selectChat(messageFromChatId);
		}

		// currentChatHistory.update((msgs) => [...msgs, apiMessage]);
		awaitingResponse = false;
	}

	// Add these at the top with other state variables
	let isKeyboardOpen = false;
	let inputElement: HTMLInputElement;

	// Add this function
	function dismissKeyboard() {
		if (inputElement) {
			inputElement.blur();
		}
		isKeyboardOpen = false;
	}

	// Add these event handlers
	function handleFocus() {
		isKeyboardOpen = true;
	}

	function handleBlur() {
		isKeyboardOpen = false;
	}
</script>

<!-- Header with Welcome and Logout -->
<div
	class="bg-white border-b border-gray-200 p-2 md:p-4 {selectedChat || isNewChat
		? 'hidden md:block'
		: 'block'}"
>
	<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
		<h1 class="text-xl md:text-2xl font-bold truncate">
			Welcome, {user.email}
		</h1>
		<div class="flex gap-2 md:gap-4">
			<button
				on:click={() => (showModal = true)}
				class="text-blue-500 hover:text-blue-700 text-sm md:text-base"
			>
				Update Profile
			</button>
			<button
				on:click={handleLogout}
				class="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-red-600 text-sm md:text-base"
			>
				Logout
			</button>
		</div>
	</div>
</div>

<!-- Chat Interface -->
<div class="h-[calc(100vh-73px)] flex flex-col md:flex-row">
	<!-- Left Panel - Chat List -->
	<div
		class="w-full md:w-1/4 bg-gray-100 border-r border-gray-200 flex flex-col {selectedChat ||
		isNewChat
			? 'hidden md:flex'
			: 'flex'}"
	>
		<div class="p-4 border-b border-gray-200">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold">Chats</h2>
				<button
					on:click={handleNewChat}
					class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
				>
					New Chat
				</button>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto">
			{#each chatList as chat}
				<div
					class="p-4 border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
					class:bg-gray-200={selectedChat === chat.id}
					on:click={() => selectChat(chat.id)}
				>
					<h3 class="font-medium">{chat.name}</h3>
					<p class="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
					<span class="text-xs text-gray-500">{chat.timestamp}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Main Chat Window -->
	<div class="flex-1 flex flex-col h-full relative">
		<!-- Chat Header -->
		<div
			class="fixed md:sticky top-0 left-0 right-0 z-10 bg-white p-4 border-b border-gray-200 {selectedChat ||
			isNewChat
				? 'flex'
				: 'hidden'}"
		>
			<div class="flex items-center gap-4">
				<button
					class="md:hidden text-blue-500"
					on:click={() => {
						selectedChat = null;
						isNewChat = false;
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<h2 class="text-xl font-semibold">
					{#if selectedChat}
						{chatList.find((chat) => chat.id === selectedChat)?.name}
					{:else}
						New Chat
					{/if}
				</h2>
			</div>
		</div>

		<!-- Messages Container -->
		<div
			class="flex-1 overflow-y-auto {selectedChat || isNewChat
				? 'pt-[64px] md:pt-0 pb-[76px] md:pb-[84px]'
				: ''}"
			style="height: {selectedChat || isNewChat ? 'calc(100vh - 73px)' : '100%'}"
		>
			{#if selectedChat}
				<!-- Chat Messages -->
				<div class="p-4">
					{#each $currentChatHistory as message}
						<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
							<div
								class="inline-block rounded-lg px-4 py-2 max-w-[85%] md:max-w-[70%] {message.role ===
								'user'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-gray-800'}"
							>
								<p class="break-words">{message.content}</p>
							</div>
							<div class="text-xs text-gray-500 mt-1">
								{message.role === 'user' ? 'You' : 'AI'}
							</div>
						</div>
					{/each}

					<!-- Add this loading indicator -->
					{#if awaitingResponse}
						<div class="mb-4 text-left">
							<div class="inline-block rounded-lg px-4 py-2 bg-gray-200">
								<div class="flex items-center gap-2">
									<div
										class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
										style="animation-delay: 0ms"
									/>
									<div
										class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
										style="animation-delay: 150ms"
									/>
									<div
										class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
										style="animation-delay: 300ms"
									/>
								</div>
							</div>
							<div class="text-xs text-gray-500 mt-1">AI is typing...</div>
						</div>
					{/if}
				</div>
			{:else if isNewChat}
				<!-- New Chat View -->
				<div class="flex-1 flex flex-col items-center justify-center p-4">
					<ChatSuggestions
						on:suggestionClick={(event) => {
							userInput = event.detail;
							handleSendMessage();
						}}
					/>
				</div>
			{:else}
				<!-- Empty State -->
				<div class="flex-1 flex items-center justify-center text-gray-500">
					Select a chat or start a new one
				</div>
			{/if}
		</div>

		<!-- Message Input (Fixed to bottom) -->
		<div
			class="fixed md:absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2 md:p-4 {selectedChat ||
			isNewChat
				? 'block'
				: 'hidden'}"
		>
			{#if isKeyboardOpen}
				<button
					on:click={dismissKeyboard}
					class="md:hidden absolute -top-10 right-2 bg-gray-800/70 text-white px-3 py-1 rounded-t-lg text-sm"
				>
					Done
				</button>
			{/if}
			<div class="flex gap-2 max-w-[100vw] md:max-w-full px-2">
				<input
					bind:this={inputElement}
					bind:value={userInput}
					type="text"
					placeholder="Type a message..."
					class="flex-1 rounded-lg border border-gray-300 px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:border-blue-500 text-base appearance-none"
					on:keydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey && allowSend) {
							e.preventDefault();
							handleSendMessage();
						}
					}}
					on:focus={handleFocus}
					on:blur={handleBlur}
					autocomplete="off"
					autocorrect="on"
					autocapitalize="sentences"
				/>
				<button
					on:click={handleSendMessage}
					disabled={!allowSend}
					class="bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex-shrink-0 flex items-center gap-2"
				>
					{#if awaitingResponse}
						<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{/if}
					Send
				</button>
			</div>
		</div>
	</div>
</div>

<UpdateUserName {user} bind:showModal />
