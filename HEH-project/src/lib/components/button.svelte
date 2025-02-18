<script>
	export let name;
	export let link;
</script>
	<a href="{link}" class="button">
		<div class="button__content">
			<span class="button__text">{name}</span>


			<div class="button__reflection-1"></div>
			<div class="button__reflection-2"></div>
		</div>
		<div class="button__shadow"></div>
	</a>

<style>
    a {
        text-decoration: none;
    }

    /*=============== BUTTON ===============*/

    .button {
        position: relative;
        transition: transform .4s;
    }

    .button__content {
        position: relative;
        background: var(--gradient-color);
        padding: 1.25rem 3rem;
        border-radius: 4rem;
        border: 3px solid var(--black-color);
        color: var(--black-color);
        display: flex;
        align-items: center;
        column-gap: .5rem;
        overflow: hidden;
    }

    .button__text {
        font-weight: 700;
    }


    .button__text{
        position: relative;
        z-index: 2;
    }

    /* Reflection shapes */
    .button__reflection-1,
    .button__reflection-2 {
        width: 8px;
        height: 120px;
        background-color: var(--reflection-color);
        rotate: 30deg;
        position: absolute;
        inset: 0;
        top: 0;
        left: -180%;
        margin: auto;
        transition: left .6s cubic-bezier(.2, .5, .2, 1.2);
    }

    .button__reflection-1::after {
        content: "";
        width: 26px;
        height: 100%;
        background-color: var(--reflection-color);
        position: absolute;
        top: -1rem;
        left: 1.25rem;
    }

    .button__reflection-2::after {
        content: "";
        width: 40px;
        height: 100%;
        background-color: var(--reflection-color);
        position: absolute;
        top: -1rem;
        left: .8rem;
    }


    .button__shadow {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: var(--gradient-color);
        padding: 1.25rem 3rem;
        border-radius: 4rem;
        border: 3px solid var(--black-color);
        z-index: -1;
        transition: transform .3s;
    }

    .button:hover .button__shadow {
        transform: translate(-.5rem, .5rem);
    }

    .button:hover .button__reflection-1 {
        left: 120%;
    }

    .button:hover .button__reflection-2 {
        left: -70%;
    }

    /* View geometric shapes */
    .button:hover {
        transform: rotate(-4deg) scale(1.1);
    }


    .button:hover{
        transform: scale(1.1);
        transition-delay: .1s;
    }

    .button:hover{
        transform: scale(1.1);
    }

    .button:hover{
        transform: translateY(-8px) scale(1.1);
        transition-delay: .1s;
    }

    .button:hover {
        transform: translate(-20px, 20px) scale(1.1);
    }

    .button:hover {
        transform: translateY(7px) rotate(-24deg) scale(1.1);
    }

    .button:hover {
        transform: rotate(-12deg) scale(1.1);
    }/*=============== GOOGLE FONTS ===============*/
    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap");

    /*=============== VARIABLES CSS ===============*/
    :root {
        /*========== Colors ==========*/
        /*Color mode HSL(hue, saturation, lightness)*/
        --gradient-color: linear-gradient(90deg,
        hsl(48, 100%, 50%) 0%,
        hsl(28, 100%, 54%, 100%));
        --black-color: hsl(225, 15%, 6%);
        --reflection-color: hsla(48, 30%, 95%, .3);
        --body-color: hsl(48, 100%, 98%);

        /*========== Font and typography ==========*/
        /*.5rem = 8px | 1rem = 16px ...*/
        --body-font: "Montserrat", sans-serif;
        --normal-font-size: 1rem;
    }

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }


    a {
        text-decoration: none;
    }

    .button {
        position: relative;
        transition: transform .4s;
    }

    .button__content {
        position: relative;
        background: var(--gradient-color);
        padding: 1.25rem 3rem;
        border-radius: 4rem;
        border: 3px solid var(--black-color);
        color: var(--black-color);
        display: flex;
        align-items: center;
        column-gap: .5rem;
        overflow: hidden;
    }

    .button__text {
        font-weight: 700;
        font-size: 20px;
    }

    .button__reflection-1,
    .button__reflection-2 {
        width: 8px;
        height: 120px;
        background-color: var(--reflection-color);
        rotate: 30deg;
        position: absolute;
        inset: 0;
        top: 0;
        left: -180%;
        margin: auto;
        transition: left .6s cubic-bezier(.2, .5, .2, 1.2);
    }

    .button__reflection-1::after {
        content: "";
        width: 26px;
        height: 100%;
        background-color: var(--reflection-color);
        position: absolute;
        top: -1rem;
        left: 1.25rem;
    }

    .button__reflection-2::after {
        content: "";
        width: 40px;
        height: 100%;
        background-color: var(--reflection-color);
        position: absolute;
        top: -1rem;
        left: .8rem;
    }

    .button:hover .button__shadow {
        transform: translate(-.5rem, .5rem);
    }

    /* Move reflection */
    .button:hover .button__reflection-1 {
        left: 120%;
    }

    .button:hover .button__reflection-2 {
        left: -70%;
    }


    .button:hover {
        transform: rotate(-4deg) scale(1.1);
    }


</style>