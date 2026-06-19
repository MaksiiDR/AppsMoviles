import { validarRUT } from '../utils/validadorRut';

describe('Validación de RUT chileno (Módulo 11)', () => {
    
    describe('Casos válidos', () => {
        it('Debería validar RUT con formato estándar (con puntos y guión)', () => {
            expect(validarRUT('12.345.678-5')).toBe(true);
        });

        it('Debería validar RUT sin puntos ni guión', () => {
            expect(validarRUT('123456785')).toBe(true);
        });

        it('Debería validar RUT con dígito verificador K (mayúscula)', () => {
            // Ejemplo de RUT válido con K: 1-9 (falso) 
            // Busquemos uno real: si sum=50, 50%11=6, 11-6=5. 
            // Si mod es 10, DV es K. Entonces 11 - (sum%11) = 10 => sum%11 = 1.
            // Ejemplo: body = '10', 0*2 + 1*3 = 3. 3%11=3.
            // body = '20', 0*2 + 2*3 = 6. 
            // body = '50', 0*2 + 5*3 = 15%11 = 4.
            // body = '30', 0*2 + 3*3 = 9%11 = 9. 11-9 = 2.
            // Un RUT famoso con K es 1234567-K (A ver: 7*2 + 6*3 + 5*4 + 4*5 + 3*6 + 2*7 + 1*2) = 14+18+20+20+18+14+2 = 106. 106%11 = 7. 11-7=4 (no es K).
            // Usemos RUTs de prueba conocidos: '1-9' => 1*2=2. 11-2=9.
            // '2-7' => 2*2=4. 11-4=7.
            // '3-5' => 3*2=6. 11-6=5.
            // '4-3' => 4*2=8. 11-8=3.
            // '5-1' => 5*2=10. 11-10=1.
            // '6-K' => 6*2=12. 12%11=1. 11-1=10 (K).
            expect(validarRUT('6-K')).toBe(true);
            expect(validarRUT('6K')).toBe(true);
        });

        it('Debería validar RUT con dígito verificador k (minúscula)', () => {
            expect(validarRUT('6-k')).toBe(true);
        });

        it('Debería validar RUT con dígito verificador 0', () => {
            // mod=11 => sum%11 = 0
            // body = '11', 1*2 + 1*3 = 5.
            // body = '22', 2*2 + 2*3 = 10.
            // body = '33', 3*2 + 3*3 = 15.
            // body = '14', 4*2 + 1*3 = 11. 11%11=0. mod=11. expectedDv='0'.
            expect(validarRUT('14-0')).toBe(true);
            expect(validarRUT('140')).toBe(true);
        });
        
        it('Debería validar RUT con espacios', () => {
            expect(validarRUT(' 12.345.678 - 5 ')).toBe(true);
        });
    });

    describe('Casos inválidos', () => {
        it('Debería fallar si el dígito verificador es incorrecto', () => {
            expect(validarRUT('12.345.678-0')).toBe(false);
            expect(validarRUT('12.345.678-K')).toBe(false);
            expect(validarRUT('6-1')).toBe(false);
        });

        it('Debería fallar si el RUT contiene caracteres no numéricos en el cuerpo', () => {
            expect(validarRUT('1A.345.678-5')).toBe(false);
            expect(validarRUT('hola-K')).toBe(false);
        });

        it('Debería fallar si está vacío', () => {
            expect(validarRUT('')).toBe(false);
        });

        it('Debería fallar si no tiene dígito verificador', () => {
            expect(validarRUT('12345678')).toBe(false); // Porque sin DV asume que el DV es 8 y falla
        });
    });
});
