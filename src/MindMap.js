import React, { useState, useEffect } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge } from 'react-flow-renderer';
import axios from 'axios';


function MindMap() {
    const [nodesData, setNodesData] = useState([]);
    const [nodeToEdit, setNodeToEdit] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/nodes')
            .then(response => {
                const formattedNodes = response.data.map(node => ({
                    id: node._id,
                    data: { label: node.name },
                    position: { x: node.x || Math.random() * 400, y: node.y || Math.random() * 400 }
                }));
                setNodesData(formattedNodes);
            })
            .catch(error => {
                console.error("Błąd podczas ładowania węzłów:", error);
            });
    }, []);

    const handleAddNode = () => {
        const newNode = {
            id: (Math.random() * 1000000).toString(), 
            data: { label: 'NODE' },
            position: { x: Math.random() * 400, y: Math.random() * 400 }
        };
        

        setNodesData(nodes => [...nodes, newNode]);

        axios.post('http://localhost:3001/nodes', newNode)
            .then(response => {
                console.log('Węzeł został zapisany:', response.data);
            })
            .catch(error => {
                console.error("Błąd podczas zapisywania węzła:", error);
            });
    };

    const handleNodeDoubleClick = (event, node) => {
        setNodeToEdit(node);
    };

    const handleNodeNameChange = (e) => {
        if (nodeToEdit) {
            const updatedNode = {
                ...nodeToEdit,
                data: { ...nodeToEdit.data, label: e.target.value }
            };
            setNodesData(prevNodes =>
                prevNodes.map(n => (n.id === nodeToEdit.id ? updatedNode : n))
            );
        }
    };
    const saveNodeNameChange = () => {
        if (nodeToEdit) {
            const updatedName = nodeToEdit.data.label;
            axios.put(`http://localhost:3001/nodes/${nodeToEdit.id}`, {
                name: updatedName
            })
            .then(() => {
                console.log(`Nazwa węzła ${nodeToEdit.id} została zaktualizowana`);
                setNodeToEdit(null);
            })
            .catch((error) => {
                console.error("Błąd podczas aktualizacji nazwy węzła:", error);
            });
        }
    };
    

    const handleNodeDragStop = (event, node) => {
        // Aktualizuj pozycję węzła w stanie lokalnym
        setNodesData((prevNodes) =>
          prevNodes.map((n) => (n.id === node.id ? node : n))
        );
    
        // Aktualizuj pozycję węzła w bazie danych
        axios
        .put(`http://localhost:3001/nodes/${node.id}`, {
            x: node.position.x,
            y: node.position.y,
        })
        .then(response => {
            console.log('Odpowiedź serwera:', response.data);
            console.log(`Pozycja węzła ${node.id} została zaktualizowana`);
        })
        .catch((error) => {
            console.error("Błąd podczas aktualizacji pozycji węzła:", error);
        });
    
          
    };
    

    const onConnect = (params) => {
        setNodesData((nodes) => addEdge(params, nodes));
    };

    const onElementsRemove = (elementsToRemove) => {
        const nodeIdsToRemove = elementsToRemove.map(el => el.id);
        setNodesData((nodes) => nodes.filter(node => !nodeIdsToRemove.includes(node.id)));

        elementsToRemove.forEach((element) => {
            if (element.type !== "edge") {
                axios.delete(`http://localhost:3001/nodes/${element.id}`)
                    .then(() => console.log(`Usunięto węzeł o ID ${element.id}`))
                    .catch((error) => console.error("Błąd podczas usuwania węzła:", error));
            }
        });
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodesData}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onNodeDragStop={handleNodeDragStop}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    deleteKeyCode={46} 
                    draggable={true}
                    nodesDraggable={true}
                    snapToGrid={true}
                    snapGrid={[1, 1]} 
                />
            </ReactFlowProvider>
            {nodeToEdit && (
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        value={nodeToEdit.data.label}
                        onChange={handleNodeNameChange}
                    />
                    <button onClick={saveNodeNameChange}>Zapisz zmiany</button>
                </div>
            )}
            <button onClick={handleAddNode} style={{ marginTop: '20px' }}>Dodaj Węzeł</button>
        </div>
    );
}

export default MindMap;