<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { ConsoleOutput } from '$lib/store';
	let _consoleOutput = '';
	ConsoleOutput.subscribe((value) => {
		_consoleOutput = value;
	});
</script>

<Card size="xl" title="Console" description="Call output" class="mb-20">
	<textarea
		class="w-full shadow-md bg-slate-200 border-r-2 rounded-2xl p-4"
		rows="10"
		id="contractMethodOutput"
		bind:value={_consoleOutput}
		disabled
	/>
</Card>
