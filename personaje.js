const characterDetailDiv = document.getElementById('character-detail');

const params = new URLSearchParams(window.location.search);
const characterId = params.get('id');

const cargarDetalleCharacter = async () => {
    if (!characterId) {
        characterDetailDiv.innerHTML = `
            <p class="text-red-400 font-bold">
                No se encontró el ID del personaje.
            </p>
        `;
        return;
    }

    try {
        const response = await fetch(`https://akabab.github.io/starwars-api/api/id/${characterId}.json`);
        const character = await response.json();

        mostrarDetalleCharacter(character);
    } catch (error) {
        characterDetailDiv.innerHTML = `
            <p class="text-red-400 font-bold">
                Ocurrió un error al cargar la ficha del personaje.
            </p>
        `;

        console.log(error);
    }
}

const mostrarDetalleCharacter = (character) => {
    characterDetailDiv.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            <div class="flex justify-center">
                <img 
                    class="w-72 h-72 object-cover rounded-full border-4 border-yellow-400 shadow-2xl"
                    src="${character.image}"
                    alt="${character.name}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="text-left bg-slate-900 border border-slate-700 rounded-2xl p-6">

                <h2 class="text-3xl font-bold text-yellow-400 uppercase tracking-wide mb-4 text-center lg:text-left">
                    ${character.name}
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-200">

                    <p><span class="font-bold text-yellow-300">Altura:</span> ${mostrarDato(character.height)} m</p>

                    <p><span class="font-bold text-yellow-300">Peso:</span> ${mostrarDato(character.mass)} kg</p>

                    <p><span class="font-bold text-yellow-300">Género:</span> ${mostrarDato(character.gender)}</p>

                    <p><span class="font-bold text-yellow-300">Especie:</span> ${mostrarDato(character.species)}</p>

                    <p><span class="font-bold text-yellow-300">Planeta:</span> ${mostrarDato(character.homeworld)}</p>

                    <p><span class="font-bold text-yellow-300">Nacimiento:</span> ${mostrarDato(character.born)}</p>

                    <p><span class="font-bold text-yellow-300">Lugar de nacimiento:</span> ${mostrarDato(character.bornLocation)}</p>

                    <p><span class="font-bold text-yellow-300">Color de cabello:</span> ${mostrarDato(character.hairColor)}</p>

                    <p><span class="font-bold text-yellow-300">Color de ojos:</span> ${mostrarDato(character.eyeColor)}</p>

                    <p><span class="font-bold text-yellow-300">Color de piel:</span> ${mostrarDato(character.skinColor)}</p>
                </div>

                <div class="mt-6 text-center lg:text-left">
                    <a 
                        href="${character.wiki}" 
                        target="_blank"
                        class="inline-block bg-yellow-400 text-black font-bold px-5 py-2 rounded-xl hover:bg-yellow-300"
                    >
                        Ver más información
                    </a>
                </div>

            </div>

        </div>
    `;
}

const mostrarDato = (value) => {
    if (value === undefined || value === null || value === '') {
        return 'No disponible';
    }

    return value;
}

cargarDetalleCharacter();