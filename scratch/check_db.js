import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
  const tables = ['Room', 'Reservation', 'KitchenOrder', 'StockItem', 'Service', 'DiningReservation', 'Amenity'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`[MISSING or ERROR] Table ${table}: ${error.message}`);
    } else {
      console.log(`[OK] Table ${table}`);
    }
  }
}

checkTables();
