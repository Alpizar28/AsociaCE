import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Acerca del Portal',
    description: 'Información sobre el Portal IC de la Escuela de Ingeniería en Computadores del TEC.',
}

export default function AcercaPage() {
    return (
        <div className="section-gap">
            <div className="container-page" style={{ maxWidth: '720px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Acerca del Portal IC</h1>

                <div className="prose">
                    <h2>¿Qué es el Portal IC?</h2>
                    <p>
                        El Portal IC es el sistema de información centralizado para estudiantes de la
                        Escuela de Ingeniería en Computadores del Instituto Tecnológico de Costa Rica (TEC).
                        Su propósito es concentrar en un solo lugar toda la información institucional relevante
                        para facilitar la vida estudiantil.
                    </p>

                    <h2>Contenido disponible</h2>
                    <ul>
                        <li><strong>Base de conocimiento:</strong> respuestas a preguntas frecuentes sobre matrícula, trámites, becas, graduación y más.</li>
                        <li><strong>Noticias:</strong> comunicados oficiales de la Escuela.</li>
                        <li><strong>Calendario académico:</strong> fechas clave del semestre, incluyendo matrícula, evaluaciones y trámites.</li>
                        <li><strong>Directorio:</strong> personas, departamentos y entidades de contacto relevantes.</li>
                    </ul>

                    <h2>Administración</h2>
                    <p>
                        El portal es mantenido por la Secretaría de la Escuela de IC y la Asociación de
                        Estudiantes (ASEIC). Si encuentras información desactualizada, puedes usar el
                        botón "Reportar información desactualizada" disponible en cada artículo.
                    </p>

                    <h2>Contacto</h2>
                    <p>
                        Para consultas sobre el contenido del portal, comunícate con la Secretaría de la
                        Escuela de Ingeniería en Computadores.
                    </p>
                </div>
            </div>
        </div>
    )
}
