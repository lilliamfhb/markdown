const editorBtn = document.querySelectorAll('.editorBtn');
const previewBtn = document.querySelectorAll('.previewBtn');
const negritaBtn = document.querySelectorAll('.strongBtn');
const editBtn = document.querySelectorAll('.editBtn');
const deleteBtn = document.querySelectorAll('.deleteBtn');
const closeEditBtn = document.querySelectorAll('.closeEditBtn');
const finishEditBtn = document.querySelectorAll('.finishEditBtn');
const finish = document.querySelector('#c-finish');
const sendBtn = document.querySelector('#sendBtn');
let container = document.querySelector('#savedList');
let proccess = document.querySelector('#proccess');
let success = document.querySelector('#success');
const merge = document.querySelector('#merge');

// intercambiar vistas del tab 
const tabPrequest = (id,task) => {
    const tabOptions = document.querySelectorAll(`#${id} .tab-option`);
    const prequestEditor = document.querySelector(`#${id} .c-editor`);
    const prequestPreview = document.querySelector(`#${id} .c-preview`);

    tabOptions.forEach(tabOption => {
        tabOption.classList.remove('active');
    });

    if(task == 'editor') {
        const btn = document.querySelector(`#${id} .editorBtn`);
        btn.classList.add('active')
        prequestEditor.classList.remove('d-none');
        prequestPreview.classList.add('d-none');
    } else if(task == 'preview') {
        const btn = document.querySelector(`#${id} .previewBtn`);
        btn.classList.add('active')
        prequestEditor.classList.add('d-none');
        prequestPreview.classList.remove('d-none')
    }
}
// mostrar el editor 
editorBtn.forEach(button => {
    button.addEventListener('click', (e)=> {
        const id = e.target.getAttribute('data-item');
        htmlToMarkdown(id);
        tabPrequest(id,'editor');
    })
});
// mostrar el preview 
previewBtn.forEach(button => {
    button.addEventListener('click', (e)=> {
    // renderizar el html 

    // mostrar el preview 
    const id = e.target.getAttribute('data-item');
    markdown(id);
    tabPrequest(id,'preview');
    })
});

// poerner negrita con el boton 
negritaBtn.forEach(button => {
    button.addEventListener('click', (e)=> {
        const id = e.target.getAttribute('data-item');
        let selectedText = window.getSelection().toString();
        let commentInput = document.querySelector(`#${id}Textarea`);
        // console.log(commentInput, 'comment inoutt')

        if (selectedText != '') {
            let markdown = commentInput.value;
            let innerText = markdown.replace(selectedText,`**${selectedText}**`);
            // console.log(commentInput, markdown, innerText, 'aaaaaaaaaaaaaaa');
            commentInput.value = innerText;
        }
    })
})

// ejecutar funcion para obtnere texto markdown negrita e img 
const markdown = (id) => {
    const commentInput = document.querySelector(`#${id}Textarea`);
    const previewContainer = document.querySelector(`#${id} .c-preview`);
    const markdown = commentInput.value;
    const html = markdownToHtml(markdown);
    // console.log('staaaaaa',html);
    previewContainer.innerHTML = html;
}
// de mardowm a html
const markdownToHtml = (markdown) => {
    // Detectar los asteristicos de las negritas
    const boldRegex = /\*\*(.*?)\*\*/g;
    // reemplazar ** por las etiquetas strong 
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const boldText = markdown.replace(boldRegex, '<strong>$1</strong>');
    const boldImgText = boldText.replace(imageRegex, '<img alt="$1" src="$2">')
    return boldImgText;
}

// de html a markdown
const htmlToMarkdown = (id) => {
    const commentInput = document.querySelector(`#${id}Textarea`);
    const previewContainer = document.querySelector(`#${id} .c-preview`);
    // trim para quitar los espacios que aparecian
    let previewText = previewContainer.innerHTML.trim();
    // console.log(previewText,'aaaa')
    if(previewText != '') {
        const boldRegex = /<strong>(.*?)<\/strong>/g;
        const imageRegex = /<img[^>]+alt="([^">]*)"[^>]+src="([^">]*)"[^>]*>/g;;
        const formattedText = previewText.replace(boldRegex, '**$1**');
        const formattedTextImage = formattedText.replace(imageRegex, '![$1]($2)');
        console.log(formattedTextImage,'formatedtext')
        commentInput.value = formattedTextImage;
        console.log('yes')

    } else {
        console.log('no')
    }
}

// drag and drop para elemento fuera del container de elementos dinamicos
const dropZone = document.querySelectorAll('.c-editor');

dropZone.forEach(area => {
    area.addEventListener('drop', async (e) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-item');
    const files = e.dataTransfer.files;
    
    if (files.length > 0) {
        const file = files[0];
        const imageUrl = await uploadImage(file);
        
        let textarea = document.querySelector(`#${id}Textarea`);
        textarea.value += `![${file.name}](${imageUrl})`;
    }
    })
})

