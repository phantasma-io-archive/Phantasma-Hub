<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { type ConsensusPoll } from 'phantasma-ts/src';
	import PollListItem from './PollListItem.svelte';
	export let polls: ConsensusPoll[] = [];
</script>

<Card
	size="xl"
	title="Consensus Poll List"
	description="All the consensus polls that are currently active."
>
	<div class="flex flex-col justify-between">
		{#each polls as poll}
			<div class="my-2">
				<PollListItem bind:id={poll.organization} {poll} />
			</div>
		{/each}
	</div>
</Card>
