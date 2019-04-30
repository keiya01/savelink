import HTTP from "http";


export const serverStart = () => {
  const hostName = "127.0.0.1";
  const port = 3000;
  
  const server = HTTP.createServer((_, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
  });

  server.listen(port, hostName, () => {
    console.log(`Server running at http://${hostName}:${port}`);
  });

}
