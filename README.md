

# Server Engine Template
Server in NodeJS + Express + MochaTesting


## How to start

> in index.ts
> 
> define your server config via IServerConfig, then the server will automatic do the rest for you.
``` ts

//set up
const config: IServerConfig = {
  port: +process.env.PORT,
  globalMiddlewares: [], 
  errorMiddlewares: [],
  endpoints: [helloEndpoint],
  initCallbacks: [],
  shutdownCallbacks: [],
};

const createServer = async () => {
  await new server(config).run();
};

createServer();

        
```



## structure

Below is the simplified version of the application structure.
```
.
└── root
    │ 
    └── configs (dir) (abstract)
    │   └── IEndpointConfig.ts
    │   └── IServerConfig.ts
    │ 
    └── entities (dir)
    │   └── endpoint (dir)
    │   └── server (dir)
    │       └── server.ts - a concrete server
    │ 
    └── middlewares (dir)
    │ 
    └── utils (dir)
    │ 
    └── 
        
```

