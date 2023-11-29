window.onload = function () {
    removeProject('project1');
}

// Função para mostrar os detalhes de um projeto
function showDetails(projectId, event) {
    event.preventDefault();

    var projectDetails = document.getElementById(projectId).getElementsByClassName('project-details')[0];

    if (projectDetails.style.display === 'none') {
        projectDetails.style.display = 'block';
    } else {
        projectDetails.style.display = 'none';
    }
}

// Função para adicionar um novo projeto
function addProject(input) {
    var projectsSection = document.getElementById('projects-section');
    var newProjectId = 'project' + (projectsSection.childElementCount + 1); //  para atribuir IDs exclusivos
    var newProject = document.createElement('div');
    newProject.className = 'project';
    newProject.id = newProjectId;

    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;

        newProject.innerHTML = `
            <h3>${file.name}</h3>
            <div class="button-group">
                <a href="#" class="button" onclick="showDetails('${newProjectId}', event)">Descrição e Detalhes</a>
                <button class="button" onclick="removeProject('${newProjectId}')">Remover Projeto</button>
                <button class="button" onclick="downloadProject('${content}', '${file.name}', '${file.type}')">Baixar Projeto</button>
                <button class="button" onclick="viewCode('${newProjectId}')">Visualizar Código</button>
                <button class="button" onclick="saveProjectDetails('${newProjectId}')">Salvar</button>
            </div>
            <div class="description-details-container">
                <div class="description-container">
                    <label for="${newProjectId}-description"></label>
                    <p class="project-description"></p>
                    <textarea id="${newProjectId}-description" placeholder="Descrição" rows="3"></textarea>
                </div>
                <div class="details-container">
                    <label for="${newProjectId}-details"></label>
                    <p class="project-details-text"></p>
                    <textarea id="${newProjectId}-details" placeholder="Detalhes" rows="5"></textarea>
                </div>
            </div>
            <div class="project-details" style="display: none;">
                <p class="project-description"></p>
                <p class="project-details-text"></p>
            </div>
        `;

        projectsSection.insertBefore(newProject, projectsSection.lastChild);

        // Limpa o valor do input de arquivo para permitir a seleção do mesmo arquivo novamente
        input.value = '';

        // Remover os botões existentes
        var existingButtons = projectsSection.getElementsByClassName('add-remove-project');
        for (var i = 0; i < existingButtons.length; i++) {
            projectsSection.removeChild(existingButtons[i]);
        }

        // Adiciona novos botões de adicionar/remover
        var addRemoveProject = document.createElement('div');
        addRemoveProject.className = 'add-remove-project';
        addRemoveProject.innerHTML = `
            <input type="file" id="fileInput" style="display: none;" onchange="addProject(this)">
            <button class="button" onclick="openFileInput()">Adicionar Projeto</button>
            <button class="button" onclick="removeLastProject()">Remover Último Projeto</button>
        `;

        projectsSection.appendChild(addRemoveProject);

        // Agora, após adicionar o projeto, rolar para exibi-lo completamente na tela
        newProject.scrollIntoView({ behavior: 'smooth' });
    };

    reader.readAsDataURL(file);
}

// Função para salvar os detalhes do projeto
function saveProjectDetails(projectId) {
    var projectDetails = document.getElementById(projectId).getElementsByClassName('project-details')[0];
    var projectDescription = projectDetails.querySelector('.project-description');
    var projectDetailsText = projectDetails.querySelector('.project-details-text');

    var descriptionTextarea = document.getElementById(`${projectId}-description`);
    var detailsTextarea = document.getElementById(`${projectId}-details`);

    // Obtém os valores dos campos de texto
    var descriptionValue = descriptionTextarea.value.trim();
    var detailsValue = detailsTextarea.value.trim();
    
 // Atualiza os elementos de detalhes com os valores dos campos de texto formatados
    projectDescription.innerHTML = descriptionValue ? `<span class="project-description-label">Descrição:</span> ${descriptionValue}` : projectDescription.innerHTML;
    projectDetailsText.innerHTML = detailsValue ? `<span class="project-details-label">Detalhes:</span> ${detailsValue}` : projectDetailsText.innerHTML;

    
    // Esconde os campos de texto após salvar
    descriptionTextarea.style.display = 'none';
    detailsTextarea.style.display = 'none';

    // Mostra os detalhes após salvar, se houver conteúdo
    projectDetails.style.display = descriptionValue || detailsValue ? 'block' : 'none';

    // Limpa o conteúdo dos campos de texto
    descriptionTextarea.value = '';
    detailsTextarea.value = '';

    // Salva os detalhes no armazenamento local
    localStorage.setItem(`${projectId}-description`, projectDescription.innerHTML);
    localStorage.setItem(`${projectId}-details`, projectDetailsText.innerHTML);
}

// Função para visualizar o código no GitHub
function viewCode(projectId) {
    var projectUrlBase = 'https://github.com/seu-usuario/'; // Substitua com a URL base do seu repositório GitHub
    var projectUrl = projectUrlBase + projectId;

    if (projectUrl) {
        window.open(projectUrl, '_blank');
    } else {
        console.error('URL do repositório GitHub não especificada.');
    }
}

// Função para abrir o input de arquivo ao clicar no botão "Adicionar Projeto"
function openFileInput() {
    document.getElementById('fileInput').click();
}

// Função para remover o último projeto
function removeLastProject() {
    var projectsSection = document.getElementById('projects-section');
    var lastProject = projectsSection.lastChild.previousElementSibling;

    if (lastProject && lastProject.classList.contains('project')) {
        projectsSection.removeChild(lastProject);
    } else {
        alert('Não há projetos para remover.');
    }

    // Armazenar projetos no armazenamento local
    saveProjectsToLocalStorage();
}

// Função para remover um projeto específico
function removeProject(projectId) {
    var projectsSection = document.getElementById('projects-section');
    var projectToRemove = document.getElementById(projectId);

    if (projectToRemove) {
        projectsSection.removeChild(projectToRemove);
    }

    // Armazenar projetos no armazenamento local
    saveProjectsToLocalStorage();
}

// Função para baixar um projeto
async function downloadProject(projectUrl, fileName, fileType) {
    try {
        const response = await fetch(projectUrl);
        const content = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = fileName;

        // Adiciona o link ao documento, simula um clique e remove o link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao baixar o projeto:', error);
    }
}

// Função para carregar os detalhes salvos do armazenamento local
function loadProjectDetails(projectId) {
    var projectDescription = localStorage.getItem(`${projectId}-description`);
    var projectDetails = localStorage.getItem(`${projectId}-details`);

    // Atualiza os detalhes exibidos no projeto
    var project = document.getElementById(projectId);
    var projectDescriptionText = project.querySelector('.project-description');
    var projectDetailsText = project.querySelector('.project-details-text');

    // Atualiza os detalhes exibidos no projeto com formatação adequada
    projectDescriptionText.innerHTML = projectDescription ? `Descrição: ${projectDescription}` : '';
    projectDetailsText.innerHTML = projectDetails ? `Detalhes: ${projectDetails}` : '';
}




