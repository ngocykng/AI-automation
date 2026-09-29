import ExcelJS from "exceljs";
import { getNodeRunsByRunId } from "../queries/nodeRunQueries.js";
export const exportWorkflowExcel = async (
    runId: string
) => {

    const nodeRuns =
        await getNodeRunsByRunId(runId);

    const workbook =
        new ExcelJS.Workbook();

    const sheet =
        workbook.addWorksheet("Workflow Results");

    sheet.columns = [
        {
            header: "Node ID",
            key: "nodeId",
            width: 40
        },
        {
            header: "Status",
            key: "status",
            width: 20
        },
        {
            header: "Output",
            key: "output",
            width: 80
        }
    ];

    nodeRuns.forEach(run => {

        sheet.addRow({
            nodeId: run.node_id,
            status: run.status,
            output:
                typeof run.output === "object"
                    ? JSON.stringify(run.output)
                    : run.output
        });

    });

    const filePath =
        `exports/workflow-${runId}.xlsx`;

    await workbook.xlsx.writeFile(
        filePath
    );

    return filePath;
};