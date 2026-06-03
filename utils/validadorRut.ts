export function validarRUT(rut: string): boolean {
    if (!rut || typeof rut !== 'string') return false;

    // Normalizar: quitar puntos, espacios y guiones, y convertir a mayúsculas
    const cleanRut = rut.replace(/[\.\-\s]/g, '').toUpperCase();

    // El RUT debe tener al menos 2 caracteres (un dígito y el verificador) y contener solo números y una K al final
    if (!/^[0-9]+[0-9K]$/.test(cleanRut)) {
        return false;
    }

    // Separar cuerpo del dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Calcular dígito verificador con módulo 11
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const mod = 11 - (sum % 11);
    let expectedDv = mod.toString();
    
    if (mod === 11) expectedDv = '0';
    if (mod === 10) expectedDv = 'K';

    // Comparar el DV calculado con el proporcionado
    return dv === expectedDv;
}
