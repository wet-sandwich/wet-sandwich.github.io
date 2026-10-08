<!-- src/routes/+error.svelte -->
<script>
	import { page } from '$app/state';
</script>

<h1>Oops! Page not found.</h1>
<p>Status code: {page.status}</p>
<p>Message: {page.error?.message}</p>
<a href="/">Go back home</a> 
