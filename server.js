import "dotenv/config";
import http from "http";
import https from "https";

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url.startsWith("/posts")) {
    const reqRaw = new URL(req.url, "http://localhost:3000");
    const reqUrl = reqRaw.searchParams.get("url");

    if (!reqUrl) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing 'url' search parameter");
    }

    https
      .get(
        reqUrl,
        {
          headers: {
            "x-api-key": process.env.API_KEY,
            "User-Agent": "NewsPortal/1.0",
          },
        },
        (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", () => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
          });
        }
      )
      .on("error", () => {
        res.writeHead(500);
        console.log("Error retrieving data.");
      });
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("NewsPortal NodeJS server");
});

server.listen(PORT, () => {
  console.log(`Server running on port:${PORT}/`);
});
