<script>
	import Button from '$lib/components/button.svelte';
	import Navbar from '$lib/components/navbar.svelte';
</script>
<Navbar/>
<div class="background flex items-center justify-center flex-col lg:bg-contain md:bg-cover sm:bg-cover">
	<h2 class="text-3xl font-sans font-bold lg:max-w-[30vw] md:max-w-[50vw] sm:max-w-[50vw] text-center mb-[30px] ">	Never Overpay Again. Track Prices, Spot Deals, Save Instantly</h2>
<Button name="Download Extension" link="https://github.com/MihneaMoso/emonitor"/>

</div>

<style>
	.background{
			width: 100vw;
			height: 100vh;
			background-color: #eab9b2;
			background-image: url("$lib/assets/background.png");
			background-repeat: no-repeat;
			background-position: bottom center;

	}
</style>