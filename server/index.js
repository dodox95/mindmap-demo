const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Po inicializacji bazy danych
const db = new Datastore({ filename: './database.db', autoload: true });

db.find({}, (err, nodes) => {
    if (err) throw err;

    if (nodes.length === 0) {
        const defaultNodes = [
            { name: "Główny węzeł", x: 200, y: 200 },
            { name: "Gałąź 1", x: 100, y: 400 },
            { name: "Gałąź 2", x: 300, y: 400 }
        ];

        db.insert(defaultNodes, (err) => {
            if (err) throw err;
            console.log("Dodano domyślne węzły do bazy danych.");
        });
    }
});

// CREATE: Dodaj nowy węzeł
app.post('/nodes', (req, res) => {
    const node = req.body;
    db.insert(node, (err, newNode) => {
        if (err) {
            res.status(500).send({ error: 'Błąd podczas dodawania węzła' });
            return;
        }
        res.status(200).send(newNode);
    });
});

// READ: Odczytaj wszystkie węzły
app.get('/nodes', (req, res) => {
    db.find({}, (err, nodes) => {
        if (err) {
            res.status(500).send({ error: 'Błąd podczas odczytywania węzłów' });
            return;
        }
        res.status(200).send(nodes);
    });
});

// UPDATE: Aktualizuj węzeł
app.put('/nodes/:id', (req, res) => {
    const nodeId = req.params.id;
    const updateData = { x: updatedData.x, y: updatedData.y };
    if (updatedData.name !== 'NODE') {
        updateData.name = updatedData.name;
    }
    db.update({ _id: nodeId }, { $set: updateData }, {}, (err, numReplaced) => {
        
        if (err) {
            console.error("Błąd podczas aktualizacji w bazie danych:", err);
            res.status(500).send({ error: 'Błąd podczas aktualizacji węzła' });
            return;
        }
        
        if (numReplaced === 0) {
            res.status(404).send({ message: 'Nie znaleziono węzła o podanym ID' });
            return;
        }
        
        res.status(200).send({ message: 'Węzeł został zaktualizowany' });
    });
});



// DELETE: Usuń węzeł
app.delete('/nodes/:id', (req, res) => {
    const nodeId = req.params.id;

    db.remove({ _id: nodeId }, {}, (err, numRemoved) => {
        if (err) {
            res.status(500).send({ error: 'Błąd podczas usuwania węzła' });
            return;
        }
        if (numRemoved === 0) {
            res.status(404).send({ message: 'Nie znaleziono węzła o podanym ID' });
            return;
        }
        res.status(200).send({ message: 'Węzeł został usunięty' });
    });
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
