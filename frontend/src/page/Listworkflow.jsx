import { useEffect, useState } from "react";
import { getWorkflow } from "../services/workflowService";

export default function DashboardPage() {

    const [workflows, setWorkflows] = useState([]);

    useEffect(() => {

        getWorkflow()
            .then(({ data }) => {
                setWorkflows(data);
            })
            .catch(console.error);

    }, []);

    return (
        <div>
            <h1>My Workflows</h1>

            {workflows.map(workflow => (
                <div key={workflow.id}>
                    {workflow.name}
                </div>
            ))}
        </div>
    );
}
