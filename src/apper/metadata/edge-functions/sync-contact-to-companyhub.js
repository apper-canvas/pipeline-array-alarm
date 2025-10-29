import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Retrieve CompanyHub API key from secrets
    const apiKey = await apper.getSecret('COMPANYHUB_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'CompanyHub API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse contact data from request body
    const contactData = await req.json();
    
    // Validate required fields
    if (!contactData || !contactData.name_c) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Contact name is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare payload for CompanyHub API
    // Map fields from our schema to CompanyHub schema
    const companyHubPayload = {
      name: contactData.name_c || '',
      email: contactData.email_c || '',
      phone: contactData.phone_c || '',
      company: contactData.company_c || '',
      tags: contactData.tags_c || '',
      notes: contactData.notes_c || ''
    };

    // Make API call to CompanyHub
    const companyHubResponse = await fetch('https://api.companyhub.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(companyHubPayload)
    });

    const responseData = await companyHubResponse.json();

    if (!companyHubResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: responseData.message || `CompanyHub API error: ${companyHubResponse.status}`,
        details: responseData
      }), {
        status: companyHubResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Contact synced to CompanyHub successfully',
      companyHubContactId: responseData.id || responseData.contactId,
      data: responseData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Failed to sync contact to CompanyHub'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});