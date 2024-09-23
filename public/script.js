

//200 objetos
  /*  document.addEventListener('DOMContentLoaded', () => {
        const departmentSelect = document.getElementById('department');
        const keywordInput = document.getElementById('keyword');
        const locationInput = document.getElementById('location');
        const searchButton = document.getElementById('search');
        const gallery = document.getElementById('gallery');
        const paginationContainer = document.getElementById('pagination'); // Contenedor para la paginación


        const apiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';
        let allObjects = [];  // Almacenará los primeros 200 objetos
        let currentPage = 1;
        const itemsPerPage = 20;
        const maxObjects = 200;  // Limite de 200 objetos


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
    
        async function searchArt(page = 1) {
            const department = departmentSelect.value;
            const keyword = keywordInput.value.trim();
            const location = locationInput.value.trim();
            console.log("Filtro de localización:", location);
            
    
            let url = `${apiBase}/objects?`;
            if (department) url += `departmentIds=${department}&`;
            if (keyword) url += `q=${keyword}&`;
            if (location) url += `geoLocation=${location}&`;
    
            console.log(`Realizando búsqueda con la URL: ${url}`);
            const response = await fetch(url);
            const data = await response.json();
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
            paginatedObjects.forEach(object => createCard(object));
    
            // Crear botones de paginación
            createPagination(allObjects.length, page);
        }
    
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
    
        function createCard(object) {
            const card = document.createElement('div');
            card.classList.add('card');
    
            const img = document.createElement('img');
            img.src = object.primaryImageSmall || './noImage.jpg';
            img.alt = object.title;
            img.title = object.objectDate || 'Fecha desconocida'; // Tooltip con la fecha
    
            const content = document.createElement('div');
            content.classList.add('card-content');
            content.innerHTML = `
                <h3>${object.title || 'Sin título'}</h3>
                <p><strong>Cultura:</strong> ${object.culture || 'Desconocida'}</p>
                <p><strong>Dinastía:</strong> ${object.dynasty || 'Desconocida'}</p>
            `;
    
            card.appendChild(img);
            card.appendChild(content);
            gallery.appendChild(card);
        }
    
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
    
        fetchDepartments();
    
        searchButton.addEventListener('click', () => {
            allObjects = [];  // Limpiamos los objetos anteriores
            console.log("Iniciando nueva búsqueda...");
            searchArt();      // Realizamos la búsqueda en la primera página
        });
    });*/






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

    async function searchArt(page = 1) {
        const department = departmentSelect.value;
        const keyword = keywordInput.value.trim();
        const location = locationSelect.value;  // Recuperamos el valor del select de localización
        console.log("Filtro de localización:", location);

        let url = `${apiBase}/objects?`;
        if (department) url += `departmentIds=${department}&`;
        if (keyword) url += `q=${keyword}&`;
        if (location) url += `geoLocation=${location}&`;

        console.log(`Realizando búsqueda con la URL: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
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
        paginatedObjects.forEach(object => createCard(object));

        // Crear botones de paginación
        createPagination(allObjects.length, page);
    }

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

    function createCard(object) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = object.primaryImageSmall || './noImage.jpg';
        img.alt = object.title;
        img.title = object.objectDate || 'Fecha desconocida'; // Tooltip con la fecha

        const content = document.createElement('div');
        content.classList.add('card-content');
        content.innerHTML = `
            <h3>${object.title || 'Sin título'}</h3>
            <p><strong>Cultura:</strong> ${object.culture || 'Desconocida'}</p>
            <p><strong>Dinastía:</strong> ${object.dynasty || 'Desconocida'}</p>
        `;

        card.appendChild(img);
        card.appendChild(content);
        gallery.appendChild(card);
    }

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

    fetchDepartments();

    searchButton.addEventListener('click', () => {
        allObjects = [];  // Limpiamos los objetos anteriores
        console.log("Iniciando nueva búsqueda...");
        searchArt();      // Realizamos la búsqueda en la primera página
    });
});