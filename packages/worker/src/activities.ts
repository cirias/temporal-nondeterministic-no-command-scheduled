import { sleep } from "@temporalio/activity";

export async function greet(name: string): Promise<void> {
  console.log(`Hello, ${name}!`);
}

export async function sleepRandom(
  startMilliseconds: number,
  endMilliseconds: number
): Promise<void> {
  const duration =
    Math.random() * (endMilliseconds - startMilliseconds) + startMilliseconds;
  await sleep(duration);
}
