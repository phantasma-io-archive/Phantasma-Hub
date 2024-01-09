<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { type ConsensusPoll } from 'phantasma-ts/src';
	import PollListItem from './PollListItem.svelte';
	import { PollState } from 'phantasma-ts';
	export let polls: ConsensusPoll[] = [];
	let filteredPolls = polls;

	$: if (polls.length > 0) {
		filteredPolls = polls;
	}

	let filter: number;
	function onPollChange(e) {
		if (filter == -1) {
			filteredPolls = polls;
		} else if (filter == 1) {
			filteredPolls = polls.filter((poll) => poll.state == PollState.Active);
		} else if (filter == 2) {
			filteredPolls = polls.filter((poll) => poll.state == PollState.Consensus);
		} else if (filter == 3) {
			filteredPolls = polls.filter(
				(poll) => poll.state == PollState.Failure || poll.state == PollState.Inactive
			);
		}
	}
</script>

<Card
	size="xl"
	title="Consensus Poll List"
	description="All the consensus polls that are currently active."
>
	<div>
		<h5 class="mb-0 font-bold">Filters</h5>
		<select class=" w-2/3 mt-2 py-4" bind:value={filter} on:change={onPollChange}>
			<option value="-1" selected>All</option>
			<option value="1">Active</option>
			<option value="2">Consensus</option>
			<option value="3">Failure</option>
		</select>
	</div>
	<div class="flex flex-col justify-between">
		{#each filteredPolls as poll}
			<div class="my-2">
				<PollListItem bind:id={poll.organization} {poll} />
			</div>
		{/each}
	</div>
</Card>
