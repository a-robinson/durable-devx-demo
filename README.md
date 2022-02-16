This example exists to show a problem with developing a durable object -

This project was made with `npx wrangler@beta init`. Nothing special there.

I then edited `src/index.ts` to add a simple Durable object ExampleDurable; I exported it, and then consumed it via `env.EXAMPLE`.

I then added a `[durable_objects]` definition to `wrangler.toml` that associates the `ExampleDurable` with the `EXAMPLE` binding name.

Ok, that's all that should be required to get to developing. Let's run `npm start`.

```
➜  durable-devx-demo npm start

> durable-devx-demo@0.0.0 start
> wrangler dev src/index.ts

⬣ Listening at http://localhost:8787
remote worker: Error: Failed to fetch /accounts/1fc1df98cc4420fe00367c3ab68c1639/workers/scripts/durable-devx-demo/edge-preview:
- 10074: cannot bind Durable Object by class name in preview upload of script that does not already exist
    at throwFetchError (/Users/sunilpai/code/durable-devx-demo/node_modules/wrangler/wrangler-dist/cli.js:134316:17)
    at fetchResult (/Users/sunilpai/code/durable-devx-demo/node_modules/wrangler/wrangler-dist/cli.js:134287:5)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async previewToken (/Users/sunilpai/code/durable-devx-demo/node_modules/wrangler/wrangler-dist/cli.js:134658:29)
    at async createWorker (/Users/sunilpai/code/durable-devx-demo/node_modules/wrangler/wrangler-dist/cli.js:134675:17)
    at async start (/Users/sunilpai/code/durable-devx-demo/node_modules/wrangler/wrangler-dist/cli.js:136075:16) {
  code: 10074
}
```

(The error and code are sent from the API)

So, first question - why? Why should we have a script by this name that exists to develop a Durable Object? Of note, you don't even need to have published the Durable Object itself, it just needs a plain script to have been published with that name.

There's a sinister side effect here, because as a developer, my next step is to try to publish the script. Let's run `npm run deploy`

```
durable-devx-demo npm run deploy

> durable-devx-demo@0.0.0 deploy
> wrangler publish src/index.ts

Failed to fetch /accounts/1fc1df98cc4420fe00367c3ab68c1639/workers/scripts/durable-devx-demo:
- 10061: Cannot create binding for class ExampleDurable because it is not currently configured to implement durable objects. Did you forget to apply a --new-class migration to it?
```

Right, so I need to have a `[migrations]` definition in my `wrangler.toml`, OR I need to remove the `[durable_objects]` definition from my `wrangler.toml`. Both are annoying options, and introduce friction where there shouldn't be any. We wouldn't bump into this frustration if we didn't have the previous error, of course. (But also, we shouldn't be recommending to use `--new-class` since we're actively deprecating it.)

So my request - we shouldn't have the original error, we should be able to start developing scripts with Durable Objects without having to publish a worker with that name.

(I'll work on the migrations error/ux on the wrangler side, we have a separate plan for that.)
