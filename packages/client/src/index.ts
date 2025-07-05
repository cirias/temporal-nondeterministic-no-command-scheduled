import { Connection, Client } from "@temporalio/client";

export interface ExampleWorkflowParams {
  name: string;
}

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });

  const client = new Client({
    connection,
    namespace: "default",
  });

  const handle = await client.workflow.start("ExampleWorkflow", {
    taskQueue: "example-task-queue",
    workflowId: `example-workflow-${Date.now()}`,
    args: [],
  });

  console.log(`Started workflow ${handle.workflowId}`);

  const result = await handle.result();
  console.log(`Workflow completed with result: ${result}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
