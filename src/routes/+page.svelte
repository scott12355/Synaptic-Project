<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/db';
	import type { User } from '@supabase/supabase-js';
	import Home from '$lib/Home.svelte';
	import Landing from '$lib/Landing.svelte';

	let user: User;

	onMount(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			user = session?.user ?? null;
		});

		const {
			data: { subscription: authListener }
		} = supabase.auth.onAuthStateChange((_, session) => {
			const currentUser = session?.user;
			user = currentUser ?? null;
		});

		return () => {
			authListener?.unsubscribe();
		};
	});
</script>

<div class="w-full h-full bg-200">
	{#if user}
		<!-- Show Home page if user is logged in -->
		<Home bind:user />
	{:else}
		<!-- Show Landing page -->
		<div class="min-w-full min-h-screen flex items-center justify-center">
			<Landing />
		</div>
	{/if}
</div>
