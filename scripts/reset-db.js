import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'artists.json')

// Clears all demo mock data, resets to empty production state
fs.writeFileSync(dbPath, JSON.stringify([], null, 2), 'utf-8')
console.log('Database wiped clean. Ready for 100% genuine new users!')
