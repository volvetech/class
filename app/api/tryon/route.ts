import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { personImage, clothingImage, category } = await request.json()

    if (!personImage || !clothingImage) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AGNES_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 密钥未配置' },
        { status: 500 }
      )
    }

    const categoryPrompt = {
      top: '把这件衣服穿在人物身上，替换人物的上装部分',
      bottom: '把这件衣服穿在人物身上，替换人物的下装部分',
      dress: '把这件连衣裙穿在人物身上'
    }

    const response = await fetch('https://apihub.agnes-ai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'agnes-image-2.0-flash',
        prompt: `Virtual try-on: ${categoryPrompt[category as keyof typeof categoryPrompt]}. Keep the person's pose and background. Make the clothing fit naturally on the person's body. High quality, realistic, photo-realistic.`,
        tags: ['img2img'],
        size: '1024x1024',
        extra_body: {
          image: [personImage, clothingImage],
          response_format: 'url'
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Tryon API error:', errorData)
      return NextResponse.json(
        { error: errorData.message || '试衣生成失败', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const resultImage = data.data?.[0]?.url

    if (!resultImage) {
      console.error('Tryon API response:', data)
      return NextResponse.json(
        { error: '未返回试衣结果', details: data },
        { status: 500 }
      )
    }

    return NextResponse.json({ result_image: resultImage })

  } catch (error) {
    console.error('Tryon API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误', details: error },
      { status: 500 }
    )
  }
}