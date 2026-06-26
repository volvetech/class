import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { clothingImage } = await request.json()

    if (!clothingImage) {
      return NextResponse.json(
        { error: '缺少服装图片' },
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

    const response = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [
          {
            role: 'system',
            content: '你是一个服装分类专家。请分析用户提供的服装图片，并判断它属于哪一类。只返回以下三个选项之一：top（上装，如T恤、衬衫、外套）、bottom（下装，如裤子、裙子）、dress（连衣裙）。不要返回任何解释或其他文字，只返回类别名称。'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: clothingImage
                }
              }
            ]
          }
        ],
        max_tokens: 10,
        temperature: 0
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || '分类失败' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const category = data.choices?.[0]?.message?.content?.trim().toLowerCase() || 'top'
    
    const validCategories = ['top', 'bottom', 'dress']
    const finalCategory = validCategories.includes(category) ? category : 'top'

    return NextResponse.json({ category: finalCategory })

  } catch (error) {
    console.error('Classify API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}