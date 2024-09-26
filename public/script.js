document.addEventListener('DOMContentLoaded', () => {
    const departmentSelect = document.getElementById('department');
    const keywordInput = document.getElementById('keyword');
    const locationSelect = document.getElementById('location');  // Cambiado a select
    const searchButton = document.getElementById('search');
    const gallery = document.getElementById('gallery');
    const paginationContainer = document.getElementById('pagination'); // Contenedor para la paginación
    


    const apiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';
    let allObjects = [];  // Almacenará los primeros 200 objetos
    let currentPage = 1;
    const itemsPerPage = 20;
    const maxObjects = 200;  // Limite de 200 objetos

    // Fetch de los departamentos desde la API
    async function fetchDepartments() {
        console.log("Solicitando departamentos...");
        const response = await fetch(`${apiBase}/departments`);
        const data = await response.json();
        const departments = data.departments;
        console.log("Departamentos recibidos:", departments);

        departmentSelect.innerHTML = '<option value="">Selecciona un departamento</option>';
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.departmentId;
            option.textContent = dept.displayName;
            departmentSelect.appendChild(option);
        });
    }

    // Función principal de búsqueda de objetos
    async function searchArt(page = 1) {
        const department = departmentSelect.value;
        const keyword = keywordInput.value.trim();
        const location = locationSelect.value;  // Recuperamos el valor del select de localización
        console.log("Filtro de localización:", location);

        let url = `${apiBase}/objects?`;
        if (department) url += `departmentIds=${department}&`;
        if (keyword) url += `q=${keyword}&`;
        if (location) url += `geoLocation=${location}&`;
        url = url.slice(0, -1);

        console.log(`Realizando búsqueda con la URL: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        console.log("Resultados de la búsqueda:", data);
        const objects = data.objectIDs || [];
        console.log("IDs de objetos recibidos:", objects);

        // Limitamos el número de objetos a 200
        const limitedObjectIDs = objects.slice(0, maxObjects);
        console.log("IDs de objetos limitados a 200:", limitedObjectIDs);

        // Si no hemos almacenado los objetos previamente, los recuperamos
        if (allObjects.length === 0) {
            allObjects = await fetchObjects(limitedObjectIDs);
            console.log("Objetos recuperados:", allObjects);
        }

        // Paginación local
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedObjects = allObjects.slice(start, end);

        // Limpiamos la galería antes de mostrar los nuevos objetos
        gallery.innerHTML = '';

        // Mostramos los objetos de la página actual
        //paginatedObjects.forEach(object => createCard(object));


        gallery.innerHTML = '';
        for (const object of paginatedObjects) {
            await createCard(object);  // Traducimos y mostramos los objetos
        }
        


        // Crear botones de paginación
        createPagination(allObjects.length, page);
    }

    // Función que solicita los objetos usando los IDs
    async function fetchObjects(objectIDs) {
        console.log(`Solicitando objetos para los siguientes IDs: ${objectIDs}`);
        const objectPromises = objectIDs.map(async (id) => {
            const response = await fetch(`${apiBase}/objects/${id}`);
            const object = await response.json();
            console.log(`Objeto recibido con ID ${id}:`, object);
            return object;
        });
        return Promise.all(objectPromises);  // Esperamos a que se resuelvan todas las promesas
    }






    async function translateText(text, targetLang = 'es') {
        if(text === '') return text;
        try {

            //console.log({ text: text, targetLang: targetLang });
            const response = await fetch('/translate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text, targetLang: targetLang })
            });
            const result = await response.json();
            return result.translatedText;
            
        } catch (error) {
            console.error('Error al traducir texto:', error);
            return text; // Devuelve el texto original si hay un error
        }
    }



    // Función para crear un modal
function createModal(images) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div class="image-gallery">
                ${images.map(image => `<img src="${image}" alt="Additional Image">`).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Cerrar el modal
    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.remove();
    });

    // Mostrar el modal
    modal.style.display = 'block';
}





    // Función que crea las tarjetas de los objetos
    async function createCard(object) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = object.primaryImageSmall || './noImage.jpg';
        img.alt = object.title;
        img.title = object.objectDate || 'Fecha desconocida'; // Tooltip con la fecha

        const titleTranslated = await translateText(object.title || 'Sin título');
        const cultureTranslated = await translateText(object.culture || 'Desconocida');
        const dynastyTranslated = await translateText(object.dynasty || 'Desconocida');


        const content = document.createElement('div');
        content.classList.add('card-content');
        content.innerHTML = `
            <h3>${titleTranslated}</h3>
            <p><strong>Cultura:</strong> ${cultureTranslated}</p>
            <p><strong>Dinastía:</strong> ${dynastyTranslated}</p>
        `;

        
        card.appendChild(img);
        card.appendChild(content);

        // Si el objeto tiene imágenes adicionales, mostramos el botón para abrir un modal
        if (object.additionalImages && object.additionalImages.length > 0) {
            const viewMoreButton = document.createElement('button');
            viewMoreButton.textContent = 'Ver imágenes adicionales';
            viewMoreButton.addEventListener('click', () => {
                createModal(object.additionalImages);
            });
            card.appendChild(viewMoreButton);
        }


        gallery.appendChild(card);
    }

    // Función que crea la paginación
    function createPagination(totalItems, currentPage) {
        paginationContainer.innerHTML = ''; // Limpiamos la paginación previa
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        console.log(`Creando paginación. Total de páginas: ${totalPages}, Página actual: ${currentPage}`);

        if (totalPages > 1) {
            // Botón "Anterior"
            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Anterior';
                prevButton.addEventListener('click', () => searchArt(currentPage - 1));
                paginationContainer.appendChild(prevButton);
            }

            // Botones numéricos para las páginas
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                if (i === currentPage) {
                    pageButton.disabled = true; // Deshabilitamos el botón de la página actual
                }
                pageButton.addEventListener('click', () => searchArt(i));
                paginationContainer.appendChild(pageButton);
            }

            // Botón "Siguiente"
            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Siguiente';
                nextButton.addEventListener('click', () => searchArt(currentPage + 1));
                paginationContainer.appendChild(nextButton);
            }
        }
    }

    // Llamada inicial para obtener los departamentos
    fetchDepartments();

    // Evento de click para el botón de búsqueda
    searchButton.addEventListener('click', () => {
        allObjects = [];  // Limpiamos los objetos anteriores
        console.log("Iniciando nueva búsqueda...");
        searchArt();      // Realizamos la búsqueda en la primera página
    });
});