<script>
  export let isOpen = false;

  function closeModal() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-auto">
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        on:click={closeModal}
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
{/if}
