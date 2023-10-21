# NodeMindMap

A Node-based Mind Mapping application powered by React and Express with NeDB as the data store.

## Introduction

This project offers a way to visually create and edit mind maps. Each node in the map can be dragged, edited, or deleted, and the application also supports adding connections between nodes. The backend utilizes Express to handle the API requests, and the data is stored using NeDB.

## Installation

1. Clone this repository:
```bash
git clone <repository-url>

1.     Install the dependencies:
npm install

2. Start the server:
node server/index.js

3.     In a separate terminal, start the React frontend:
npm start

Usage

    Visit http://localhost:3000 in your browser.
    Interact with the nodes by dragging them, double-clicking to edit, and use the "Add Node" button to introduce new nodes.
    Connect nodes by dragging a connection from one node to another.
    Save the node name changes by clicking on the "Save Changes" button after editing.

Features

    Dynamic Node Manipulation: Add, edit, and delete nodes with ease.
    Persistent Storage: All node data is stored using NeDB, ensuring that your mind maps remain intact even after server restarts.
    Intuitive Connections: Easily draw connections between nodes to visualize relationships and dependencies.
    Drag & Drop Interface: Move nodes around to design your mind map the way you envision it.

License

This project is open-sourced under the MIT license.
