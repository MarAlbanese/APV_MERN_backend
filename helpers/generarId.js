// Se recomienda un helper por archivo porque hay si hay archivo con  100 helpers y se llama a una sola funcion escanea todo el archivo

const generarId = () => {   // Esta funcion genera un Id que se mandara a llamar en la parte del token del modelo
 return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export default generarId;                     