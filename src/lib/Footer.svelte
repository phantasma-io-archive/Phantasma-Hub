<script type="ts">
	import Icon from '@iconify/svelte';
</script>

<footer class="pt-4 ">
	<div class="w-full px-6 mx-auto">
		<div class="flex flex-wrap items-center -mx-3 lg:justify-between">
			<div class="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
				<div class="leading-normal text-center text-sm text-slate-500 lg:text-left">
					©
					{new Date().getFullYear() + ','}
					made with <Icon icon="ant-design:heart-filled" /> by
					<a href="https://jnovo.eu/" class="font-semibold text-slate-700" target="_blank"
						>João "Tek" Novo</a
					>
					for a better Smart Contract World.
				</div>
			</div>
			<div class="w-full max-w-full px-3 mt-0 shrink-0 lg:w-1/2 lg:flex-none">
				<ul class="flex flex-wrap justify-center pl-0 mb-0 list-none lg:justify-end">
					<li class="nav-item">
						<a
							href="https://jnovo.eu/"
							class="block px-4 pt-0 pb-1 font-normal transition-colors ease-soft-in-out text-sm text-slate-500"
							target="_blank">João "Tek" Novo</a
						>
					</li>
					<li class="nav-item">
						<a
							href="https://phantasma.io/"
							class="block px-4 pt-0 pb-1 font-normal transition-colors ease-soft-in-out text-sm text-slate-500"
							target="_blank">Phantasma</a
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
