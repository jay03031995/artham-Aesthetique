/* The static Sanity Studio build references its assets at /static/*, which
   would collide with CRA's own /static. Rewrite them to /studio/static/*
   since the studio is served from the /studio subpath. */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "build", "studio", "index.html");
const html = fs.readFileSync(file, "utf8");
fs.writeFileSync(file, html.replaceAll('"/static/', '"/studio/static/'));
console.log("Patched studio asset paths for /studio base.");
