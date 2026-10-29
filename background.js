chrome.runtime.onInstalled.addListener(() => {
  // Crear menú principal
  const parent = chrome.contextMenus.create({
    id: "convert-parent",
    title: "Convertir imagen...",
    contexts: ["image"]
  });

  // Submenús
  chrome.contextMenus.create({
    id: "convert-png",
    parentId: parent,
    title: "Como PNG",
    contexts: ["image"]
  });

  chrome.contextMenus.create({
    id: "convert-jpg",
    parentId: parent,
    title: "Como JPG",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const format = info.menuItemId.replace("convert-", ""); // 'png' o 'jpg'
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: convertImage,
    args: [info.srcUrl, format]
  });
});

// Función que se ejecuta en la página
function convertImage(srcUrl, format) {
  fetch(srcUrl)
    .then(response => response.blob())
    .then(blob => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Si es JPG, rellenar fondo blanco (porque JPG no soporta transparencia)
        if (format === 'jpg') {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);

        // Intentar obtener un nombre mejor
        const urlParts = srcUrl.split('/');
        const originalName = urlParts[urlParts.length - 1].split('?')[0];
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'imagen_convertida';
        const fileName = `${baseName}.${format === 'jpg' ? 'jpg' : 'png'}`;

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(img.src);
      };
    })
    .catch(err => {
      console.error(err);
      chrome.runtime.sendMessage({ type: "error", message: "No se pudo convertir la imagen. Puede ser una restricción de seguridad del sitio web." });
    });
}

// Escuchar errores para mostrar notificaciones
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "error") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Error de conversión",
      message: request.message
    });
  }
});
