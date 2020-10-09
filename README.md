# json-mock-server

I am a fairly simple mock server which serves JSON responses.\
I am good at:

- simplicity
- install globally and use me in any directory where mocks exists
- can handle different scenarios for same API like error cases etc
- very descriptive logs in terminal
- daily evolving, tell me your problem I will try my best and try to resolve it

## Installation

1. `git clone https://github.com/naveen2593kumar/json-mock-server.git`
2. `cd json-mock-server`
3. `npm install`
4. `npm install -g`

and here we go, Voilla!!!

## Updating

1. `git pull`
2. `npm install`
3. `npm install -g`

## How to use me

I have few flags to pass the requirements you want, like\
`-p` OR `--path` for path (this helps me to narrow down the search for JSON mocks)\
`-g` OR `--glob` for json glob pattern (this is the pattern to find the JSON mocks)\
`-s` or `--scenario` for scenarios (in JSON file you can set the responses for passed scenarios)\
`--port` for port

### Examples

Below will serve all the JSON files under demo folder and try to serve `response1` if exists otherswise `response` at default port 8083\
`json-mock-server -p './demo' -g '*.json' -s 1`

Below will serve all the JSON files under demo folder having naming pattern `f*.json` at custom port 8084\
`json-mock-server -p './demo' -g 'f*.json' --port 8084`

## Mock Data Format to be serve

In order to use me at best, please follow the below format exactly, [Few Samples](./demo)

```
{
    "method": "(get|post|put|delete|patch)",
    "path": "/api/your/expected/endpoint",
    "authorised": true, then I look for a authorisation header
    "response": "expected response from the server"
    "response<scenario>": "expected response from the server with specifc <scenario>"
}
```


## Engineering
* If global install does not work proply then you can always run me with my friend Mr. `node`\
    `node <directoryToJsonMockServer>/index.js -p './demo' -g 'f*.json' --port 8084`