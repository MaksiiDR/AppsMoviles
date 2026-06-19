require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("No credentials found in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log("Testing Supabase connection to:", url);
  
  // Test connection by fetching citas
  const { data, error } = await supabase.from('cita').select('*').limit(1);
  if (error) {
    console.error("Error fetching cita:", error);
  } else {
    console.log("Fetch OK, data:", data);
  }

  // Test insert
  const { error: insertError } = await supabase.from('cita').upsert([{
    id: '00000000-0000-0000-0000-000000000000',
    profesional: 'Test',
    tipoCita: 'Test',
    fecha: '2026-01-01',
    hora: '10:00',
    establecimiento: 'Test',
    tipoAtencion: 'Test',
    estado: 'Test'
  }]);

  if (insertError) {
    console.error("Error inserting cita:", insertError);
  } else {
    console.log("Insert OK!");
  }
}

test();
