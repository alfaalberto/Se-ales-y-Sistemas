import type { ContentBlockType, SectionType, ChapterType, TableOfContentsType } from './types';

export const placeholderContent = (title: string, id: string): ContentBlockType => ({
    id: `placeholder-${id}`,
    html: `
      <div class='space-y-4'>
        <h2 class='text-3xl font-bold text-primary border-b-2 border-border pb-2'>${id} ${title}</h2>
        <p class='text-lg'>El contenido para esta sección aún no está disponible.</p>
        <p>Este es un marcador de posición para la sección sobre <strong>${title}</strong>.</p>
      </div>
    `
});

export const initialTableOfContents: TableOfContentsType = [
  {
    chapter: "1",
    title: "SEÑALES Y SISTEMAS",
    sections: [
        { id: "1.0", title: "Introducción", content: [{ id: 'initial-1.0', html: `
            <div class='space-y-4'>
            <h2 class='text-3xl font-bold text-primary border-b-2 border-border pb-2'>1.0 Introducción</h2>
            <p class='text-lg'>Este capítulo introduce los conceptos fundamentales de señales y sistemas. Las señales son funciones de una o más variables independientes que contienen información sobre la naturaleza de un fenómeno físico.</p>
            <p>Los sistemas procesan señales de entrada para producir señales de salida. Exploraremos las propiedades básicas que caracterizan tanto a las señales como a los sistemas.</p>
            <p>Las fórmulas matemáticas se renderizarán usando MathJax. Por ejemplo, la señal sinusoidal en tiempo continuo:</p>
            <div class='bg-gray-800 p-4 rounded-lg my-4 text-center'>
                <p class='text-xl'>$$x(t) = A \\cos(\\omega_0 t + \\phi)$$</p>
            </div>
            <p>Navega a la sección 1.6 para ver un ejemplo de contenido interactivo.</p>
            </div>
        `}]},
        { 
            id: "1.1", title: "Señales continuas y discretas", content: [placeholderContent("Señales continuas y discretas", "1.1")],
            subsections: [
                { id: "1.1.1", title: "Ejemplos y representación matemática", content: [placeholderContent("Ejemplos y representación matemática", "1.1.1")] },
                { id: "1.1.2", title: "Señales de energía y de potencia", content: [placeholderContent("Señales de energía y de potencia", "1.1.2")] },
            ]
        },
        { 
            id: "1.2", title: "Transformaciones de la variable independiente", content: [placeholderContent("Transformaciones de la variable independiente", "1.2")],
            subsections: [
                { id: "1.2.1", title: "Ejemplos de transformaciones de la variable independiente", content: [placeholderContent("Ejemplos de transformaciones de la variable independiente", "1.2.1")] },
                { id: "1.2.2", title: "Señales periódicas", content: [placeholderContent("Señales periódicas", "1.2.2")] },
                { id: "1.2.3", title: "Señales par e impar", content: [placeholderContent("Señales par e impar", "1.2.3")] },
            ]
        },
        { 
            id: "1.3", title: "Señales exponenciales y senoidales", content: [placeholderContent("Señales exponenciales y senoidales", "1.3")],
            subsections: [
                { id: "1.3.1", title: "Señales continuas exponencial compleja y senoidal", content: [placeholderContent("Señales continuas exponencial compleja y senoidal", "1.3.1")] },
                { id: "1.3.2", title: "Señales discretas exponencial compleja y senoidal", content: [placeholderContent("Señales discretas exponencial compleja y senoidal", "1.3.2")] },
                { id: "1.3.3", title: "Propiedades de periodicidad de exponenciales discretas", content: [placeholderContent("Propiedades de periodicidad de exponenciales discretas", "1.3.3")] },
            ]
        },
        { 
            id: "1.4", title: "Las funciones impulso unitario y escalón unitario", content: [placeholderContent("Las funciones impulso unitario y escalón unitario", "1.4")],
            subsections: [
                { id: "1.4.1", title: "Las secuencias discretas impulso unitario y escalón unitario", content: [placeholderContent("Las secuencias discretas impulso unitario y escalón unitario", "1.4.1")] },
                { id: "1.4.2", title: "Las funciones continuas escalón unitario e impulso unitario", content: [placeholderContent("Las funciones continuas escalón unitario e impulso unitario", "1.4.2")] },
            ]
        },
        { 
            id: "1.5", title: "Sistemas continuos y discretos", content: [placeholderContent("Sistemas continuos y discretos", "1.5")],
            subsections: [
                { id: "1.5.1", title: "Ejemplos sencillos de sistemas", content: [placeholderContent("Ejemplos sencillos de sistemas", "1.5.1")] },
                { id: "1.5.2", title: "Interconexiones de sistemas", content: [placeholderContent("Interconexiones de sistemas", "1.5.2")] },
            ]
        },
        { 
            id: "1.6", title: "Propiedades básicas de los sistemas", content: [{ id: 'initial-1.6', html: `<div class='space-y-4'><h2 class='text-3xl font-bold text-primary border-b-2 border-border pb-2'>1.6 Propiedades básicas de los sistemas</h2><p>Esta sección cubre las propiedades fundamentales de los sistemas.</p><div class="bg-gray-800 p-4 rounded-lg my-4"><canvas id="myChart"></canvas></div><script>if(window.Chart){const ctx=document.getElementById('myChart');if(ctx){const existingChart=Chart.getChart(ctx);if(existingChart){existingChart.destroy()}new Chart(ctx,{type:'line',data:{labels:['Memoria','Invertibilidad','Causalidad','Estabilidad','Linealidad'],datasets:[{label:'Complejidad del Concepto',data:[3,4,2,5,5],borderColor:'rgb(107,114,128)',backgroundColor:'rgba(107,114,128,0.2)'}]}})}}</script></div>` }],
            subsections: [
                { id: "1.6.1", title: "Sistemas con y sin memoria", content: [placeholderContent("Sistemas con y sin memoria", "1.6.1")] },
                { id: "1.6.2", title: "Invertibilidad y sistemas inversos", content: [placeholderContent("Invertibilidad y sistemas inversos", "1.6.2")] },
                { id: "1.6.3", title: "Causalidad", content: [placeholderContent("Causalidad", "1.6.3")] },
                { id: "1.6.4", title: "Estabilidad", content: [placeholderContent("Estabilidad", "1.6.4")] },
                { id: "1.6.5", title: "Invariancia en el tiempo", content: [placeholderContent("Invariancia en el tiempo", "1.6.5")] },
                { id: "1.6.6", title: "Linealidad", content: [placeholderContent("Linealidad", "1.6.6")] },
            ]
        },
        { id: "1.7", title: "Resumen", content: [placeholderContent("Resumen", "1.7")] },
        { id: "1.8", title: "Problemas", content: [placeholderContent("Problemas", "1.8")] },
    ]
  },
  { chapter: "2", title: "SISTEMAS LINEALES INVARIANTES EN EL TIEMPO", sections: [
        { id: "2.0", title: "Introducción", content: [placeholderContent("Introducción", "2.0")] },
        { 
            id: "2.1", title: "Sistemas LTI discretos: La suma de convolución", content: [placeholderContent("Sistemas LTI discretos: La suma de convolución", "2.1")],
            subsections: [
                { id: "2.1.1", title: "La representación de señales discretas en términos de los impulsos", content: [placeholderContent("La representación de señales discretas en términos de los impulsos", "2.1.1")] },
                { id: "2.1.2", title: "La respuesta al impulso unitario discreto y la representación de la suma de convolución de sistemas LTI", content: [placeholderContent("La respuesta al impulso unitario discreto y la representación de la suma de convolución de sistemas LTI", "2.1.2")] },
            ]
        },
        { 
            id: "2.2", title: "Sistemas LTI continuos: La integral de convolución", content: [placeholderContent("Sistemas LTI continuos: La integral de convolución", "2.2")],
            subsections: [
                { id: "2.2.1", title: "La representación de señales continuas en términos de los impulsos", content: [placeholderContent("La representación de señales continuas en términos de los impulsos", "2.2.1")] },
                { id: "2.2.2", title: "La respuesta al impulso unitario continuo y la representación de la integral de convolución de sistemas LTI", content: [placeholderContent("La respuesta al impulso unitario continuo y la representación de la integral de convolución de sistemas LTI", "2.2.2")] },
            ]
        },
        { 
            id: "2.3", title: "Propiedades de los sistemas lineales e invariantes en el tiempo", content: [placeholderContent("Propiedades de los sistemas lineales e invariantes en el tiempo", "2.3")],
            subsections: [
                { id: "2.3.1", title: "Propiedad conmutativa", content: [placeholderContent("Propiedad conmutativa", "2.3.1")] },
                { id: "2.3.2", title: "Propiedad distributiva", content: [placeholderContent("Propiedad distributiva", "2.3.2")] },
                { id: "2.3.3", title: "Propiedad asociativa", content: [placeholderContent("Propiedad asociativa", "2.3.3")] },
                { id: "2.3.4", title: "Sistemas LTI con y sin memoria", content: [placeholderContent("Sistemas LTI con y sin memoria", "2.3.4")] },
                { id: "2.3.5", title: "Invertibilidad de sistemas LTI", content: [placeholderContent("Invertibilidad de sistemas LTI", "2.3.5")] },
                { id: "2.3.6", title: "Causalidad para los sistemas LTI", content: [placeholderContent("Causalidad para los sistemas LTI", "2.3.6")] },
                { id: "2.3.7", title: "Estabilidad para los sistemas LTI", content: [placeholderContent("Estabilidad para los sistemas LTI", "2.3.7")] },
                { id: "2.3.8", title: "Respuesta al escalón unitario de un sistema LTI", content: [placeholderContent("Respuesta al escalón unitario de un sistema LTI", "2.3.8")] },
            ]
        },
        { 
            id: "2.4", title: "Sistemas LTI causales descritos por ecuaciones diferenciales y de diferencias", content: [placeholderContent("Sistemas LTI causales descritos por ecuaciones diferenciales y de diferencias", "2.4")],
            subsections: [
                { id: "2.4.1", title: "Ecuaciones diferenciales lineales con coeficientes constantes", content: [placeholderContent("Ecuaciones diferenciales lineales con coeficientes constantes", "2.4.1")] },
                { id: "2.4.2", title: "Ecuaciones de diferencias lineales con coeficientes constantes", content: [placeholderContent("Ecuaciones de diferencias lineales con coeficientes constantes", "2.4.2")] },
                { id: "2.4.3", title: "Representación en diagrama de bloques de sistemas de primer orden", content: [placeholderContent("Representación en diagrama de bloques de sistemas de primer orden", "2.4.3")] },
            ]
        },
        { 
            id: "2.5", title: "Funciones singulares", content: [placeholderContent("Funciones singulares", "2.5")],
            subsections: [
                { id: "2.5.1", title: "El impulso unitario como un pulso corto idealizado", content: [placeholderContent("El impulso unitario como un pulso corto idealizado", "2.5.1")] },
                { id: "2.5.2", title: "Definición del impulso unitario mediante la convolución", content: [placeholderContent("Definición del impulso unitario mediante la convolución", "2.5.2")] },
                { id: "2.5.3", title: "Dobletes unitarios y otras funciones singulares", content: [placeholderContent("Dobletes unitarios y otras funciones singulares", "2.5.3")] },
            ]
        },
        { id: "2.6", title: "Resumen", content: [placeholderContent("Resumen", "2.6")] },
        { id: "2.7", title: "Problemas", content: [placeholderContent("Problemas", "2.7")] },
  ]},
  { chapter: "3", title: "REPRESENTACIÓN DE SEÑALES PERIÓDICAS EN SERIES DE FOURIER", sections: [
        { id: "3.0", title: "Introducción", content: [placeholderContent("Introducción", "3.0")] },
        { id: "3.1", title: "Una perspectiva histórica", content: [placeholderContent("Una perspectiva histórica", "3.1")] },
        { id: "3.2", title: "La respuesta de sistemas LTI a exponenciales complejas", content: [placeholderContent("La respuesta de sistemas LTI a exponenciales complejas", "3.2")] },
        { 
            id: "3.3", title: "Representación en serie de Fourier de señales periódicas continuas", content: [placeholderContent("Representación en serie de Fourier de señales periódicas continuas", "3.3")],
            subsections: [
                { id: "3.3.1", title: "Combinaciones lineales de exponenciales complejas relacionadas armónicamente", content: [placeholderContent("Combinaciones lineales de exponenciales complejas relacionadas armónicamente", "3.3.1")] },
                { id: "3.3.2", title: "Determinación de la representación en serie de Fourier de una señal periódica continua", content: [placeholderContent("Determinación de la representación en serie de Fourier de una señal periódica continua", "3.3.2")] },
            ]
        },
        { id: "3.4", title: "Convergencia de las series de Fourier", content: [placeholderContent("Convergencia de las series de Fourier", "3.4")] },
        { 
            id: "3.5", title: "Propiedades de la serie continua de Fourier", content: [placeholderContent("Propiedades de la serie continua de Fourier", "3.5")],
            subsections: [
                { id: "3.5.1", title: "Linealidad", content: [placeholderContent("Linealidad", "3.5.1")] },
                { id: "3.5.2", title: "Desplazamiento de tiempo", content: [placeholderContent("Desplazamiento de tiempo", "3.5.2")] },
                { id: "3.5.3", title: "Inversión de tiempo", content: [placeholderContent("Inversión de tiempo", "3.5.3")] },
                { id: "3.5.4", title: "Escalamiento de tiempo", content: [placeholderContent("Escalamiento de tiempo", "3.5.4")] },
                { id: "3.5.5", title: "Multiplicación", content: [placeholderContent("Multiplicación", "3.5.5")] },
                { id: "3.5.6", title: "Conjugación y simetría conjugada", content: [placeholderContent("Conjugación y simetría conjugada", "3.5.6")] },
                { id: "3.5.7", title: "Relación de Parseval para señales periódicas continuas", content: [placeholderContent("Relación de Parseval para señales periódicas continuas", "3.5.7")] },
                { id: "3.5.8", title: "Resumen de las propiedades de la serie continua de Fourier", content: [placeholderContent("Resumen de las propiedades de la serie continua de Fourier", "3.5.8")] },
                { id: "3.5.9", title: "Ejemplos", content: [placeholderContent("Ejemplos", "3.5.9")] },
            ]
        },
        { 
            id: "3.6", title: "Representación en series de Fourier de señales periódicas discretas", content: [placeholderContent("Representación en series de Fourier de señales periódicas discretas", "3.6")],
            subsections: [
                { id: "3.6.1", title: "Combinaciones lineales de exponenciales complejas relacionadas armónicamente", content: [placeholderContent("Combinaciones lineales de exponenciales complejas relacionadas armónicamente", "3.6.1")] },
                { id: "3.6.2", title: "Determinación de la representación en series de Fourier de una señal periódica", content: [placeholderContent("Determinación de la representación en series de Fourier de una señal periódica", "3.6.2")] },
            ]
        },
        { 
            id: "3.7", title: "Propiedades de la serie discreta de Fourier", content: [placeholderContent("Propiedades de la serie discreta de Fourier", "3.7")],
            subsections: [
                { id: "3.7.1", title: "Multiplicación", content: [placeholderContent("Multiplicación", "3.7.1")] },
                { id: "3.7.2", title: "Primera diferencia", content: [placeholderContent("Primera diferencia", "3.7.2")] },
                { id: "3.7.3", title: "Relación de Parseval para señales periódicas discretas", content: [placeholderContent("Relación de Parseval para señales periódicas discretas", "3.7.3")] },
                { id: "3.7.4", title: "Ejemplos", content: [placeholderContent("Ejemplos", "3.7.4")] },
            ]
        },
        { id: "3.8", title: "Serie de Fourier y sistemas LTI", content: [placeholderContent("Serie de Fourier y sistemas LTI", "3.8")] },
        { 
            id: "3.9", title: "Filtrado", content: [placeholderContent("Filtrado", "3.9")],
            subsections: [
                { id: "3.9.1", title: "Filtros conformadores de frecuencia", content: [placeholderContent("Filtros conformadores de frecuencia", "3.9.1")] },
                { id: "3.9.2", title: "Filtros selectivos en frecuencia", content: [placeholderContent("Filtros selectivos en frecuencia", "3.9.2")] },
            ]
        },
        { 
            id: "3.10", title: "Ejemplos de filtros continuos descritos mediante ecuaciones diferenciales", content: [placeholderContent("Ejemplos de filtros continuos descritos mediante ecuaciones diferenciales", "3.10")],
            subsections: [
                { id: "3.10.1", title: "Un filtro paso bajas RC sencillo", content: [placeholderContent("Un filtro paso bajas RC sencillo", "3.10.1")] },
                { id: "3.10.2", title: "Un filtro paso altas RC sencillo", content: [placeholderContent("Un filtro paso altas RC sencillo", "3.10.2")] },
            ]
        },
        { 
            id: "3.11", title: "Ejemplos de filtros discretos descritos mediante ecuaciones de diferencias", content: [placeholderContent("Ejemplos de filtros discretos descritos mediante ecuaciones de diferencias", "3.11")],
            subsections: [
                { id: "3.11.1", title: "Filtros recursivos discretos de primer orden", content: [placeholderContent("Filtros recursivos discretos de primer orden", "3.11.1")] },
                { id: "3.11.2", title: "Filtros no recursivos discretos", content: [placeholderContent("Filtros no recursivos discretos", "3.11.2")] },
            ]
        },
        { id: "3.12", title: "Resumen", content: [placeholderContent("Resumen", "3.12")] },
        { id: "3.13", title: "Problemas", content: [placeholderContent("Problemas", "3.13")] },
  ]},
  { chapter: "4", title: "LA TRANSFORMADA CONTINUA DE FOURIER", sections: [
        { id: "4.0", title: "Introducción", content: [placeholderContent("Introducción", "4.0")] },
        { 
            id: "4.1", title: "Representación de señales aperiódicas: La transformada continua de Fourier", content: [placeholderContent("Representación de señales aperiódicas: La transformada continua de Fourier", "4.1")],
            subsections: [
                { id: "4.1.1", title: "Desarrollo de la representación de la transformada de Fourier de una señal aperiódica", content: [placeholderContent("Desarrollo de la representación de la transformada de Fourier de una señal aperiódica", "4.1.1")] },
                { id: "4.1.2", title: "Convergencia de las transformadas de Fourier", content: [placeholderContent("Convergencia de las transformadas de Fourier", "4.1.2")] },
                { id: "4.1.3", title: "Ejemplos de transformadas continuas de Fourier", content: [placeholderContent("Ejemplos de transformadas continuas de Fourier", "4.1.3")] },
            ]
        },
        { id: "4.2", title: "La transformada de Fourier para señales periódicas", content: [placeholderContent("La transformada de Fourier para señales periódicas", "4.2")] },
        { 
            id: "4.3", title: "Propiedades de la transformada continua de Fourier", content: [placeholderContent("Propiedades de la transformada continua de Fourier", "4.3")],
            subsections: [
                { id: "4.3.1", title: "Linealidad", content: [placeholderContent("Linealidad", "4.3.1")] },
                { id: "4.3.2", title: "Desplazamiento de tiempo", content: [placeholderContent("Desplazamiento de tiempo", "4.3.2")] },
                { id: "4.3.3", title: "Conjugación y simetría conjugada", content: [placeholderContent("Conjugación y simetría conjugada", "4.3.3")] },
                { id: "4.3.4", title: "Diferenciación e integración", content: [placeholderContent("Diferenciación e integración", "4.3.4")] },
                { id: "4.3.5", title: "Dualidad", content: [placeholderContent("Dualidad", "4.3.5")] },
                { id: "4.3.6", title: "Escalamiento de tiempo y de frecuencia", content: [placeholderContent("Escalamiento de tiempo y de frecuencia", "4.3.6")] },
                { id: "4.3.7", title: "Relación de Parseval", content: [placeholderContent("Relación de Parseval", "4.3.7")] },
            ]
        },
        { 
            id: "4.4", title: "La propiedad de convolución", content: [placeholderContent("La propiedad de convolución", "4.4")],
            subsections: [
                { id: "4.4.1", title: "Ejemplos", content: [placeholderContent("Ejemplos", "4.4.1")] },
            ]
        },
        { 
            id: "4.5", title: "La propiedad de multiplicación", content: [placeholderContent("La propiedad de multiplicación", "4.5")],
            subsections: [
                { id: "4.5.1", title: "Filtrado selectivo en frecuencia con frecuencia central variable", content: [placeholderContent("Filtrado selectivo en frecuencia con frecuencia central variable", "4.5.1")] },
            ]
        },
        { id: "4.6", title: "Tablas de las propiedades de la transformada de Fourier y de los pares básicos", content: [placeholderContent("Tablas de las propiedades de la transformada de Fourier y de los pares básicos", "4.6")] },
        { id: "4.7", title: "Sistemas caracterizados por ecuaciones diferenciales lineales con coeficientes constantes", content: [placeholderContent("Sistemas caracterizados por ecuaciones diferenciales lineales con coeficientes constantes", "4.7")] },
        { id: "4.8", title: "Resumen", content: [placeholderContent("Resumen", "4.8")] },
        { id: "4.9", title: "Problemas", content: [placeholderContent("Problemas", "4.9")] },
  ]},
  { chapter: "5", title: "LA TRANSFORMADA DE FOURIER DE TIEMPO DISCRETO", sections: [
        { id: "5.0", title: "Introducción", content: [placeholderContent("Introducción", "5.0")] },
        { 
            id: "5.1", title: "Representación de señales aperiódicas: La transformada de Fourier de tiempo discreto", content: [placeholderContent("Representación de señales aperiódicas: La transformada de Fourier de tiempo discreto", "5.1")],
            subsections: [
                { id: "5.1.1", title: "Desarrollo de la transformada de Fourier de tiempo discreto", content: [placeholderContent("Desarrollo de la transformada de Fourier de tiempo discreto", "5.1.1")] },
                { id: "5.1.2", title: "Ejemplos de transformadas de Fourier de tiempo discreto", content: [placeholderContent("Ejemplos de transformadas de Fourier de tiempo discreto", "5.1.2")] },
                { id: "5.1.3", title: "Problemas de la convergencia asociados con la transformada de Fourier de tiempo discreto", content: [placeholderContent("Problemas de la convergencia asociados con la transformada de Fourier de tiempo discreto", "5.1.3")] },
            ]
        },
        { id: "5.2", title: "La transformada de Fourier para señales periódicas", content: [placeholderContent("La transformada de Fourier para señales periódicas", "5.2")] },
        { 
            id: "5.3", title: "Propiedades de la transformada de Fourier de tiempo discreto", content: [placeholderContent("Propiedades de la transformada de Fourier de tiempo discreto", "5.3")],
            subsections: [
                { id: "5.3.1", title: "Periodicidad de la transformada de Fourier de tiempo discreto", content: [placeholderContent("Periodicidad de la transformada de Fourier de tiempo discreto", "5.3.1")] },
                { id: "5.3.2", title: "Linealidad de la transformada de Fourier", content: [placeholderContent("Linealidad de la transformada de Fourier", "5.3.2")] },
                { id: "5.3.3", title: "Desplazamiento de tiempo y desplazamiento de frecuencia", content: [placeholderContent("Desplazamiento de tiempo y desplazamiento de frecuencia", "5.3.3")] },
                { id: "5.3.4", title: "Conjugación y simetría conjugada", content: [placeholderContent("Conjugación y simetría conjugada", "5.3.4")] },
                { id: "5.3.5", title: "Diferenciación en frecuencia", content: [placeholderContent("Diferenciación en frecuencia", "5.3.5")] },
                { id: "5.3.6", title: "Inversión en tiempo", content: [placeholderContent("Inversión en tiempo", "5.3.6")] },
                { id: "5.3.7", title: "Expansión en tiempo", content: [placeholderContent("Expansión en tiempo", "5.3.7")] },
                { id: "5.3.9", title: "La relación de Parseval", content: [placeholderContent("La relación de Parseval", "5.3.9")] },
            ]
        },
        { 
            id: "5.4", title: "La propiedad de convolución", content: [placeholderContent("La propiedad de convolución", "5.4")],
            subsections: [
                { id: "5.4.1", title: "Ejemplos", content: [placeholderContent("Ejemplos", "5.4.1")] },
            ]
        },
        { id: "5.5", title: "La propiedad de multiplicación", content: [placeholderContent("La propiedad de multiplicación", "5.5")] },
        { id: "5.6", title: "Tablas de las propiedades de la transformada de Fourier y pares básicos", content: [placeholderContent("Tablas de las propiedades de la transformada de Fourier y pares básicos", "5.6")] },
        { 
            id: "5.7", title: "Dualidad", content: [placeholderContent("Dualidad", "5.7")],
            subsections: [
                { id: "5.7.1", title: "Dualidad en la serie discreta de Fourier", content: [placeholderContent("Dualidad en la serie discreta de Fourier", "5.7.1")] },
                { id: "5.7.2", title: "Dualidad entre la transformada de Fourier de tiempo discreto y la serie continua de Fourier", content: [placeholderContent("Dualidad entre la transformada de Fourier de tiempo discreto y la serie continua de Fourier", "5.7.2")] },
            ]
        },
        { id: "5.8", title: "Sistemas caracterizados por ecuaciones en diferencias lineales con coeficientes constantes", content: [placeholderContent("Sistemas caracterizados por ecuaciones en diferencias lineales con coeficientes constantes", "5.8")] },
        { id: "5.9", title: "Resumen", content: [placeholderContent("Resumen", "5.9")] },
        { id: "5.10", title: "Problemas", content: [placeholderContent("Problemas", "5.10")] },
  ]},
  { chapter: "6", title: "CARACTERIZACIÓN EN TIEMPO Y FRECUENCIA DE SEÑALES Y SISTEMAS", sections: [
        { id: "6.0", title: "Introducción", content: [placeholderContent("Introducción", "6.0")]},
        { id: "6.1", title: "Representación de la magnitud-fase de la transformada de Fourier", content: [placeholderContent("Representación de la magnitud-fase de la transformada de Fourier", "6.1")]},
        { 
            id: "6.2", title: "Representación de la magnitud-fase de la respuesta en frecuencia de sistemas LTI", content: [placeholderContent("Representación de la magnitud-fase de la respuesta en frecuencia de sistemas LTI", "6.2")],
            subsections: [
                { id: "6.2.1", title: "Fase lineal y no lineal", content: [placeholderContent("Fase lineal y no lineal", "6.2.1")]},
                { id: "6.2.2", title: "Retardo de grupo", content: [placeholderContent("Retardo de grupo", "6.2.2")]},
                { id: "6.2.3", title: "Magnitud logarítmica y diagramas de Bode", content: [placeholderContent("Magnitud logarítmica y diagramas de Bode", "6.2.3")]},
            ]
        },
        { id: "6.3", title: "Propiedades en el dominio del tiempo de filtros ideales", content: [placeholderContent("Propiedades en el dominio del tiempo de filtros ideales", "6.3")]},
        { id: "6.4", title: "Aspectos en el dominio del tiempo y en el dominio de la frecuencia de los filtros no ideales", content: [placeholderContent("Aspectos en el dominio del tiempo y en el dominio de la frecuencia de los filtros no ideales", "6.4")]},
        { 
            id: "6.5", title: "Sistemas continuos de primer y segundo órdenes", content: [placeholderContent("Sistemas continuos de primer y segundo órdenes", "6.5")],
            subsections: [
                { id: "6.5.1", title: "Sistemas continuos de primer orden", content: [placeholderContent("Sistemas continuos de primer orden", "6.5.1")]},
                { id: "6.5.2", title: "Sistemas continuos de segundo orden", content: [placeholderContent("Sistemas continuos de segundo orden", "6.5.2")]},
                { id: "6.5.3", title: "Diagramas de Bode para respuestas en frecuencia racionales", content: [placeholderContent("Diagramas de Bode para respuestas en frecuencia racionales", "6.5.3")]},
            ]
        },
        { 
            id: "6.6", title: "Sistemas discretos de primer y segundo órdenes", content: [placeholderContent("Sistemas discretos de primer y segundo órdenes", "6.6")],
            subsections: [
                { id: "6.6.1", title: "Sistemas discretos de primer orden", content: [placeholderContent("Sistemas discretos de primer orden", "6.6.1")]},
                { id: "6.6.2", title: "Sistemas discretos de segundo orden", content: [placeholderContent("Sistemas discretos de segundo orden", "6.6.2")]},
            ]
        },
        { 
            id: "6.7", title: "Ejemplos de análisis de sistemas en el dominio del tiempo y de la frecuencia", content: [placeholderContent("Ejemplos de análisis de sistemas en el dominio del tiempo y de la frecuencia", "6.7")],
            subsections: [
                { id: "6.7.1", title: "Análisis de un sistema de suspensión para automóvil", content: [placeholderContent("Análisis de un sistema de suspensión para automóvil", "6.7.1")]},
                { id: "6.7.2", title: "Ejemplos de filtros discretos no recursivos", content: [placeholderContent("Ejemplos de filtros discretos no recursivos", "6.7.2")]},
            ]
        },
        { id: "6.8", title: "Resumen", content: [placeholderContent("Resumen", "6.8")]},
        { id: "6.9", title: "Problemas", content: [placeholderContent("Problemas", "6.9")]},
  ]},
  { chapter: "7", title: "MUESTREO", sections: [
        { id: "7.0", title: "Introducción", content: [placeholderContent("Introducción", "7.0")]},
        { 
            id: "7.1", title: "Representación de una señal continua mediante sus muestras: El teorema de muestreo", content: [placeholderContent("Representación de una señal continua mediante sus muestras: El teorema de muestreo", "7.1")],
            subsections: [
                { id: "7.1.1", title: "Muestreo con tren de impulsos", content: [placeholderContent("Muestreo con tren de impulsos", "7.1.1")]},
                { id: "7.1.2", title: "Muestreo con un retenedor de orden cero", content: [placeholderContent("Muestreo con un retenedor de orden cero", "7.1.2")]},
            ]
        },
        { id: "7.2", title: "Reconstrucción de una señal a partir de sus muestras usando la interpolación", content: [placeholderContent("Reconstrucción de una señal a partir de sus muestras usando la interpolación", "7.2")]},
        { id: "7.3", title: "El efecto del submuestreo: Traslape", content: [placeholderContent("El efecto del submuestreo: Traslape", "7.3")]},
        { 
            id: "7.4", title: "Procesamiento discreto de señales continuas", content: [placeholderContent("Procesamiento discreto de señales continuas", "7.4")],
            subsections: [
                { id: "7.4.1", title: "Diferenciador digital", content: [placeholderContent("Diferenciador digital", "7.4.1")]},
                { id: "7.4.2", title: "Retardo de media muestra", content: [placeholderContent("Retardo de media muestra", "7.4.2")]},
            ]
        },
        { 
            id: "7.5", title: "Muestreo de señales discretas", content: [placeholderContent("Muestreo de señales discretas", "7.5")],
            subsections: [
                { id: "7.5.1", title: "Muestreo con tren de impulsos", content: [placeholderContent("Muestreo con tren de impulsos", "7.5.1")]},
            ]
        },
        { id: "7.6", title: "Decimación en tiempo discreto e interpolación", content: [placeholderContent("Decimación en tiempo discreto e interpolación", "7.6")]},
        { id: "7.7", title: "Resumen", content: [placeholderContent("Resumen", "7.7")]},
        { id: "7.8", title: "Problemas", content: [placeholderContent("Problemas", "7.8")]},
  ]},
  { chapter: "8", title: "SISTEMAS DE COMUNICACIÓN", sections: [
        { id: "8.0", title: "Introducción", content: [placeholderContent("Introducción", "8.0")]},
        { 
            id: "8.1", title: "Modulación de amplitud con exponencial compleja y senoidal", content: [placeholderContent("Modulación de amplitud con exponencial compleja y senoidal", "8.1")],
            subsections: [
                { id: "8.1.1", title: "Modulación de amplitud con una portadora exponencial compleja", content: [placeholderContent("Modulación de amplitud con una portadora exponencial compleja", "8.1.1")]},
                { id: "8.1.2", title: "Modulación de amplitud con una portadora senoidal", content: [placeholderContent("Modulación de amplitud con una portadora senoidal", "8.1.2")]},
            ]
        },
        { 
            id: "8.2", title: "Demodulación para AM senoidal", content: [placeholderContent("Demodulación para AM senoidal", "8.2")],
            subsections: [
                { id: "8.2.1", title: "Demodulación síncrona", content: [placeholderContent("Demodulación síncrona", "8.2.1")]},
                { id: "8.2.2", title: "Demodulación asíncrona", content: [placeholderContent("Demodulación asíncrona", "8.2.2")]},
            ]
        },
        { id: "8.3", title: "Multiplexaje por división de frecuencia", content: [placeholderContent("Multiplexaje por división de frecuencia", "8.3")]},
        { id: "8.4", title: "Modulación de amplitud lateral de banda lateral única", content: [placeholderContent("Modulación de amplitud lateral de banda lateral única", "8.4")]},
        { 
            id: "8.5", title: "Modulación de amplitud con una portadora de tren de pulsos", content: [placeholderContent("Modulación de amplitud con una portadora de tren de pulsos", "8.5")],
            subsections: [
                { id: "8.5.1", title: "Modulación de una portadora de tren de pulsos", content: [placeholderContent("Modulación de una portadora de tren de pulsos", "8.5.1")]},
                { id: "8.5.2", title: "Multiplexaje por división de tiempo", content: [placeholderContent("Multiplexaje por división de tiempo", "8.5.2")]},
            ]
        },
        { 
            id: "8.6", title: "Modulación de amplitud de pulsos", content: [placeholderContent("Modulación de amplitud de pulsos", "8.6")],
            subsections: [
                { id: "8.6.1", title: "Señales moduladas por amplitud de pulsos", content: [placeholderContent("Señales moduladas por amplitud de pulsos", "8.6.1")]},
                { id: "8.6.2", title: "Interferencia intersímbolo en sistemas PAM", content: [placeholderContent("Interferencia intersímbolo en sistemas PAM", "8.6.2")]},
                { id: "8.6.3", title: "Modulación digital por amplitud de pulsos y por codificación de pulsos", content: [placeholderContent("Modulación digital por amplitud de pulsos y por codificación de pulsos", "8.6.3")]},
            ]
        },
        { 
            id: "8.7", title: "Modulación de frecuencia senoidal", content: [placeholderContent("Modulación de frecuencia senoidal", "8.7")],
            subsections: [
                { id: "8.7.1", title: "Modulación de frecuencia de banda angosta", content: [placeholderContent("Modulación de frecuencia de banda angosta", "8.7.1")]},
                { id: "8.7.2", title: "Modulación de frecuencia de banda ancha", content: [placeholderContent("Modulación de frecuencia de banda ancha", "8.7.2")]},
                { id: "8.7.3", title: "Señal moduladora de onda cuadrada periódica", content: [placeholderContent("Señal moduladora de onda cuadrada periódica", "8.7.3")]},
            ]
        },
        { 
            id: "8.8", title: "Modulación discreta", content: [placeholderContent("Modulación discreta", "8.8")],
            subsections: [
                { id: "8.8.1", title: "Modulación de amplitud senoidal discreta", content: [placeholderContent("Modulación de amplitud senoidal discreta", "8.8.1")]},
                { id: "8.8.2", title: "Transmodulación de tiempo discreto", content: [placeholderContent("Transmodulación de tiempo discreto", "8.8.2")]},
            ]
        },
        { id: "8.9", title: "Resumen", content: [placeholderContent("Resumen", "8.9")]},
        { id: "8.10", title: "Problemas", content: [placeholderContent("Problemas", "8.10")]},
  ]},
  { chapter: "9", title: "LA TRANSFORMADA DE LAPLACE", sections: [
        { id: "9.0", title: "Introducción", content: [placeholderContent("Introducción", "9.0")] },
        { id: "9.1", title: "La transformada de Laplace", content: [placeholderContent("La transformada de Laplace", "9.1")] },
        { id: "9.2", title: "La región de convergencia para las transformadas de Laplace", content: [placeholderContent("La región de convergencia para las transformadas de Laplace", "9.2")] },
        { id: "9.3", title: "La transformada inversa de Laplace", content: [placeholderContent("La transformada inversa de Laplace", "9.3")] },
        { 
            id: "9.4", title: "Evaluación geométrica de la transformada de Fourier a partir del diagrama de polos y ceros", content: [placeholderContent("Evaluación geométrica de la transformada de Fourier a partir del diagrama de polos y ceros", "9.4")],
            subsections: [
                { id: "9.4.1", title: "Sistemas de primer orden", content: [placeholderContent("Sistemas de primer orden", "9.4.1")] },
                { id: "9.4.2", title: "Sistemas de segundo orden", content: [placeholderContent("Sistemas de segundo orden", "9.4.2")] },
                { id: "9.4.3", title: "Sistemas paso todo", content: [placeholderContent("Sistemas paso todo", "9.4.3")] },
            ]
        },
        { 
            id: "9.5", title: "Propiedades de la transformada de Laplace", content: [placeholderContent("Propiedades de la transformada de Laplace", "9.5")],
            subsections: [
                { id: "9.5.1", title: "Linealidad de la transformada de Laplace", content: [placeholderContent("Linealidad de la transformada de Laplace", "9.5.1")] },
                { id: "9.5.2", title: "Desplazamiento en el tiempo", content: [placeholderContent("Desplazamiento en el tiempo", "9.5.2")] },
                { id: "9.5.3", title: "Desplazamiento en el dominio de s", content: [placeholderContent("Desplazamiento en el dominio de s", "9.5.3")] },
                { id: "9.5.4", title: "Escalamiento en tiempo", content: [placeholderContent("Escalamiento en tiempo", "9.5.4")] },
                { id: "9.5.5", title: "Conjugación", content: [placeholderContent("Conjugación", "9.5.5")] },
                { id: "9.5.6", title: "Propiedad de convolución", content: [placeholderContent("Propiedad de convolución", "9.5.6")] },
                { id: "9.5.7", title: "Diferenciación en el dominio de s", content: [placeholderContent("Diferenciación en el dominio de s", "9.5.7")] },
                { id: "9.5.8", title: "Diferenciación en el dominio del tiempo", content: [placeholderContent("Diferenciación en el dominio del tiempo", "9.5.8")] },
                { id: "9.5.9", title: "Integración en el dominio del tiempo", content: [placeholderContent("Integración en el dominio del tiempo", "9.5.9")] },
                { id: "9.5.10", title: "Los teoremas de valor inicial y de valor final", content: [placeholderContent("Los teoremas de valor inicial y de valor final", "9.5.10")] },
                { id: "9.5.11", title: "Tabla de propiedades", content: [placeholderContent("Tabla de propiedades", "9.5.11")] },
            ]
        },
        { id: "9.6", title: "Almacén para transformadas de Laplace", content: [placeholderContent("Almacén para transformadas de Laplace", "9.6")] },
        { 
            id: "9.7", title: "Análisis y caracterización de los sistemas LTI usando la transformada de Laplace", content: [placeholderContent("Análisis y caracterización de los sistemas LTI usando la transformada de Laplace", "9.7")],
            subsections: [
                { id: "9.7.1", title: "Causalidad", content: [placeholderContent("Causalidad", "9.7.1")] },
                { id: "9.7.2", title: "Estabilidad", content: [placeholderContent("Estabilidad", "9.7.2")] },
                { id: "9.7.3", title: "Sistemas LTI caracterizados por ecuaciones diferenciales lineales con coeficientes constantes", content: [placeholderContent("Sistemas LTI caracterizados por ecuaciones diferenciales lineales con coeficientes constantes", "9.7.3")] },
                { id: "9.7.4", title: "Ejemplos que relacionan el comportamiento del sistema con la función del sistema", content: [placeholderContent("Ejemplos que relacionan el comportamiento del sistema con la función del sistema", "9.7.4")] },
                { id: "9.7.5", title: "Filtros Butterworth", content: [placeholderContent("Filtros Butterworth", "9.7.5")] },
            ]
        },
        { 
            id: "9.8", title: "Álgebra de la función del sistema y representación en diagrama de bloques", content: [placeholderContent("Álgebra de la función del sistema y representación en diagrama de bloques", "9.8")],
            subsections: [
                { id: "9.8.1", title: "Funciones del sistema para interconexiones de sistemas LTI", content: [placeholderContent("Funciones del sistema para interconexiones de sistemas LTI", "9.8.1")] },
                { id: "9.8.2", title: "Representaciones en diagrama de bloques para los sistemas LTI causales", content: [placeholderContent("Representaciones en diagrama de bloques para los sistemas LTI causales", "9.8.2")] },
            ]
        },
        { 
            id: "9.9", title: "La transformada unilateral de Laplace", content: [placeholderContent("La transformada unilateral de Laplace", "9.9")],
            subsections: [
                { id: "9.9.1", title: "Ejemplos de transformadas unilaterales de Laplace", content: [placeholderContent("Ejemplos de transformadas unilaterales de Laplace", "9.9.1")] },
                { id: "9.9.2", title: "Propiedades de la transformada unilateral de Laplace", content: [placeholderContent("Propiedades de la transformada unilateral de Laplace", "9.9.2")] },
                { id: "9.9.3", title: "Solución de ecuaciones diferenciales usando la transformada unilateral de Laplace", content: [placeholderContent("Solución de ecuaciones diferenciales usando la transformada unilateral de Laplace", "9.9.3")] },
            ]
        },
        { id: "9.10", title: "Resumen", content: [placeholderContent("Resumen", "9.10")] },
        { id: "9.11", title: "Problemas", content: [placeholderContent("Problemas", "9.11")] },
  ]},
  { chapter: "10", title: "LA TRANSFORMADA Z", sections: [
        { id: "10.0", title: "Introducción", content: [placeholderContent("Introducción", "10.0")] },
        { id: "10.1", title: "La transformada z", content: [placeholderContent("La transformada z", "10.1")] },
        { id: "10.2", title: "La región de convergencia de la transformada z", content: [placeholderContent("La región de convergencia de la transformada z", "10.2")] },
        { id: "10.3", title: "La transformada z inversa", content: [placeholderContent("La transformada z inversa", "10.3")] },
        { 
            id: "10.4", title: "Evaluación geométrica de la transformada de Fourier a partir del diagrama de polos y ceros", content: [placeholderContent("Evaluación geométrica de la transformada de Fourier a partir del diagrama de polos y ceros", "10.4")],
            subsections: [
                { id: "10.4.1", title: "Sistemas de primer orden", content: [placeholderContent("Sistemas de primer orden", "10.4.1")] },
                { id: "10.4.2", title: "Sistemas de segundo orden", content: [placeholderContent("Sistemas de segundo orden", "10.4.2")] },
            ]
        },
        { 
            id: "10.5", title: "Propiedades de la transformada z", content: [placeholderContent("Propiedades de la transformada z", "10.5")],
            subsections: [
                { id: "10.5.1", title: "Linealidad", content: [placeholderContent("Linealidad", "10.5.1")] },
                { id: "10.5.2", title: "Desplazamiento en el tiempo", content: [placeholderContent("Desplazamiento en el tiempo", "10.5.2")] },
                { id: "10.5.3", title: "Escalamiento en el dominio de z", content: [placeholderContent("Escalamiento en el dominio de z", "10.5.3")] },
                { id: "10.5.4", title: "Inversión de tiempo", content: [placeholderContent("Inversión de tiempo", "10.5.4")] },
                { id: "10.5.5", title: "Expansión en el tiempo", content: [placeholderContent("Expansión en el tiempo", "10.5.5")] },
                { id: "10.5.6", title: "Conjugación", content: [placeholderContent("Conjugación", "10.5.6")] },
                { id: "10.5.7", title: "Propiedad de convolución", content: [placeholderContent("Propiedad de convolución", "10.5.7")] },
                { id: "10.5.8", title: "Diferenciación en el dominio de z", content: [placeholderContent("Diferenciación en el dominio de z", "10.5.8")] },
                { id: "10.5.9", title: "Teorema del valor inicial", content: [placeholderContent("Teorema del valor inicial", "10.5.9")] },
                { id: "10.5.10", title: "Resumen de propiedades", content: [placeholderContent("Resumen de propiedades", "10.5.10")] },
            ]
        },
        { id: "10.6", title: "Algunos pares comunes de transformada z", content: [placeholderContent("Algunos pares comunes de transformada z", "10.6")] },
        { 
            id: "10.7", title: "Análisis y caracterización de los sistemas LTI usando las transformadas z", content: [placeholderContent("Análisis y caracterización de los sistemas LTI usando las transformadas z", "10.7")],
            subsections: [
                { id: "10.7.1", title: "Causalidad", content: [placeholderContent("Causalidad", "10.7.1")] },
                { id: "10.7.2", title: "Estabilidad", content: [placeholderContent("Estabilidad", "10.7.2")] },
                { id: "10.7.3", title: "Sistemas LTI caracterizados por ecuaciones de diferencias lineales con coeficientes constantes", content: [placeholderContent("Sistemas LTI caracterizados por ecuaciones de diferencias lineales con coeficientes constantes", "10.7.3")] },
                { id: "10.7.4", title: "Ejemplos que relacionan el comportamiento del sistema con la función del sistema", content: [placeholderContent("Ejemplos que relacionan el comportamiento del sistema con la función del sistema", "10.7.4")] },
            ]
        },
        { 
            id: "10.8", title: "Álgebra de la función del sistema y representación en diagramas de bloques", content: [placeholderContent("Álgebra de la función del sistema y representación en diagramas de bloques", "10.8")],
            subsections: [
                { id: "10.8.1", title: "Funciones de sistema de interconexiones de sistemas LTI", content: [placeholderContent("Funciones de sistema de interconexiones de sistemas LTI", "10.8.1")] },
                { id: "10.8.2", title: "Representaciones en diagramas de bloques para los sistemas LTI causales", content: [placeholderContent("Representaciones en diagramas de bloques para los sistemas LTI causales", "10.8.2")] },
            ]
        },
        { 
            id: "10.9", title: "La transformada z unilateral", content: [placeholderContent("La transformada z unilateral", "10.9")],
            subsections: [
                { id: "10.9.1", title: "Ejemplos de transformadas z unilaterales", content: [placeholderContent("Ejemplos de transformadas z unilaterales", "10.9.1")] },
                { id: "10.9.2", title: "Propiedades de la transformada z unilateral", content: [placeholderContent("Propiedades de la transformada z unilateral", "10.9.2")] },
                { id: "10.9.3", title: "Solución de ecuaciones de diferencias usando la transformada z unilateral", content: [placeholderContent("Solución de ecuaciones de diferencias usando la transformada z unilateral", "10.9.3")] },
            ]
        },
        { id: "10.10", title: "Resumen", content: [placeholderContent("Resumen", "10.10")] },
        { id: "10.11", title: "Problemas", content: [placeholderContent("Problemas", "10.11")] },
  ]},
  { chapter: "11", title: "SISTEMAS LINEALES RETROALIMENTADOS", sections: [
        { id: "11.0", title: "Introducción", content: [placeholderContent("Introducción", "11.0")] },
        { id: "11.1", title: "Sistemas lineales retroalimentados", content: [placeholderContent("Sistemas lineales retroalimentados", "11.1")] },
        { 
            id: "11.2", title: "Algunas aplicaciones y consecuencias de la retroalimentación", content: [placeholderContent("Algunas aplicaciones y consecuencias de la retroalimentación", "11.2")],
            subsections: [
                { id: "11.2.1", title: "Diseño de un sistema inverso", content: [placeholderContent("Diseño de un sistema inverso", "11.2.1")] },
                { id: "11.2.2", title: "Compensación de elementos no ideales", content: [placeholderContent("Compensación de elementos no ideales", "11.2.2")] },
                { id: "11.2.3", title: "Estabilización de sistemas inestables", content: [placeholderContent("Estabilización de sistemas inestables", "11.2.3")] },
                { id: "11.2.4", title: "Sistemas retroalimentados para datos muestreados", content: [placeholderContent("Sistemas retroalimentados para datos muestreados", "11.2.4")] },
                { id: "11.2.5", title: "Sistemas de rastreo", content: [placeholderContent("Sistemas de rastreo", "11.2.5")] },
                { id: "11.2.6", title: "Desestabilización causada por la retroalimentación", content: [placeholderContent("Desestabilización causada por la retroalimentación", "11.2.6")] },
            ]
        },
        { 
            id: "11.3", title: "Análisis del lugar geométrico de las raíces de los sistemas lineales retroalimentados", content: [placeholderContent("Análisis del lugar geométrico de las raíces de los sistemas lineales retroalimentados", "11.3")],
            subsections: [
                { id: "11.3.1", title: "Un ejemplo introductorio", content: [placeholderContent("Un ejemplo introductorio", "11.3.1")] },
                { id: "11.3.2", title: "Ecuación para los polos de lazo cerrado", content: [placeholderContent("Ecuación para los polos de lazo cerrado", "11.3.2")] },
                { id: "11.3.3", title: "Los puntos extremos del lugar geométrico de las raíces", content: [placeholderContent("Los puntos extremos del lugar geométrico de las raíces", "11.3.3")] },
                { id: "11.3.4", title: "El criterio del ángulo", content: [placeholderContent("El criterio del ángulo", "11.3.4")] },
                { id: "11.3.5", title: "Propiedades del lugar geométrico de las raíces", content: [placeholderContent("Propiedades del lugar geométrico de las raíces", "11.3.5")] },
            ]
        },
        { 
            id: "11.4", title: "Propiedades de la estabilidad de Nyquist", content: [placeholderContent("Propiedades de la estabilidad de Nyquist", "11.4")],
            subsections: [
                { id: "11.4.1", title: "La propiedad de circulación", content: [placeholderContent("La propiedad de circulación", "11.4.1")] },
                { id: "11.4.2", title: "El criterio de Nyquist para sistemas LTI retroalimentados continuos", content: [placeholderContent("El criterio de Nyquist para sistemas LTI retroalimentados continuos", "11.4.2")] },
                { id: "11.4.3", title: "El criterio de Nyquist para sistemas LTI retroalimentados discretos", content: [placeholderContent("El criterio de Nyquist para sistemas LTI retroalimentados discretos", "11.4.3")] },
            ]
        },
        { id: "11.5", title: "Márgenes de ganancia y fase", content: [placeholderContent("Márgenes de ganancia y fase", "11.5")] },
        { id: "11.6", title: "Resumen", content: [placeholderContent("Resumen", "11.6")] },
        { id: "11.7", title: "Problemas", content: [placeholderContent("Problemas", "11.7")] },
  ]},
];
