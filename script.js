function showEncode() {
    document.getElementById('encode-section').style.display = 'block';
    document.getElementById('decode-section').style.display = 'none';
    document.getElementById('encode-btn').classList.add('active');
    document.getElementById('decode-btn').classList.remove('active');
}

function showDecode() {
    document.getElementById('decode-section').style.display = 'block';
    document.getElementById('encode-section').style.display = 'none';
    document.getElementById('decode-btn').classList.add('active');
    document.getElementById('encode-btn').classList.remove('active');
}

function encodeText() {
    const text = document.getElementById('text-input').value;
    const imageFile = document.getElementById('encode-image').files[0];
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!imageFile || !text) {
        alert('Please provide an image and text!');
        return;
    }

    loadingSpinner.style.display = 'block'; 

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
         
            const encodedImage = encodeMessage(ctx, canvas, text);
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = dataUrl;
            downloadLink.style.display = 'block';
            loadingSpinner.style.display = 'none'; 
        }
    };
    reader.readAsDataURL(imageFile);
}

function encodeMessage(ctx, canvas, message) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const messageBin = stringToBinary(message + "|||");  
    let dataIndex = 0;

    for (let i = 0; i < imgData.data.length && dataIndex < messageBin.length; i += 4) {
        let pixel = imgData.data[i];

        if (dataIndex < messageBin.length) {
            let bit = messageBin[dataIndex++];
            imgData.data[i] = (pixel & 0xFE) | (bit === '1' ? 1 : 0);  
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

function stringToBinary(str) {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
}

function decodeText() {
    const imageFile = document.getElementById('decode-image').files[0];
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!imageFile) {
        alert('Please upload an image to decode!');
        return;
    }

    loadingSpinner.style.display = 'block'; 

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const decodedMessage = decodeMessage(ctx, canvas);
            document.getElementById('decoded-text').value = decodedMessage;
            loadingSpinner.style.display = 'none'; 
        }
    };
    reader.readAsDataURL(imageFile);
}

function decodeMessage(ctx, canvas) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let binaryMessage = '';
    let message = '';
    let byte = '';
    
    for (let i = 0; i < imgData.data.length; i += 4) {
        const pixel = imgData.data[i];
        binaryMessage += (pixel & 1).toString();  

        if (binaryMessage.length === 8) {
            byte = binaryMessage.slice(0, 8);
            message += String.fromCharCode(parseInt(byte, 2));  
            binaryMessage = '';
        }

       
        if (message.includes('|||')) {
            message = message.split('|||')[0]; 
            break;
        }
    }
    
    return message;
}

function previewImage(event) {
    const file = event.target.files[0];
    let imagePreview;

    if (event.target.id === 'encode-image') {
        imagePreview = document.getElementById('image-preview');
    } else if (event.target.id === 'decode-image') {
        imagePreview = document.getElementById('decode-image-preview');
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; 
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none'; 
    }
}




function encodeText() {
    const text = document.getElementById('text-input').value;
    const encryptionKey = document.getElementById('encryption-key').value;
    const imageFile = document.getElementById('encode-image').files[0];
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!imageFile || !text) {
        alert('Please provide an image and text!');
        return;
    }

    loadingSpinner.style.display = 'block'; 

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            

            const finalText = encryptionKey ? encryptText(text, encryptionKey) : text;
            const encodedImage = encodeMessage(ctx, canvas, finalText);
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = dataUrl;
            downloadLink.style.display = 'block';
            loadingSpinner.style.display = 'none'; 
        }
    };
    reader.readAsDataURL(imageFile);
}

function decodeText() {
    const imageFile = document.getElementById('decode-image').files[0];
    const encryptionKey = document.getElementById('decode-encryption-key').value;
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!imageFile) {
        alert('Please upload an image to decode!');
        return;
    }

    loadingSpinner.style.display = 'block'; 

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const decodedMessage = decodeMessage(ctx, canvas);
            const finalMessage = encryptionKey ? decryptText(decodedMessage, encryptionKey) : decodedMessage;
            document.getElementById('decoded-text').value = finalMessage;
            loadingSpinner.style.display = 'none'; 
        }
    };
    reader.readAsDataURL(imageFile);
}


function encryptText(text, key) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) + key.length); 
    }
    return encrypted;
}


function decryptText(text, key) {
    let decrypted = '';
    for (let i = 0; i < text.length; i++) {
        decrypted += String.fromCharCode(text.charCodeAt(i) - key.length); 
    }
    return decrypted;
}
