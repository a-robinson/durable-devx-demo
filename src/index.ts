/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export class ExampleDurable {
  async fetch(url: string): Promise<string> {
    return "hello world";
  }
}

export default {
  async fetch(
    request: Request,
    env: { EXAMPLE: DurableObjectNamespace }
  ): Promise<Response> {
    const namespace = env.EXAMPLE;
    let id = namespace.idFromName("ABC");
    let obj = namespace.get(id);
    let resp = await obj.fetch(request.url);
    return new Response(await resp.text());
  },
};
