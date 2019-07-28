import { IncomingMessage } from "http";
import https from "https";
import LoggerService, { LOGGER_DOWNLOADER_MANAGER } from "nd-logger";

const useragents = [
  "Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/20.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKi…7.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36",
  "Mozilla/5.0 (iPad; U; CPU iPad OS 5_0_1 like Mac OS X; en-…35.1+ (KHTML like Gecko) Version/7.2.0.0 Safari/6533.18.5",
  "Opera/9.80 (X11; Linux x86_64; U; pl) Presto/2.7.62 Version/11.00",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0",
];

const randomUserAgent = () => {
  const rand = Math.floor(Math.random() * useragents.length);
  return useragents[rand];
};

// interface of get https with redirect 301 or 302
export const HttpGet = (url: string, callback: (res: IncomingMessage) => void) => {
  const agent = randomUserAgent();
  LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `Random agent to ${agent}`);

  return https.get(
    url,
    {
      headers: {
        "user-agent": encodeURIComponent(agent),
        "accept": "text/html",
      },
    },
    response => {
      if (
        (response.statusCode === 300 || response.statusCode === 301 || response.statusCode === 302) &&
        response.headers.location
      ) {
        LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `start redirect to ${response.headers.location}`);
        HttpGet(response.headers.location, callback);
      } else {
        callback(response);
      }
    },
  );
};
