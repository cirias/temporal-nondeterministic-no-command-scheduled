import { proxyActivities, proxyLocalActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

const { greet, sleepRandom } = proxyActivities<typeof activities>({
  startToCloseTimeout: "10 seconds",
});

const { sleepRandom: sleepRandomLocal } = proxyLocalActivities<
  typeof activities
>({
  startToCloseTimeout: "10 seconds",
});

export async function ExampleWorkflow(): Promise<void> {
  await Promise.all(
    [1, 3].map(async (offset) => {
      await Promise.all(
        ["a", "b", "c", "d", "e"].map(async (c) => {
          // Sleep randomly shortly so that,
          // - the order of all the starts of the next sleepRandom activity is random in the real run.
          // - the order of all the starts of the next sleepRandom activity is always the same in the replay run.
          // - and these two orders are different, which is the cause of non-deterministic error.
          //
          // IMPORTANT: Using sleepRandomLocal (a local activity) causes non-deterministic behavior.
          // Local activities don't have completion time in their event history, making the order
          // of when a localActivity resolves non-deterministic.
          // Changing this to a normal activity (sleepRandom) would fix the issue because
          // normal activities have their completion time recorded in the event history,
          // ensuring deterministic replay.
          await sleepRandomLocal(1, 100);

          console.log(`sleep start ${offset} ${c}`);
          await sleepRandom(offset * 1000, offset * 1000);
          console.log(`sleep end ${offset} ${c}`);
        })
      );
      console.log(`greet ${offset}`);
      await greet(offset.toString());
    })
  );

  // Delete this line and replay the history would also throw non-deterministic error
  throw new Error("Something went wrong");
}
