import {
  WorkflowInterceptorsFactory,
  ActivityInput,
} from "@temporalio/workflow";

export const interceptors: WorkflowInterceptorsFactory = () => ({
  outbound: [
    {
      scheduleActivity: async (
        input: ActivityInput,
        next: (input: ActivityInput) => Promise<unknown>
      ) => {
        console.log("scheduleActivity", input.activityType, "seq:", input.seq);
        return await next(input);
      },
    },
  ],
});