// subir la imagenal api 
const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pmuyziti");

    return fetch('https://api.cloudinary.com/v1_1/djdlmt5js/upload', {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
        // console.log('imagen url', data.secure_url);
        return data.secure_url;
        })
        .catch(error => {
        // console.error('Error al subir la imagen: :(', error);
    });
}

// leer los comentarios de localhost 
const showComments = () => {
    container.innerHTML = ''
    const savedComments = localStorage.getItem('savedComments');
    if(savedComments) {
        let lista = JSON.parse(savedComments);

        for(let i=0; i<lista.length;i++) {
            let id= lista[i].id;
            let editorText = lista[i].editorText;
            let previewText = markdownToHtml(editorText);
            let fecha = lista[i].fecha;
            console.log(id, previewText,'tihsss')

            const newItem = document.createElement('li');
            let plantilla =`<div id="comment${id}" class="c-comments w-100 d-flex justify-content-center">
            <div class="c-prequest w-100">
                <figure class="c-prequest__icon">
                    <img class="w-100 h-100" src="./images/icon.png" alt="">
                </figure>
                <div class="c-prequest__content">
                    <div class="c-prequest__head c-prequest__head--comment align-items-center justify-content-between">
                        <div class="c-prequest__head-items">
                            <strong>User123</strong> comento el ${fecha}
                        </div>
        
                        <div class="c-prequest__head-items d-flex align-items-center">
                            <div class="c-autor-flag">
                                Autor
                            </div>
                            <details id="headEditGroup" class="position-relative">
                                <summary class="c-edit">...</summary>
                                <details-menu class="c-edit__options position-absolute">
                                    <button class="editBtn" data-item="comment${id}">Editar</button>
                                    <button class="deleteBtn" data-item="comment${id}">Borrar</button>
                                </details-menu>
                            </details>
                        </div>
                    </div>
        
                    <div class="c-prequest__head c-prequest__head--editor align-items-center justify-content-between d-none">
                        <ul>
                            <li>
                                <button class="editorBtn active tab-option" data-item="comment${id}">
                                    Write
                                </button>
                            </li>
                            <li>
                                <button class="previewBtn tab-option" data-item="comment${id}">
                                        Preview
                                </button>
                            </li>
                        </ul>
        
                        <ul>
                            <li>
                                <button class="strongBtn" data-item="comment${id}">
                                        B
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="c-prequest__body">
                        <div class="c-prequest__input">
                            <div class="c-preview c-preview--comment">
                                ${previewText}
                            </div>
                            <div class="c-editor-group d-none">
                                <div class="c-editor" >
                                    <textarea id="comment${id}Textarea" data-item="comment${id}" class="w-100 textarea" placeholder="Leave a comment"></textarea>
                                    <span id="comment${id}Focus" class="focus"></span>
                                    <label class="c-editor__bottom-img position-relative w-100 m-0">
                                        <input type="file" class="position-absolute w-100 h-100">
                                        <span>
                                            Attach files by dragging & dropping, selecting or pasting them.
                                        </span>
                                    </label>
                                </div>
                                <div class="c-prequest__buttons d-flex justify-content-end">
                                    <button data-item="comment${id}" class="closeEditBtn c-button c-button--ghost">Close Edit</button>
                                    <button data-item="comment${id}" class="finishEditBtn c-button c-button--primary">Editar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>`;
            newItem.innerHTML = plantilla;
            // console.log(container)
            container.appendChild(newItem);
        }
        finish.classList.remove('d-none')
    }
}

// ejecutar la funcion desde el principip para mostrra los comentarios guardados
showComments();

// enviar comentario
sendBtn.addEventListener('click', ()=> {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    // default para pregunta al navegador la region xd
    // { month: 'long' } que devuelva el nombre completo
    const nombreMesActual = fechaActual.toLocaleString('default', { month: 'long' });
    const fecha = `${dia} de ${nombreMesActual}`;
    let editorText =  document.querySelector('#prequestTextarea').value;
    const savedComments = localStorage.getItem('savedComments');
    
    // console.log(savedComments,'textoo0')
    if(editorText) {
        if (savedComments) {
            let lista = JSON.parse(savedComments);
            let comment = {id: lista.length,editorText:editorText,fecha: fecha}
            lista.push(comment);
            console.log(comment, 'guardando')
            localStorage.setItem('savedComments',JSON.stringify(lista));
        } else {    
            let firstComment = [{id:'0',editorText:editorText,fecha: fecha}]
            // console.log(firstComment, 'guardando0')
            localStorage.setItem('savedComments',JSON.stringify(firstComment));
        }
        console.log('eniviadooo')
        
        finish.classList.remove('d-none');
        document.querySelector('#prequestTextarea').value = '';
        document.querySelector('#prequestPreview').innerHTML = '';
        showComments();

    }
})

