import { useMemo, useState } from "react";
import { Search, GripVertical } from "lucide-react";
import { getNodesByCategory } from "./nodeRegistry";
import "./Sidebar.css";

export default function Sidebar() {
    const [query, setQuery] = useState("");

    const categories = useMemo(() => {
        const grouped = getNodesByCategory();
        const normalized = query.trim().toLowerCase();
        if (!normalized) return grouped;

        const filtered = {};
        Object.entries(grouped).forEach(([cat, nodes]) => {
            const matches = nodes.filter(
                (n) =>
                    n.label.toLowerCase().includes(normalized) ||
                    n.description.toLowerCase().includes(normalized)
            );
            if (matches.length) filtered[cat] = matches;
        });
        return filtered;
    }, [query]);

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title-row">
                    <h3 className="sidebar-title">Nodes</h3>
                    <span className="sidebar-count">
                        {Object.values(categories).flat().length}
                    </span>
                </div>
                <p className="sidebar-subtitle">Drag a node onto the canvas</p>
            </div>

            <div className="sidebar-search-wrap">
                <Search size={15} className="sidebar-search-icon" />
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="sidebar-search"
                />
            </div>

            <div className="sidebar-scroll">
                {Object.keys(categories).length === 0 && (
                    <p className="sidebar-empty">No nodes match "{query}"</p>
                )}

                {Object.entries(categories).map(([category, nodes]) => (
                    <div key={category} className="sidebar-category">
                        <div className="sidebar-category-label">{category}</div>

                        {nodes.map((node) => {
                            const Icon = node.icon;
                            return (
                                <div
                                    key={node.type}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, node.type)}
                                    className="sidebar-item"
                                >
                                    <div
                                        className="sidebar-icon-box"
                                        style={{
                                            background: node.bg,
                                            color: node.color,
                                            borderColor: node.border,
                                        }}
                                    >
                                        <Icon size={18} strokeWidth={2.2} />
                                    </div>

                                    <div className="sidebar-item-body">
                                        <div className="sidebar-item-label">{node.label}</div>
                                        <div className="sidebar-item-desc">{node.description}</div>
                                    </div>

                                    <GripVertical size={14} className="sidebar-grip" />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </aside>
    );
}