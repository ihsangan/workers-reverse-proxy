async function handleRequest(request) {
  const url = new URL(request.url)
  // change the hostname
  url.hostname = "example.domain.com"
  let req = new Request(url, request)
  let response = await fetch(req, {
    // RequestInitCfProperties
    // see: https://developers.cloudflare.com/workers/runtime-apis/request#requestinitcfproperties
    cf: {
      minify: { javascript: true, css: true, html: true },
      cacheTtl: 86400,
      cacheEverything: true,
      apps: false,
      scrapeShield: false,
      mirage: false,
      // resolveOverride: "example.domain.com",
    },
    // send headers to origin
    headers: {
      "User-Agent": "curl/7.81.0",
    }
  })
  let res = new Response(response.body, response)
  // force enableling CORS headers
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Headers
  res.headers.delete("X-Frame-Options")
  res.headers.delete("X-Content-Type-Options")
  res.headers.delete("X-XSS-Protection")
  res.headers.delete("Pragma")
  res.headers.set("Access-Control-Allow-Methods", "*")
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Expose-Headers", "*")
  res.headers.set("Cache-Control", "public, max-age=3600")
  return res
}
addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})