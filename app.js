import path from "path";
import { promises as fs } from 'fs';
export default (async (req, res) => {
    let { url, method } = req;
    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);
    // Enrutando peticiones
    switch (url) {
        case '/':
            // Peticion raiz
            // Estableciendo cabeceras
            res.setHeader('Content-Type', 'text/html');
            // Escribiendo la respuesta
            res.write(` `);
            console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 200;
            // Cerrando la comunicacion
            res.end();
            break;
        case '/author':
            // Peticion raiz
            // Estableciendo cabeceras
            res.setHeader('Content-Type', 'text/html');
            let url_image = 'https://www.meteorologiaenred.com/wp-content/uploads/2014/02/gotas-de-lluvia.jpg';
            // Escribiendo la respuesta
            res.write(``);
            console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 200;
            // Cerrando la comunicacion
            res.end();
            break;
        case "/favicon.ico":
            // Especificar la ubicación del archivo de icono
            const faviconPath = path.join(__dirname, 'favicon.ico');
            try {
                const data = await fs.readFile(faviconPath);
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            } catch (err) {
                console.error(err);
                // Peticion raiz
                // Estableciendo cabeceras
                res.setHeader('Content-Type', 'text/html');
                // Escribiendo la respuesta
                res.write(``);
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                console.log(`📣 Error: 500 ${err.message}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end();
            }
            break;
        case "/message":
            // Verificando si es post
            if (method === "POST") {
                // Se crea una variable para almacenar los
                // Datos entrantes del cliente
                let body = "";
                // Se registra un manejador de eventos
                // Para la recepción de datos
                req.on("data", (data => {
                    body += data;
                    if (body.length > 1e6) return req.socket.destroy();
                }));
                // Se registra una manejador de eventos para el termino de recepción de datos
                req.on("end", () => {
                    // Mediante URLSearchParams se extraen los campos del formulario
                    const params = new URLSearchParams(body);
                    // Se construye un objeto a partir de los datos en la variable params
                    const parsedParams = Object.fromEntries(params);
                    //Almacena el mensaje en un archivo
                    fs.writeFile('message.txt', parsedParams.message);
                })
                //Establece codigo de respuesta para redireccionamiento
                res.statusCode = 302;
                //Estableciendo el redireccionamiento
                res.setHeader('Location', '/');
                // Se finaliza la conexion
                return res.end();
            } else {
                res.statusCode = 404;
                res.write("404: Endpoint no encontrado")
                res.end();
            }
            break;
        default:
            // Peticion raiz
            // Estableciendo cabeceras
            res.setHeader('Content-Type', 'text/html');
            // Escribiendo la respuesta
            res.write(``);
            console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 404;
            // Cerrando la comunicacion
            res.end();
            break;
    }
});
