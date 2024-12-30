<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  import SignInForm from "./SignInForm.svelte";
  import Auth_SignUp from "./SignUpForm.svelte";

  const dispatch = createEventDispatcher();

  let isSignInModalOpen = false;
  let isSignUpModalOpen = false;

  function openAuth() {
    isSignInModalOpen = true;
  }

  function switchToSignUp() {
    isSignInModalOpen = false;
    isSignUpModalOpen = true;
  }

  function switchToSignIn() {
    isSignUpModalOpen = false;
    isSignInModalOpen = true;
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400"
>
  <div class="w-full px-6 py-16">
    <!-- Hero Section -->
    <div class="flex flex-col items-center text-center mb-16">
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
        Scotts Synaptic project test sandbox
      </h1>
      <p class="text-xl text-white mb-8 max-w-2xl drop-shadow">
        Testing out Svelte Auth with Supabase backend.
      </p>
      <div class="flex gap-4">
        <button
          on:click={openAuth}
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-8 mt-12">
      <!-- Feature 1 -->
      <div
        class="backdrop-blur-md bg-white/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-white/20"
      >
        <div class="text-white mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-white">Secure by Default</h3>
        <p class="text-white/90">
          Built with security best practices and modern encryption standards.
        </p>
      </div>

      <!-- Feature 2 -->
      <div
        class="backdrop-blur-md bg-white/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-white/20"
      >
        <div class="text-white mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
        <p class="text-white/90">
          Optimized performance with Svelte's reactive architecture.
        </p>
      </div>

      <!-- Feature 3 -->
      <div
        class="backdrop-blur-md bg-white/30 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-white/20"
      >
        <div class="text-white mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-white">Easy Integration</h3>
        <p class="text-white/90">
          Simple setup with Supabase authentication and database.
        </p>
      </div>
    </div>
  </div>
</div>

<Modal bind:isOpen={isSignInModalOpen}>
  <SignInForm on:switchToSignUp={switchToSignUp} />
</Modal>

<Modal bind:isOpen={isSignUpModalOpen}>
  <Auth_SignUp on:switchToSignIn={switchToSignIn} />
</Modal>
