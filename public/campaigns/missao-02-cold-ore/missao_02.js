function openModal(imgElement) {
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = imgElement.src;
        
        if (modalCaption) {
            const captionText = imgElement.nextElementSibling ? imgElement.nextElementSibling.innerText : "";
            modalCaption.innerText = captionText;
        }
        document.body.classList.add("modal-open");
    }
}

function openModalByUrl(url, caption) {
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = url;
        
        if (modalCaption) {
            modalCaption.innerText = caption || "";
        }
        document.body.classList.add("modal-open");
    }
}

function closeModal() {
    const modal = document.getElementById("imgModal");
    if (modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
}

function toggleA4Mode() {
    document.body.classList.toggle('a4-mode');
}

// Modal de Anti-Spoiler
function showSpoilerModal(targetUrl) {
    const spoilerModal = document.getElementById('spoilerModal');
    if (spoilerModal) {
        spoilerModal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Configura o botão de confirmar
        const confirmBtn = document.getElementById('btnConfirmSpoiler');
        if (confirmBtn) {
            confirmBtn.onclick = function() {
                window.location.href = targetUrl;
            };
        }
    }
}

function hideSpoilerModal() {
    const spoilerModal = document.getElementById('spoilerModal');
    if (spoilerModal) {
        spoilerModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Eventos Globais
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
        hideSpoilerModal();
    }
});
