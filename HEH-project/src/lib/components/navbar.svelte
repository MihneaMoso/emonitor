<script>
	import {fade} from 'svelte/transition';
	let color=$state('#ffffff');
	let menu;
	let menuOpen = $state(false);


</script>
<div class="flex">
	<nav class="flex items-center justify-between h-[5rem] fixed w-[100%] px-6 z-50">
		<div class="text-white font-bold	lg:text-4xl md:text-2xl">Logo</div>
			<div class="flex gap-5 text-white font-bold lg:text-2xl md:text-xl justify-center items-center">
				<div class="hover:text-[#787878] hover:opacity-70 cursor-pointer">About</div>
				<div class="hover:text-[#787878] hover:opacity-70 cursor-pointer">Log In</div>
			<div class="h-[2.5rem] w-[2.5rem] ml-[20px] mt-[4px] cursor-pointer" onclick="{menuOpen = !menuOpen}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onmouseover={color="#787878"} onmouseout={color="#ffffff"}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L7 7M20 7L11 7" stroke="{color}" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 17H17M4 17L13 17" stroke="{color}" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 12H7L20 12" stroke="{color}" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
		</div>
	</div>
</nav>
	{#if menuOpen === true}
		<div class="h-full w-[50vw] absolute right-0 flex items-end justify-center flex-col pr-[100px] ">
			<div transition:fade class="flex flex-col gap-13 bg-transparent">
				<!-- <a href="/" class="text-4xl text-white font-bold z-50 hover:text-gray-200" >Information</a>
				<a href="/" class="text-4xl text-white font-bold z-50 hover:text-gray-200" >Log In</a>
				<a href="/" class="text-4xl text-white font-bold z-50 hover:text-gray-200" >Sign Up</a> -->
				<a href="https://github.com/MihneaMoso/emonitor" class="text-4xl text-white font-bold z-50 hover:text-gray-200" >Github Repo</a>
			</div>
		</div>
		<div transition:fade id="menu" class="menu clip w-[100vw] h-[100vh] opacity-40 absolute left-0 bg-gray-600 z-20 " bind:this={menu}></div>
	{/if}
</div>
<style>
    .clip {
        clip-path: polygon(20% 0, 100% 0, 100% 100%, 100% 100%, 63% 100%, 45% 100%, 60% 0);
    }
</style>