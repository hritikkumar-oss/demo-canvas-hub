// Test script for admin invite Edge Function
// Run with: node reports/test-invite.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wpkcwzclgnnvrmljeyyz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa2N3emNsZ25udnJtbGpleXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDg2MTIsImV4cCI6MjA3MjM4NDYxMn0.Mzx0RkeH08SqSjKdBotN0zOjZvw5fN3B3zba6lV5bwU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminInvite() {
  const timestamp = Date.now();
  const testEmail = `invite-test-${timestamp}@example.com`;
  
  console.log(`🧪 Testing admin invite for: ${testEmail}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('admin-invite', {
      body: {
        email: testEmail,
        data: {
          test: true,
          timestamp: new Date().toISOString(),
          source: 'debug-test'
        }
      },
      headers: {
        'x-admin-key': 'test-admin-key' // This would need to be set in secrets
      }
    });

    console.log('\n📊 Function Response:');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', JSON.stringify(error, null, 2));
    
    if (data?.ok) {
      console.log('\n✅ Invite sent successfully!');
      console.log(`📧 Check email: ${testEmail}`);
      console.log(`👤 User ID: ${data.invite?.user?.id}`);
    } else {
      console.log('\n❌ Invite failed');
      console.log(`Error: ${data?.error || error?.message}`);
    }
    
  } catch (err) {
    console.error('\n💥 Test failed:', err);
  }
}

// Run test
testAdminInvite().then(() => {
  console.log('\n🏁 Test completed');
}).catch(console.error);