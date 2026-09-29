import api from "../services/api";

export default function useNodeDrag() {

    const handleNodeDragStop =
        async (event, node) => {

            try {

                await api.put(
                    `/nodes/${node.id}`,
                    {
                        label: node.data.label,

                        position_x: node.position.x,

                        position_y: node.position.y,

                        config: node.data.config || {}
                    }
                );

            } catch (error) {

                console.error(error);

            }
        };

    return {
        handleNodeDragStop
    };
}