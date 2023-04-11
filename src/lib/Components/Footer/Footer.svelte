<script>
	import Icon from '@iconify/svelte';
</script>

<footer
	class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600"
>
	<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
		©
		{new Date().getFullYear() + ','}
		made with <Icon icon="ant-design:heart-filled" /> by
		<a
			href="https://phantasma.io/"
			class="font-semibold text-slate-700 hover:underline"
			target="_blank"
			rel="noreferrer">Phantasma Contributors</a
		>. All Rights Reserved.
	</span>
	<span class="text-[12px] text-gray-500 sm:text-center dark:text-gray-400">
		Developed with <Icon icon="ant-design:heart-filled" /> by
		<a
			href="https://jnovo.eu/"
			class="font-semibold text-slate-700 hover:underline"
			target="_blank"
			rel="noreferrer">João "Tek" Novo</a
		>.
	</span>
	<ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
		<li>
			<a href="https://t.me/phantasma_io" class="mr-4 hover:underline md:mr-6 ">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:telegram" />
			</a>
		</li>
		<li>
			<a href="https://twitter.com/phantasmachain" class="mr-4 hover:underline md:mr-6">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:twitter" />
			</a>
		</li>
		<li>
			<a
				href="https://www.youtube.com/channel/UCdojlc5ps_cHjGCQRS4MXqg"
				class="mr-4 hover:underline md:mr-6"
			>
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:youtube" />
			</a>
		</li>
		<li>
			<a href="https://medium.com/phantasticphantasma" class="mr-4 hover:underline md:mr-6">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:medium" />
			</a>
		</li>
		<li>
			<a href="https://discord.gg/sUjcHFk68t" class="mr-4 hover:underline md:mr-6">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:discord" />
			</a>
		</li>
		<li>
			<a href="https://github.com/Phantasma-io" class="mr-4 hover:underline md:mr-6">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:github" />
			</a>
		</li>
		<li>
			<a href="https://www.reddit.com/r/phantasma/" class="mr-4 hover:underline md:mr-6">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:reddit" />
			</a>
		</li>
		<li>
			<a href="https://www.facebook.com/phantasmachain/" class="hover:underline">
				<Icon height="20" width="20" class="sm:mr-1" icon="mdi:facebook" />
			</a>
		</li>
	</ul>
</footer>
