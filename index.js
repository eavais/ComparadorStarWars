const characterListDiv = document.getElementById('character-list');
const selectedCharacter1Div = document.getElementById('selected-character-1');
const selectedCharacter2Div = document.getElementById('selected-character-2');
const compareBtn = document.getElementById('compare-btn');
const clearBtn = document.getElementById('clear-btn');
const comparisonSection = document.getElementById('comparison-section');
const comparisonResultDiv = document.getElementById('comparison-result');

let characters = [];
let selectedCharacters = [];

const cargarCharacters = async () => {
    const response = await fetch('https://akabab.github.io/starwars-api/api/all.json');
    const data = await response.json();

    characters = data;

    mostrarCharacters();
}

const mostrarCharacters = () => {
    characterListDiv.innerHTML = '';

    characters.forEach((character) => {
        const isSelected = selectedCharacters.some(selected => selected.id === character.id);
        const maxSelected = selectedCharacters.length === 2;

        characterListDiv.innerHTML += `
            <div class="bg-slate-900 border border-yellow-400 rounded-2xl shadow-md p-5 text-center hover:scale-105 hover:shadow-yellow-400/40 transition duration-300">
                
                <img 
                    class="w-32 h-32 object-cover rounded-full mx-auto border-2 border-yellow-400 mb-4"
                    src="${character.image}"
                    alt="${character.name}"
                    onerror="this.style.display='none'"
                >

                <h3 class="text-lg font-bold text-yellow-400 uppercase tracking-wide">
                    ${character.name}
                </h3>

                <p class="text-sm text-slate-300 mt-2">
                    ${character.species || 'Especie desconocida'}
                </p>

                <div class="flex flex-col gap-3 mt-4">
                    <button
                         onclick="verFichaCharacter(${character.id})"
                        class="px-4 py-2 rounded-xl font-bold shadow bg-slate-700 text-white hover:bg-slate-600 cursor-pointer"
                    >
                    Ver ficha
                    </button>

                    <button 
                        onclick="seleccionarCharacter(${character.id})"
                        class="px-4 py-2 rounded-xl font-bold shadow ${isSelected || maxSelected
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer'
                    }"
                        ${isSelected || maxSelected ? 'disabled' : ''}
                    >
                        ${isSelected ? 'Seleccionado' : 'Seleccionar'}
                    </button>
                </div>
            </div>
        `;
    });
}

const verFichaCharacter = (id) => {
    window.location.href = `personaje.html?id=${id}`;
}

const seleccionarCharacter = (id) => {
    const character = characters.find(character => character.id === id);

    const alreadySelected = selectedCharacters.some(selected => selected.id === id);

    if (alreadySelected) {
        alert('Este personaje ya fue seleccionado.');
        return;
    }

    if (selectedCharacters.length === 2) {
        alert('Solo puedes seleccionar 2 personajes para comparar.');
        return;
    }

    selectedCharacters.push(character);

    actualizarSeleccionados();
    mostrarCharacters();
}

const actualizarSeleccionados = () => {
    selectedCharacter1Div.innerHTML = generarTarjetaSeleccionada(selectedCharacters[0], 0);
    selectedCharacter2Div.innerHTML = generarTarjetaSeleccionada(selectedCharacters[1], 1);

    compareBtn.disabled = selectedCharacters.length !== 2;

    comparisonSection.classList.add('hidden');
    comparisonResultDiv.innerHTML = '';
}

const generarTarjetaSeleccionada = (character, position) => {
    if (!character) {
        return `
            <p class="text-slate-400">
                ${position === 0 ? 'Selecciona el primer personaje' : 'Selecciona el segundo personaje'}
            </p>
        `;
    }

    return `
        <div class="flex flex-col items-center">
            <img 
                class="w-36 h-36 object-cover rounded-full border-2 border-yellow-400 mb-4"
                src="${character.image}"
                alt="${character.name}"
                onerror="this.style.display='none'"
            >

            <h3 class="text-xl font-bold text-yellow-400 uppercase tracking-wide">
                ${character.name}
            </h3>

            <p class="text-sm text-slate-300 mt-2">
                Altura: ${mostrarDato(character.height)} m
            </p>

            <p class="text-sm text-slate-300">
                Peso: ${mostrarDato(character.mass)} kg
            </p>

            <button 
                onclick="quitarCharacter(${position})"
                class="mt-4 bg-red-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600"
            >
                Quitar
            </button>
        </div>
    `;
}

