import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body
    let contactData;
    try {
      const body = await req.text();
      contactData = JSON.parse(body);
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid request body: ' + parseError.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate marks criteria
    const scienceMarks = contactData.science_marks_c || 0;
    const mathsMarks = contactData.maths_marks_c || 0;

    if (scienceMarks <= 60 || mathsMarks <= 60) {
      return new Response(JSON.stringify({
        success: false,
        message: `Contact sync criteria not met. Science marks: ${scienceMarks}, Maths marks: ${mathsMarks}. Both must be greater than 60.`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required contact fields
    if (!contactData.name_c || !contactData.email_c) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields: name_c and email_c are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get CompanyHub API key
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

    // Create contact in CompanyHub using apperClient (globally available)
    const companyHubPayload = {
      records: [{
        name_c: contactData.name_c,
        email_c: contactData.email_c,
        phone_c: contactData.phone_c || "",
        company_c: contactData.company_c || "",
        tags_c: contactData.tags_c || "",
        notes_c: contactData.notes_c || "",
        science_marks_c: contactData.science_marks_c,
        maths_marks_c: contactData.maths_marks_c
      }]
    };

    const response = await apperClient.createRecord('contact_c', companyHubPayload);

    if (!response.success) {
      return new Response(JSON.stringify({
        success: false,
        message: response.message || 'Failed to create contact in CompanyHub'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for partial failures
    if (response.results && response.results.length > 0) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        const errorMessages = failed.map(f => f.message || 'Unknown error').join(', ');
        return new Response(JSON.stringify({
          success: false,
          message: 'Failed to create contact in CompanyHub: ' + errorMessages
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Success - return created contact
      const createdContact = response.results[0].data;
      return new Response(JSON.stringify({
        success: true,
        message: 'Contact synced to CompanyHub successfully',
        data: createdContact
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Contact synced to CompanyHub successfully',
      data: response.data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});