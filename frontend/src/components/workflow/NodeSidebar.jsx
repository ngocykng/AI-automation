import api from "../../services/api";
import {
    useState,
    useRef,
} from "react";
// import { updateNode } from "../../services/nodeService";
import { useParams } from "react-router-dom";
export default function NodeSidebar({
    selectedNode,
    setSelectedNode,
    loadWorkflow,
    setNodes,
}) {
    const { id: workflowId } = useParams();
    const [saving, setSaving] =
        useState(false);
    const saveTimeout = useRef(null);
    if (!selectedNode) return null;

    console.log(selectedNode);

    const handsave = async () => {
        try {
            setSaving(true);

            const res = await api.put(
                `/nodes/${selectedNode.id}`,
                selectedNode
            );

            // cập nhật lại state bằng dữ liệu từ backend
            setSelectedNode(res.data);

            await loadWorkflow();

            console.log("SelectedNode after update:", res.data);
            console.log("Prompt:", res.data.config?.prompt);
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    const triggerautoSave = () => {
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
        saveTimeout.current = setTimeout(async () => {
            try {
                setSaving(true);
                await api.put(
                    `/nodes/${selectedNode.id}`,
                    selectedNode
                );
                // updateNode(selectedNode,
                //     selectedNode.id
                // );
            } finally {
                setSaving(false);
            }
        }, 500);
    }
    const handdelete = async () => {
        try {
            await api.delete(
                `/nodes/${selectedNode.id}`
            );
            setNodes((prev) =>
                prev.filter(
                    (n) => n.id !== selectedNode.id
                )
            );

            setSelectedNode(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    }
    const handleExport = async () => {
        try {
            const response = await api.get(
                `/workflows/${workflowId}/export`,
                { responseType: "blob" }
            );
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = `workflow_${workflowId}_results.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed", err);
        }
    }
    if (
        selectedNode?.type === "output" ||
        selectedNode?.data?.type === "output"
    ) {

        console.log("Output node selected, workflowId:", workflowId);
        return (
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "300px",
                    height: "100%",
                    background: "#1e1e1e",
                    color: "white",
                    padding: "20px",
                    overflowY: "auto",
                    borderLeft: "1px solid #333"
                }}
            >
                <h2>Output Node</h2>

                <p>
                    Status:
                    {selectedNode.data?.status || "N/A"}
                </p>

                <p>
                    Results:
                    {selectedNode.data?.count || 0}
                </p>
                <button
                    onClick={handleExport}
                >
                    Export Excel
                </button>
                <button
                    onClick={() =>
                        setSelectedNode(null)
                    }
                >
                    Close
                </button>
                <button
                    onClick={handdelete}
                >
                    delete
                </button>
            </div>
        );
    }


    return (

        <div
            style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "300px",
                height: "100%",
                background: "#1e1e1e",
                color: "white",
                padding: "20px",
                overflowY: "auto",
                borderLeft: "1px solid #333"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h2>Node Settings</h2>
                <button
                    onClick={() =>
                        setSelectedNode(null)
                    }
                >
                    X
                </button>
            </div>

            <label>Label</label>

            <input
                style={{
                    width: "100%",
                    marginBottom: "10px"
                }}
                value={selectedNode.label || selectedNode.data?.label || ""}
                onChange={(e) => {
                    const update = {
                        ...selectedNode,
                        label: e.target.value
                    };
                    setSelectedNode(update)
                    triggerautoSave();
                }
                }
            />
            <label>Model</label>

            <select
                style={{ width: "100%", marginBottom: "18px" }}
                value={
                    selectedNode.config?.model ||
                    (selectedNode.config?.provider === "groq"
                        ? "llama-3.1-8b-instant"
                        : "gemini-2.5-flash")
                }
                onChange={(e) => {
                    const update = {
                        ...selectedNode,
                        config: {
                            ...selectedNode.config,
                            model: e.target.value,
                        },
                    };
                    setSelectedNode(update);
                    triggerautoSave();
                }}
            >
                {selectedNode.config?.provider === "groq" ? (
                    <>
                        <option value="llama-3.1-8b-instant">
                            llama-3.1-8b-instant
                        </option>
                        <option value="llama-3.1-70b-versatile">
                            llama-3.1-70b-versatile
                        </option>
                    </>
                ) : (
                    <>
                        <option value="gemini-2.5-flash">
                            gemini-2.5-flash
                        </option>
                        <option value="gemini-1.5-pro">
                            gemini-1.5-pro
                        </option>
                    </>
                )}
            </select>

            <label>Prompt</label>

            <textarea
                style={{
                    width: "100%",
                    height: "150px"
                }}
                value={
                    selectedNode.config?.prompt || selectedNode.data?.config?.prompt || ""
                }
                onChange={(e) => {
                    const update = {
                        ...selectedNode,
                        config: {
                            ...selectedNode.config,
                            prompt: e.target.value
                        }
                    };
                    setSelectedNode(update);
                    triggerautoSave();
                }}
            />

            <button
                disabled={saving}
                onClick={handsave}>
                Save
            </button>
            <button
                style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white"
                }}
                onClick={handdelete}
            >
                Delete
            </button>
        </div>

    )

}
