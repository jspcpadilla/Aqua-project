import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";


// =========================================================
// FIREBASE
// =========================================================

const firebaseConfig = {
    apiKey: "AIzaSyCXTOXdcw9w_HOoo12r65H4PfHSfJSCKnM",

    authDomain: "proyecto-iot-561b4.firebaseapp.com",

    databaseURL:
        "https://proyecto-iot-561b4-default-rtdb.firebaseio.com",

    projectId: "proyecto-iot-561b4",

    storageBucket:
        "proyecto-iot-561b4.firebasestorage.app",

    messagingSenderId: "1098759352154",

    appId:
        "1:1098759352154:web:0637ccdc5f46acfa370d63",

    measurementId: "G-XWGQSNHW76"
};


// =========================================================
// INICIALIZAR
// =========================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// =========================================================
// AUTENTICACIÓN
// =========================================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    console.log("=================================");
    console.log("AquaMonitor IoT");
    console.log("Usuario:", user.email);
    console.log("UID:", user.uid);
    console.log("=================================");

    iniciarMonitoreo();

});


// =========================================================
// MONITOREO
// =========================================================

function iniciarMonitoreo() {

    const tanqueRef = ref(
        database,
        "tanques/tanque001/medicionActual"
    );


    onValue(
        tanqueRef,

        (snapshot) => {

            const datos = snapshot.val();


            if (!datos) {

                console.warn(
                    "No existen datos en Firebase."
                );

                return;

            }


            console.log(
                "DATOS RECIBIDOS:",
                datos
            );


            actualizarDashboard(datos);

        },

        (error) => {

            console.error(
                "Error leyendo Firebase:",
                error
            );

        }
    );

}


// =========================================================
// ACTUALIZAR DASHBOARD
// =========================================================

function actualizarDashboard(datos) {

    console.log(
        "Actualizando dashboard..."
    );


    // =====================================================
    // OBTENER DATOS
    // =====================================================

    const idTanque =
        datos.idTanque ?? "tanque001";


    const distancia =
        Number(datos.distanciaAgua ?? 0);


    const nivelAgua =
        Number(datos.nivelAgua ?? 0);


    const porcentaje =
        Number(datos.porcentaje ?? 0);


    const capacidad =
        Number(datos.capacidadUtil ?? 0);


    const volumen =
        Number(datos.volumen ?? 0);


    const estadoTanque =
        datos.estadoTanque ?? "Desconocido";


    const lecturaValida =
        datos.lecturaValida ?? false;


    const conexion =
        datos.conexion ?? false;


    const fechaHora =
        datos.fechaHora ?? null;


    // =====================================================
    // PORCENTAJE
    // =====================================================

    const porcentajeTexto =
        porcentaje.toFixed(2) + "%";


    // Tarjeta superior
    setText(
        "percentageValue",
        porcentajeTexto
    );


    // Porcentaje dentro del tanque
    setText(
        "tankPercentageValue",
        porcentajeTexto
    );


    // Barra superior
    const barra =
        document.getElementById(
            "tankPercentage"
        );


    if (barra) {

        const porcentajeSeguro =
            Math.min(
                Math.max(
                    porcentaje,
                    0
                ),
                100
            );


        barra.style.width =
            porcentajeSeguro + "%";


        barra.setAttribute(
            "aria-valuenow",
            porcentajeSeguro
        );

    }


    // =====================================================
    // NIVEL VISUAL DEL TANQUE
    // =====================================================

    const nivelVisual =
        document.getElementById(
            "waterLevel"
        );


    if (nivelVisual) {

        const porcentajeSeguro =
            Math.min(
                Math.max(
                    porcentaje,
                    0
                ),
                100
            );


        nivelVisual.style.height =
            porcentajeSeguro + "%";

    }


    // =====================================================
    // VOLUMEN
    // =====================================================

    setText(
        "volumeValue",
        volumen.toFixed(2) + " L"
    );


    // =====================================================
    // CAPACIDAD
    // =====================================================

    setText(
        "capacityValue",
        capacidad.toFixed(2) + " L"
    );


    setText(
        "capacityTelemetry",
        capacidad.toFixed(2) + " L"
    );


    setText(
        "capacityDetail",
        capacidad.toFixed(2) + " L"
    );


    // =====================================================
    // DISTANCIA
    // =====================================================

    setText(
        "distanceValue",
        distancia.toFixed(2) + " cm"
    );


    setText(
        "distanceTelemetry",
        distancia.toFixed(2) + " cm"
    );


    // =====================================================
    // NIVEL DE AGUA
    // =====================================================

    setText(
        "waterLevelTelemetry",
        nivelAgua.toFixed(2) + " cm"
    );


    setText(
        "levelTelemetry",
        nivelAgua.toFixed(2) + " cm"
    );


    // =====================================================
    // ESTADO DEL NIVEL
    // =====================================================

    const estadoNivel =
        determinarEstadoNivel(
            porcentaje
        );


    // Tarjeta superior
    setText(
        "levelStatus",
        estadoNivel
    );


    // Estado al lado del tanque
    setText(
        "tankLevelStatus",
        estadoNivel
    );


    // =====================================================
    // ESTADO DEL TANQUE
    // =====================================================

    setText(
        "tankState",
        capitalizar(
            estadoTanque
        )
    );


    // =====================================================
    // LECTURA VÁLIDA
    // =====================================================

    const lecturaTexto =
        lecturaValida
            ? "Lectura válida"
            : "Lectura no válida";


    setText(
        "readingStatus",
        lecturaTexto
    );


    setText(
        "validReading",
        lecturaValida
            ? "Sí"
            : "No"
    );


    setText(
        "validReadingDetail",
        lecturaValida
            ? "Sí"
            : "No"
    );


    // =====================================================
    // CONEXIÓN
    // =====================================================

    setText(
        "connectionValue",
        conexion
            ? "Online"
            : "Offline"
    );


    setText(
        "connectionStatusSecondary",
        conexion
            ? "Conectado"
            : "Desconectado"
    );


    // =====================================================
    // ID DEL TANQUE
    // =====================================================

    setText(
        "tankId",
        idTanque
    );


    setText(
        "tankIdDetail",
        idTanque
    );


    // =====================================================
    // FECHA Y HORA
    // =====================================================

    const fechaTexto =
        formatearFecha(
            fechaHora
        );


    setText(
        "lastUpdate",
        fechaTexto
    );


    setText(
        "timestampTelemetry",
        fechaTexto
    );


    setText(
        "timestampDetail",
        fechaTexto
    );


    // =====================================================
    // PROCESAMIENTO
    // =====================================================

    setText(
        "processingStatus",
        lecturaValida
            ? "Activa"
            : "Revisar"
    );


    // =====================================================
    // CONSOLA
    // =====================================================

    console.log(
        "---------------------------------"
    );

    console.log(
        "Tanque:",
        idTanque
    );

    console.log(
        "Distancia:",
        distancia
    );

    console.log(
        "Nivel:",
        nivelAgua
    );

    console.log(
        "Porcentaje:",
        porcentaje
    );

    console.log(
        "Volumen:",
        volumen
    );

    console.log(
        "Capacidad:",
        capacidad
    );

    console.log(
        "Estado:",
        estadoTanque
    );

    console.log(
        "Lectura válida:",
        lecturaValida
    );

    console.log(
        "Conexión:",
        conexion
    );

    console.log(
        "Fecha:",
        fechaTexto
    );

    console.log(
        "---------------------------------"
    );

}