const quitarCharacter = (position) => {
    selectedCharacters.splice(position, 1);

    actualizarSeleccionados();
    mostrarCharacters();
}

const compararCharacters = () => {
    if (selectedCharacters.length !== 2) {
        alert('Debes seleccionar 2 personajes para comparar.');
        return;
    }

    const character1 = selectedCharacters[0];
    const character2 = selectedCharacters[1];

    const heightDifference = calcularDiferencia(character1.height, character2.height);
    const massDifference = calcularDiferencia(character1.mass, character2.mass);
    const bornDifference = calcularDiferencia(character1.born, character2.born);

    comparisonSection.classList.remove('hidden');

    comparisonResultDiv.innerHTML = `
        <table class="w-full border-collapse text-center">
            <thead>
                <tr class="bg-yellow-400 text-black">
                    <th class="border border-yellow-500 p-3">Dato</th>
                    <th class="border border-yellow-500 p-3">${character1.name}</th>
                    <th class="border border-yellow-500 p-3">${character2.name}</th>
                    <th class="border border-yellow-500 p-3">Comparación</th>
                </tr>
            </thead>

            <tbody class="text-slate-200">
                <tr class="bg-slate-900">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Altura</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.height)} m</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.height)} m</td>
                    <td class="border border-slate-700 p-3">${heightDifference}</td>
                </tr>

                <tr class="bg-slate-800">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Peso</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.mass)} kg</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.mass)} kg</td>
                    <td class="border border-slate-700 p-3">${massDifference}</td>
                </tr>

                <tr class="bg-slate-900">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Género</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.gender)}</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.gender)}</td>
                    <td class="border border-slate-700 p-3">${compararTexto(character1.gender, character2.gender)}</td>
                </tr>

                <tr class="bg-slate-800">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Color de cabello</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.hairColor)}</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.hairColor)}</td>
                    <td class="border border-slate-700 p-3">${compararTexto(character1.hairColor, character2.hairColor)}</td>
                </tr>

                <tr class="bg-slate-900">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Año de nacimiento</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.born)}</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.born)}</td>
                    <td class="border border-slate-700 p-3">${bornDifference}</td>
                </tr>

                <tr class="bg-slate-800">
                    <td class="border border-slate-700 p-3 font-bold text-yellow-300">Planeta</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character1.homeworld)}</td>
                    <td class="border border-slate-700 p-3">${mostrarDato(character2.homeworld)}</td>
                    <td class="border border-slate-700 p-3">${compararTexto(character1.homeworld, character2.homeworld)}</td>
                </tr>
            </tbody>
        </table>
    `;
}

const limpiarComparacion = () => {
    selectedCharacters = [];

    actualizarSeleccionados();
    mostrarCharacters();

    comparisonSection.classList.add('hidden');
    comparisonResultDiv.innerHTML = '';
}

const calcularDiferencia = (value1, value2) => {
    if (value1 === undefined || value2 === undefined || value1 === null || value2 === null) {
        return 'No se puede calcular';
    }

    if (isNaN(value1) || isNaN(value2)) {
        return 'No se puede calcular';
    }

    const difference = Math.abs(value1 - value2);

    if (difference === 0) {
        return 'No hay diferencia';
    }

    return `Diferencia: ${difference.toFixed(2)}`;
}

const compararTexto = (value1, value2) => {
    if (!value1 || !value2) {
        return 'Dato incompleto';
    }

    if (value1 === value2) {
        return 'Son iguales';
    }

    return 'Son diferentes';
}

const mostrarDato = (value) => {
    if (value === undefined || value === null || value === '') {
        return 'No disponible';
    }

    return value;
}

compareBtn.addEventListener('click', compararCharacters);
clearBtn.addEventListener('click', limpiarComparacion);

cargarCharacters();