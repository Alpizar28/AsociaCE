import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Acerca del Portal',
    description: 'Información sobre el Portal CE de la Escuela de Ingeniería en Computadores del TEC.',
}

export default function AcercaPage() {
    return (
        <div className="section-gap">
            <div className="container-page" style={{ maxWidth: '720px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Acerca del Portal CE</h1>

                <div className="prose">
                    <h2>¿Qué es el Portal CE?</h2>
                    <p>
                        El Portal CE es el sistema de información centralizado para estudiantes de la
                        Escuela de Ingeniería en Computadores (CE) del Instituto Tecnológico de Costa Rica (TEC).
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
                        El portal es mantenido por la Secretaría de la Escuela de Computadores y la Asociación de
                        Estudiantes (ASEIC). Si encuentras información desactualizada, puedes usar el
                        botón "Reportar información desactualizada" disponible en cada artículo.
                    </p>

                    <h2 style={{ color: 'var(--color-primary)' }}>Créditos y Desarrollo</h2>
                    <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            Este portal fue desarrollado con el objetivo de beneficiar a la comunidad de Computadores por:
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            Jose Pablo Alpizar Mata y Kembly Dariana Garro Sanchez
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            Estudiantes de Ingeniería en Computadores del TEC.
                        </p>
                        <p style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                            Desarrollado por <strong>Jokem Technologies</strong>.
                        </p>
                        <a href="https://jokem.tech" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            Visitar jokem.tech →
                        </a>
                    </div>

                    <h2 style={{ marginTop: '2rem' }}>Contacto</h2>
                    <p>
                        Para consultas sobre el contenido del portal, comunícate con la Secretaría de la
                        Escuela de Ingeniería en Computadores.
                    </p>
                </div>
            </div>
        </div>
    )
}
