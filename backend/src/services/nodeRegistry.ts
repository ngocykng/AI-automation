import { exportWorkflowExcel } from "./exportexel.js";
import { runAIAgent } from "./runAIagent.js";
import { searchyoutobe } from "./youtobe.js";

export const nodeRegistry = {
    http: async (
        input: any,
        config: any
    ) => {
        return config?.response || input;
    },
    ai: async (
        input: any,
        config: any
    ) => {
        return await runAIAgent(
            typeof input === "string"
                ? input
                : JSON.stringify(input),
            config
        )
    },
    youtube: async (
        input: any,
        config: any
    ) => {
        return await searchyoutobe(input);
    },
    excel: async (
        input: any,
        config: any,
        runId?: string
    ) => {
        if (!runId) {
            throw new Error("Excel node requires a runId from engine");
        }
        await exportWorkflowExcel(runId);
        return "Excel created";
    },
    output: async (
        input: any,
        config: any
    ) => {
        return input;
    },
    merge: async (
        input: any
    ) => {
        return { merged: input };
    }
}