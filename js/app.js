// ==========================================
// AQUAMONITOR IoT
// Firebase Authentication + Realtime Database
// ==========================================


// ==========================================
// 1. IMPORTAR FIREBASE
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js";


// ==========================================
// 2. CONFIGURACIÓN DE FIREBASE
// ==========================================

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


// ==========================================
// 3. INICIALIZAR FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// 4. INICIALIZAR AUTHENTICATION
// ==========================================

const auth = getAuth(app);


// ==========================================
// 5. INICIALIZAR REALTIME DATABASE
// ==========================================

const database = getDatabase(app);


// ==========================================
// 6. ELEMENTOS DEL FORMULARIO
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


// ==========================================
// 7. INICIAR SESIÓN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent =
        "Iniciando sesión...";

    try {

        // ------------------------------------------
        // AUTENTICAR USUARIO
        // ------------------------------------------

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        console.log(
            "Inicio de sesión exitoso"
        );

        console.log(
            "Usuario:",
            user.email
        );

        console.log(
            "UID:",
            user.uid
        );


        loginMessage.textContent =
            "Inicio de sesión exitoso.";

        window.location.href = "dashboard.html";


        // ------------------------------------------
        // CONECTAR CON REALTIME DATABASE
        // ------------------------------------------

        escucharDatosTanque();

    } catch (error) {

        console.error(
            "Error de autenticación:",
            error
        );

        loginMessage.textContent =
            "No se pudo iniciar sesión. Verifica tu correo y contraseña.";
    }

});


// ==========================================
// 8. ESCUCHAR DATOS DEL TANQUE
// ==========================================

function escucharDatosTanque() {

    console.log(
        "Conectando con Realtime Database..."
    );


    // Ruta exacta donde están los datos
    const tanqueRef = ref(
        database,
        "tanques/tanque001/medicionActual"
    );


    // Escuchar cambios en tiempo real
    onValue(tanqueRef, (snapshot) => {

        const datos = snapshot.val();


        // ------------------------------------------
        // COMPROBAR SI EXISTEN DATOS
        // ------------------------------------------

        if (datos === null) {

            console.warn(
                "No se encontraron datos del tanque."
            );

            return;
        }


        // ------------------------------------------
        // MOSTRAR DATOS EN CONSOLA
        // ------------------------------------------

        console.log(
            "================================="
        );

        console.log(
            "DATOS DEL TANQUE"
        );

        console.log(
            "================================="
        );

        console.log(
            "ID Tanque:",
            datos.idTanque
        );

        console.log(
            "Nombre:",
            datos.nombreTanque
        );

        console.log(
            "Distancia del agua:",
            datos.distanciaAgua
        );

        console.log(
            "Nivel de agua:",
            datos.nivelAgua
        );

        console.log(
            "Porcentaje:",
            datos.porcentaje
        );

        console.log(
            "Capacidad útil:",
            datos.capacidadUtil
        );

        console.log(
            "Volumen:",
            datos.volumen
        );

        console.log(
            "Estado:",
            datos.estadoTanque
        );

        console.log(
            "Fecha/hora:",
            datos.fechaHora
        );

        console.log(
            "Lectura válida:",
            datos.lecturaValida
        );

        console.log(
            "Conexión:",
            datos.conexion
        );


        // ------------------------------------------
        // MOSTRAR EL OBJETO COMPLETO
        // ------------------------------------------

        console.log(
            "Objeto completo:",
            datos
        );

    });

}