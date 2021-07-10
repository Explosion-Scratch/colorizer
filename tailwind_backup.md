# CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

li {
  @apply text-transparent font-light text-lg hover:bg-transparent rounded-md p-5 inline-block w-32 h-32 shadow-md cursor-pointer select-none transition-all active:scale-95 duration-100 relative;
  background: var(--color, lightseagreen);
}
li:hover {
  border: 2px solid var(--color);
  color: var(--color)
}
li::after {
  content: attr(data-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}
li.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #eee;
  pointer-events: none;
  animation-delay: var(--delay);
}
@keyframes pulse {
  50% {
    opacity: .5
  }
}

# HTML
<ul class="h-full w-full">
  <li style="--color: #0bb" data-color="#0bb"></li>
  <li></li>
  <li></li>
  <li style="--delay: .3s" class="loading"></li>
  <li class="loading"></li>
  <li class="loading"></li>
  <li class="loading"></li>
  <li class="loading"></li>
  <li class="loading"></li>
</ul>
