<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const suggestions = [
    "What is the weather in Manchester?",
    "What is the weather in London?",
    "What is the weather in Liverpool?",
    "What is the weather in Leeds?",
    "What is the weather in Sheffield?",
  ];

  let currentSuggestion = suggestions[0];
  let currentIndex = 0;

  onMount(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % suggestions.length;
      currentSuggestion = suggestions[currentIndex];
    }, 6000);

    return () => clearInterval(interval);
  });
</script>

<div class="flex flex-col items-center gap-4 text-center">
  <h3 class="text-xl text-gray-700">Start a new conversation</h3>
  <div class="h-20 flex items-center">
    <p class="text-gray-500 transition-opacity duration-300">
      Try: "{currentSuggestion}"
    </p>
  </div>
  <div class="flex gap-2">
    {#each suggestions.slice(0, 3) as suggestion}
      <button
        class="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
        on:click={() => dispatch("suggestionClick", { detail: suggestion })}
      >
        {suggestion.slice(0, 20)}...
      </button>
    {/each}
  </div>
</div>
