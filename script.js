// script.js

// Select necessary elements
const dropZone = document.getElementById('drop-zone');
const unpackButton = document.getElementById('unpack-button');
const progressDiv = document.getElementById('progress');

let zipFiles = [];

// Drag-and-drop event listeners
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(event.dataTransfer.files);
});

// Handle dropped files
function handleFiles(files) {
    for (let file of files) {
        if (file.name.endsWith('.zip')) {
            zipFiles.push(file);
            updateProgress(`Added ${file.name}`);
        } else {
            updateProgress(`Ignored ${file.name} (not a zip file)`);
        }
    }
    console.log('Files to unpack:', zipFiles);
}

// Unpack and save files when the button is clicked
unpackButton.addEventListener('click', () => {
    if (zipFiles.length === 0) {
        updateProgress('No zip files to unpack');
        return;
    }

    updateProgress('Unpacking files...');
    unpackFiles(zipFiles);
});

// Unpack zip files and save contents
function unpackFiles(files) {
    files.forEach(file => {
        console.log(`Unpacking: ${file.name}`);
        JSZip.loadAsync(file).then(zip => {
            console.log(`Zip contents of ${file.name}:`, zip.files);
            return Promise.all(Object.keys(zip.files).map(async (fileName) => {
                const zipFile = zip.files[fileName];
                const blob = await zipFile.async('blob');
                saveAs(blob, fileName);
            }));
        }).then(() => {
            updateProgress(`Successfully unpacked ${file.name}`);
        }).catch(error => {
            console.error('Error unpacking zip file:', error);
            updateProgress('Error unpacking some files.');
        });
    });
}

// Update progress text
function updateProgress(message) {
    progressDiv.innerHTML += `<p>${message}</p>`;
}