// funcion para editar comentario 
const editComment = (commentId, task) => {
    const commentHead = document.querySelector(`#${commentId} .c-prequest__head--comment`);
    const editorHead = document.querySelector(`#${commentId} .c-prequest__head--editor`);
    const preview = document.querySelector(`#${commentId} .c-preview`);
    const editorGroup = document.querySelector(`#${commentId} .c-editor-group`);

    if (task == 'open') {
        commentHead.classList.add('d-none')
        editorHead.classList.remove('d-none')
        preview.classList.add('d-none')
        editorGroup.classList.remove('d-none')
        tabPrequest(commentId,'editor');
    } else if(task == 'close') {
        commentHead.classList.remove('d-none')
        editorHead.classList.add('d-none')
        preview.classList.remove('d-none')
        editorGroup.classList.add('d-none')
    }
}

// zona de elemntos dinamicos  
container.addEventListener('click', function(event) {
    const targetElement = event.target;
    console.log(targetElement)

    // verificar si el evento se produjo en un botón de edición
    if (targetElement.classList.contains('editBtn')) {
        const commentId = targetElement.getAttribute('data-item');
        targetElement.parentNode.parentNode.removeAttribute('open');
        editComment(commentId, 'open');
        htmlToMarkdown(commentId);
        console.log('aqui')
    }

    if (targetElement.classList.contains('closeEditBtn')) {
        commentId = targetElement.getAttribute('data-item');
        editComment(commentId, 'close');
        showComments();
    }

    // save edit 
    if (targetElement.classList.contains('finishEditBtn')) {
        commentId = targetElement.getAttribute('data-item');
        editComment(commentId, 'close');

        let editorText = document.querySelector(`#${commentId}Textarea`);
        const savedComments = localStorage.getItem('savedComments');
            if (savedComments) {
                let lista = JSON.parse(savedComments);
                let index= commentId.replace("comment", "")
                lista[index].editorText = editorText.value;
                console.log(index, lista[index].id,'editado')
                localStorage.setItem('savedComments',JSON.stringify(lista));
            }
            showComments();
    }

    if (targetElement.classList.contains('deleteBtn')) {
        commentId = targetElement.getAttribute('data-item');
        const savedComments = localStorage.getItem('savedComments');
            if (savedComments) {
                let lista = JSON.parse(savedComments);
                let index= commentId.replace("comment", "")
                for(let i=0; i<lista.length;i++) {
                    if(index == lista[i].id) {
                        lista.splice(i, 1);
                    }
                }
                console.log(index,lista, 'listaaaaaaa borarrr')
                localStorage.setItem('savedComments',JSON.stringify(lista));
            }
            showComments();
    }

    if (targetElement.classList.contains('previewBtn')) {
        const id = targetElement.getAttribute('data-item');
        markdown(id);
        tabPrequest(id, 'preview');
    }

    if (targetElement.classList.contains('editorBtn')) {
        const id = targetElement.getAttribute('data-item');
        htmlToMarkdown(id);
        tabPrequest(id, 'editor');
    }

    if (targetElement.classList.contains('strongBtn')) {
        const id = targetElement.getAttribute('data-item');
        let selectedText = window.getSelection().toString();
        let commentInput = document.querySelector(`#${id}Textarea`);
    
        if (selectedText !== '') {
            let markdown = commentInput.value;
            let innerText = markdown.replace(selectedText, `**${selectedText}**`);
            commentInput.value = innerText;
        }
    }
});

// drag and drop para elementos dinamicos 
container.addEventListener('drop', async (e) => {
    e.preventDefault();
    const targetElement = e.target;
    console.log(targetElement,'target')

    const id = targetElement.getAttribute('data-item');
    const files = e.dataTransfer.files;
    console.log('aaaa');
    console.log(files,'files')

    if (files.length > 0) {
        const file = files[0];
        const imageUrl = await uploadImage(file);

        let textarea = document.querySelector(`#${id}Textarea`);
        textarea.value += `![${file.name}](${imageUrl})`;
    }
});

// editar para elementos fuera de la lista de dinamicos
editBtn.forEach(button => {
    button.addEventListener('click', (e)=> {
        e.target.parentNode.parentNode.removeAttribute('open');
        console.log(e.target);
        commentId = e.target.getAttribute('data-item');
        editComment(commentId, 'open');
        htmlToMarkdown(commentId);
    })
})

// boton merge  confetti y cambio de vista
merge.addEventListener('click', () => {
    localStorage.removeItem("savedComments");
    showComments();
    finish.classList.add('d-none');

    // confeti 
    const end = Date.now() + 3 * 1000;
    const colors = ["#bb0000", "#ffffff"];
    
    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 20,
            origin: { x: 0 },
            colors: colors,
        });
        
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 20,
            origin: { x: 1 },
            colors: colors,
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

    setTimeout(function() {
        // confetti.clear();
        success.classList.remove('d-none');
        proccess.classList.add('d-none');
    }, 3000);
})




