Autenticación y Sesión:

Pantalla de Login.

Una vez iniciada la sesión, el sistema debe "recordar" al usuario (simular persistencia de datos de sesión) y mostrar su nombre en un Dashboard.

Dashboard Principal:

Debe mostrar un resumen de la próxima cita.

Un botón destacado para "Agendar Nueva Cita".

Una sección de "Alertas/Recordatorios" para próximas consultas.

Módulo de Multas: Mostrar un contador visible de "Multas Pendientes" con el valor de $3.000 COP por cada una, basado en el histórico.

Flujo de Reserva de Citas (Paso a Paso):

Paso 1: Selección de Sede (Dropdown con opciones: Sede Campus, Sede Salud, Sede Guatiguará).

Paso 2: Selección de Especialidad y Médico.

Paso 3: Selector de Fecha y Horario (Calendario visual).

Botón de confirmación con un resumen de la selección.

Gestión de Citas (Mis Citas):

Lista de citas activas con botones de "Postergar" y "Cancelar".

Lógica de Restricción: Si el usuario intenta cancelar o postergar, debe aparecer un mensaje informando que "Solo se permite realizar cambios con un mínimo de 2 horas de antelación".

Si faltan menos de 2 horas, los botones deben estar deshabilitados o mostrar un aviso de cobro de multa.

Historial:

Una pestaña o sección dedicada al "Histórico de Citas" donde se listen las citas pasadas, su estado (Asistió / No Asistió) y si generaron multa.