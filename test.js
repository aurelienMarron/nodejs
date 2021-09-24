// const fs = require('fs');
// const folder = require('os').homedir();
//
//
// function getIcon(item) {
//     if (item.isDirectory()) {
//         return '📁';
//     }
//     return '🌷';
// }
//
//
// async function list(path) {
//     const items = await fs.promises.readdir(path, {withFileTypes: true});
//     for (const item of items) {
//         console.log(getIcon(item) + ' ' + item.name);
//     }
//     return items.length;
// }
// list(folder)
//     .then(itemCount => {
//         console.error(`Done! The folder "${folder}" contains ${itemCount} items`);
//     }) .catch(error => {
//     console.error(`Cannot list the folder "${folder}"`, error);
// });
const level = require('level')
const db = level('./db', { valueEncoding: 'json' })

db.put('key', { example: true }, function (err) {
    if (err) throw err

    db.get('key', function (err, value) {
        if (err) throw err
        console.log(value)
    })
})

