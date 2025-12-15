const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATABAS SETUP & SEEDING ---
const db = new sqlite3.Database('./gallery.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Databas ansluten.');
        initDb();
    }
});

function initDb() {
    // Skapa tabellen
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        description TEXT,
        isFavorite INTEGER DEFAULT 0, 
        dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (!err) {
            // När tabellen är klar, kolla om den är tom
            seedDatabase();
        }
    });
}

// Funktion för att fylla på med Fake Data
function seedDatabase() {
    db.get("SELECT count(*) as count FROM images", (err, row) => {
        if (err) return console.error(err);
        
        // Om databasen är tom (0 rader), lägg in fake data
        if (row.count === 0) {
            console.log("Databasen är tom. Lägger in fake data...");
            
            const mockData = [
                {
                    title: "Neon Dashboard UI",
                    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                    desc: "Futuristiskt gränssnitt med mörka toner och neonfärger.",
                    fav: 1
                },
                {
                    title: "Minimalistisk Stol",
                    url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
                    desc: "Inspiration för ren inredningsdesign och trämöbler.",
                    fav: 0
                },
                {
                    title: "Swiss Typography",
                    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
                    desc: "Klassisk layout-inspiration med Helvetica och grid-system.",
                    fav: 1
                },
                {
                    title: "Modern Arkitektur",
                    url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80",
                    desc: "Betong, glas och skarpa vinklar. Brutalistisk stil.",
                    fav: 0
                },
                {
                    title: "Abstrakt 3D Render",
                    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
                    desc: "Flytande former i pastellfärger. Bra för bakgrunder.",
                    fav: 0
                },
                {
                    title: "Mobile App Kit",
                    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
                    desc: "Rena skärmar för en fintech-applikation.",
                    fav: 1
                },
                {
                    title: "Natur & Textur",
                    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
                    desc: "Organiska mönster för eco-friendly branding.",
                    fav: 0
                },
                {
                    title: "Retro Tech",
                    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
                    desc: "Synthwave estetik och gammal hårdvara.",
                    fav: 0
                }
            ];

            const insert = db.prepare('INSERT INTO images (title, imageUrl, description, isFavorite) VALUES (?,?,?,?)');
            
            mockData.forEach(item => {
                insert.run([item.title, item.url, item.desc, item.fav]);
            });
            
            insert.finalize();
            console.log("Fake data tillagd!");
        }
    });
}

// --- ROUTES ---

// Hämta alla
app.get('/api/images', (req, res) => {
    db.all("SELECT * FROM images ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Lägg till
app.post('/api/images', (req, res) => {
    const { title, imageUrl, description } = req.body;
    db.run('INSERT INTO images (title, imageUrl, description) VALUES (?,?,?)', 
    [title, imageUrl, description], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", id: this.lastID });
    });
});

// Radera
app.delete('/api/images/:id', (req, res) => {
    db.run('DELETE FROM images WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "deleted" });
    });
});

// Toggle Favorit
app.put('/api/images/:id/favorite', (req, res) => {
    const { isFavorite } = req.body;
    db.run('UPDATE images SET isFavorite = ? WHERE id = ?', [isFavorite, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "updated" });
    });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));