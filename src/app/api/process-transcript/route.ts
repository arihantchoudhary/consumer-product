import { NextRequest, NextResponse } from 'next/server';

async function callAnthropic(transcript: string, prompt: string) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    throw new Error('API key not configured');
  }

  console.log('Calling Anthropic API with custom prompt');
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300, // Keep responses concise
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\nTranscript:\n${transcript}`
          }
        ]
      })
    });

    const responseText = await response.text();
    console.log('Anthropic API response status:', response.status);
    
    if (!response.ok) {
      console.error('Anthropic API error response:', responseText);
      throw new Error(`Anthropic API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log('Process transcript API called');
  
  try {
    const body = await request.json();
    const { transcript, customBlocks } = body;
    
    console.log('Received transcript length:', transcript?.length || 0);
    console.log('Custom blocks:', customBlocks);

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error - API key missing' },
        { status: 500 }
      );
    }

    // Process custom blocks with their prompts
    const processPromises = customBlocks.map((block: { key: string; prompt: string }) => {
      return callAnthropic(transcript, block.prompt)
        .then(result => ({ key: block.key, result }))
        .catch(error => {
          console.error(`Error processing block ${block.key}:`, error);
          return { key: block.key, result: 'Error processing this block' };
        });
    });

    const results = await Promise.all(processPromises);
    
    console.log('Successfully processed all blocks');

    // Build response
    interface ProcessedData {
      [key: string]: string;
      timestamp: string;
      originalTranscript: string;
    }
    
    const processedData: ProcessedData = {
      timestamp: new Date().toISOString(),
      originalTranscript: transcript
    };

    results.forEach(({ key, result }: { key: string; result: string }) => {
      processedData[key] = result;
    });

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error in process-transcript route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process transcript',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}