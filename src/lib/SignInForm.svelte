<script>
  import { supabase } from "./db";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let email = "";
  let password = "";
  let loading = false;
  let error = null;

  async function handleSignIn() {
    try {
      loading = true;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full max-w-md">
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Welcome</h2>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {error}
    </div>
  {/if}

  <form class="space-y-4">
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        bind:value={email}
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        bind:value={password}
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        placeholder="Enter your password"
      />
    </div>

    <div class="flex gap-4">
      <button
        type="button"
        on:click={handleSignIn}
        disabled={loading}
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Sign In"}
      </button>
    </div>
  </form>

  <div class="text-center mt-4">
    <button
      type="button"
      class="text-gray-600 hover:text-gray-800"
      on:click={() => dispatch("switchToSignUp")}
    >
      Don't have an account? Sign up
    </button>
  </div>
</div>
