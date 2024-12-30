import { supabase } from '$lib/db';
import { keepBotOnline } from '$lib/chatbot';

export async function GET() {
  try {
        // Your cron job logic
        const timestamp = new Date().toISOString();
        console.log(`Cron job executed at ${timestamp}`);

        let chatbotActive = await keepBotOnline()
        if (!chatbotActive) {
          return new Response(JSON.stringify({ success: false, error: 'Failed to reach chatbot' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
        }
        let database = {
          message: `Cron Job to keep backend active ran at ${timestamp}`
        }
        // Call to the Supabase backend
        const { data, error } = await supabase
            .from('logs')
            .insert(database);

           

        if (error) {
            throw new Error('Failed to call Supabase backend: ' + error.message);
        }
         return new Response(JSON.stringify({ success: true, message: 'Cron job completed successfully.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
    } catch (error) {
        console.error('Error in cron job:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
    }
}