// =========================================================
// ESTADO DEL NIVEL
// =========================================================

function determinarEstadoNivel(
    porcentaje
) {

    if (porcentaje <= 20) {

        return "Nivel crítico";

    }


    if (porcentaje <= 40) {

        return "Nivel bajo";

    }


    if (porcentaje <= 70) {

        return "Nivel normal";

    }


    if (porcentaje <= 90) {

        return "Nivel alto";

    }


    return "Nivel óptimo";

}


// =========================================================
// FORMATEAR FECHA
// =========================================================

function formatearFecha(
    timestamp
) {

    if (
        timestamp === null ||
        timestamp === undefined ||
        timestamp === ""
    ) {

        return "--";

    }


    let fecha;


    /*
     * Firebase está enviando:
     *
     * 1795413036
     *
     * Ese valor corresponde a Unix Timestamp
     * en segundos.
     */

    if (
        typeof timestamp === "number"
    ) {

        fecha =
            new Date(
                timestamp * 1000
            );

    } else {

        fecha =
            new Date(timestamp);

    }


    if (
        isNaN(
            fecha.getTime()
        )
    ) {

        return "--";

    }


    return fecha.toLocaleString(
        "es-CO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",

            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}


// =========================================================
// CAPITALIZAR
// =========================================================

function capitalizar(
    texto
) {

    if (!texto) {

        return "";

    }


    return (
        texto
            .charAt(0)
            .toUpperCase()
        +
        texto.slice(1)
    );

}


// =========================================================
// COLOCAR TEXTO
// =========================================================

function setText(
    id,
    value
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            value;

    } else {

        console.warn(
            `Elemento no encontrado: #${id}`
        );

    }

}


// =========================================================
// CERRAR SESIÓN
// =========================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );

            }

        }
    );

}