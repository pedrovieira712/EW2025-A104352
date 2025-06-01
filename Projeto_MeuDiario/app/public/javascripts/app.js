// Confirmações de eliminação
document.addEventListener('DOMContentLoaded', function() {
    // Confirmação para eliminações
    const deleteButtons = document.querySelectorAll('form[action*="/delete"]');
    deleteButtons.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Tem certeza que deseja eliminar?')) {
                e.preventDefault();
            }
        });
    });

    // Preview de ficheiros
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            if (fileName) {
                const label = this.nextElementSibling;
                if (label && label.classList.contains('form-text')) {
                    label.textContent = `Selecionado: ${fileName}`;
                }
            }
        });
    });
});