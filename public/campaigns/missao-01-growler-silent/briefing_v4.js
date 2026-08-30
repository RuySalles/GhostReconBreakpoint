function openModal(imgElement) {
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    
    modal.style.display = "flex";
    modalImg.src = imgElement.src;
    
    // Pega o texto da legenda logo abaixo da imagem na página
    const captionText = imgElement.nextElementSibling ? imgElement.nextElementSibling.innerText : "";
    modalCaption.innerText = captionText;

    // Trava o scroll da página de fundo
    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById("imgModal").style.display = "none";
    // Libera o scroll da página de fundo
    document.body.classList.remove("modal-open");
}

// Fecha o modal ao pressionar a tecla ESC do teclado
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
