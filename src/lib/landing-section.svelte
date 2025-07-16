<script lang="ts">
    import headshot from '$lib/assets/headshot.png';  
	import { onMount } from 'svelte';
	import { GltfObj } from './gltf-obj';
	import { MyScene } from './my-scene';


    let el: Element;

    onMount(() => {
        const myScene = new MyScene(el);
        const branch = new GltfObj(myScene, '/3d/scene.gltf');
        myScene.animate();
        myScene.resizeOnResize(); // tell it to resize with the window
    });

    function goToLink(link: string, openInNewTab: boolean) {
        if (openInNewTab) {
            window.open(link, '_blank')
        } else {
            window.location.href = link;
        }
    }
</script>
<canvas class="absolute right-0 w-full -z-50 top-28 md:top-3 hidden sm:block" bind:this={el}></canvas>
<div class="absolute w-full mx-auto h-screen flex flex-col lg:p-28 md:p-16 sm:p-8">
    <div class="flex flex-row justify-center pt-16">
        <img src="{headshot}" alt="Justin Rowsell Headshot" 
        class="w-36 h-36 rounded-full object-cover flex mr-8">
        <div class="text-lg">
            <p class="font-sans w-full text-left text-darkShade m-0 p-0">Hi, my name is</p>
            <span class="font-sans text-4xl w-full font-bold text-left text-main mt-0 pt-0">Justin Rowsell</span>
            <p class="font-sans w-full text-left text-darkShade m-0 p-0">
                I'm a <span class="font-bold">Founder, Fractional CTO, and Freelance Software Architect</span><br/>
                creating innovative solutions for a better world at the intersection of<br/>
                AI and Climate Tech at <a href="https://www.aquaberry.io" class="font-bold">Aquaberry.io</a>
            </p>
        </div>
    </div> 
    <div class="flex flex-col sm:flex-row w-3/4 max-w-[800px] mt-16 flex-wrap justify-around mx-auto">        
        <button class="bg-darkAccent hover:bg-darkShade text-white font-bold rounded-full
            flex items-center py-2 px-4 mb-4 sm:mb-0"
            on:click={() => goToLink('https://aquaberry.io/cto', false)}>
            <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm680-525L496 583q-4 2-7.5 3.5T480 588q-5 0-8.5-1.5T464 583L140 371v465h680V371ZM480 534l336-218H145l335 218ZM140 371v7-39.317.732V316v23-.912V378v-7 465-465Z"/></svg>
            <span>Hire Me</span>
        </button>
        <button class="bg-darkAccent hover:bg-darkShade text-white font-bold rounded-full
            flex items-center py-2 px-4 mb-4 sm:mb-0"
            on:click={() => goToLink('https://aquaberry.io/', true)}>
            <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M180 936q-24.75 0-42.375-17.625T120 876V276q0-24.75 17.625-42.375T180 216h600q24.75 0 42.375 17.625T840 276v600q0 24.75-17.625 42.375T780 936H180Zm0-60h600V356H180v520Zm300.041-105Q400 771 337 727.849q-63-43.152-92-112Q274 547 336.959 504t143-43Q560 461 623 504.151q63 43.152 92 112Q686 685 623.041 728t-143 43ZM480 721q57 0 104.949-27.825T660 616q-27.102-49.35-75.051-77.175Q537 511 480 511t-104.949 27.825Q327.102 566.65 300 616q27.102 49.35 75.051 77.175Q423 721 480 721Zm0-105Zm.118 50Q501 666 515.5 651.382q14.5-14.617 14.5-35.5Q530 595 515.382 580.5q-14.617-14.5-35.5-14.5Q459 566 444.5 580.618q-14.5 14.617-14.5 35.5Q430 637 444.618 651.5q14.617 14.5 35.5 14.5Z"/></svg>
            <span>Recent Work</span>
        </button>
        <button class="bg-darkAccent hover:bg-darkShade text-white font-bold rounded-full
            flex items-center py-2 px-4 mb-4 sm:mb-0"
            on:click={() => goToLink('https://www.linkedin.com/in/justin-rowsell/', true)}>
            <svg class="fill-current w-4 h-4 mr-2" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 455 455" xml:space="preserve"><g><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M246.4,204.35v-0.665c-0.136,0.223-0.324,0.446-0.442,0.665H246.4z"/>
                <path style="fill-rule:evenodd;clip-rule:evenodd;" d="M0,0v455h455V0H0z M141.522,378.002H74.016V174.906h67.506V378.002z
                     M107.769,147.186h-0.446C84.678,147.186,70,131.585,70,112.085c0-19.928,15.107-35.087,38.211-35.087
                    c23.109,0,37.31,15.159,37.752,35.087C145.963,131.585,131.32,147.186,107.769,147.186z M385,378.002h-67.524V269.345
                    c0-27.291-9.756-45.92-34.195-45.92c-18.664,0-29.755,12.543-34.641,24.693c-1.776,4.34-2.24,10.373-2.24,16.459v113.426h-67.537
                    c0,0,0.905-184.043,0-203.096H246.4v28.779c8.973-13.807,24.986-33.547,60.856-33.547c44.437,0,77.744,29.02,77.744,91.398V378.002
                    z"/>
                </g>
            </svg>
            <span>Let's Connect</span>
        </button>
    </div>
    <!--  -->
</div>