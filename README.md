# Temporal Non-Deterministic Workflow Demonstration

This project demonstrates a non-deterministic error that can occur during workflow replay in Temporal. It specifically showcases the "No command scheduled" error that happens when the order of activities during replay differs from the original execution.

## Project Structure

- **packages/client**: Contains the Temporal client that starts workflow executions
- **packages/worker**: Contains the workflow implementation and activities
  - **workflows.ts**: Defines the `ExampleWorkflow` with intentionally non-deterministic behavior
  - **activities.ts**: Contains activity implementations including `sleepRandom` that introduces randomness

## The Non-Deterministic Issue

The project deliberately creates a scenario where:

1. Multiple parallel activities are started with random sleep durations
2. The order of activities during the initial execution is random
3. During replay, Temporal attempts to recreate the same execution order
4. Because of the randomness in the initial run, the replay cannot deterministically match the history

The workflow creates non-determinism by:

- Using `sleepRandomLocal` to introduce random timing before scheduling activities
- Running multiple parallel tasks that race against each other
- Deliberately throwing an error to force a replay

## Key Finding: Local Activities vs Normal Activities

**Important**: The non-deterministic issue in this example can be fixed by changing the local activities to normal activities. This is because:

- **Local activities** don't have completion time recorded in their event history
- The order of when a local activity resolves is therefore not deterministic during replay
- **Normal activities** have their completion time properly recorded in the event history
- Using normal activities ensures deterministic replay even with parallel execution

This demonstrates a critical consideration when designing Temporal workflows with parallel execution patterns.

## Prerequisites

- [Temporal CLI](https://docs.temporal.io/cli) installed
- Node.js 14 or higher
- [pnpm](https://pnpm.io/installation) package manager

## Running the Demo

Open three separate terminal windows and run the following commands:

### Terminal 1: Start the Temporal server

```bash
pnpm dev:temporal
```

### Terminal 2: Start the worker

```bash
pnpm dev:worker
```

### Terminal 3: Run the client

```bash
pnpm dev:client
```

## What to Expect

1. The client will start a workflow execution
2. The worker will begin executing the workflow with random sleep durations
3. The workflow will throw an intentional error at the end
4. During replay, you'll see non-deterministic errors in the worker logs
5. The specific error will indicate that Temporal expected certain activities to be scheduled in a particular order, but the replay attempted to schedule them in a different order

## Technical Details

The non-deterministic behavior occurs because:

1. The workflow uses `sleepRandomLocal` which creates slight timing variations
2. Multiple parallel activities (`sleepRandom`) are scheduled with unpredictable completion times
3. During replay, the exact same timing cannot be guaranteed
4. The comment in the workflow code: "Delete this line and replay the history would also throw non-deterministic error" refers to the intentional error that triggers the replay mechanism

## Troubleshooting

If you don't see the error immediately, try running the client multiple times. The non-deterministic nature means that the error may not occur in every execution.
