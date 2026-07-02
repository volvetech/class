'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    monthlyPrice: 9.99,
    yearlyPrice: 5.00,
    oneTimePrice: 49.99,
    credits: 200,
    description: 'Perfect for casual users',
    features: [
      '200 credits of try-on image generation',
      'Private try-on images allowed',
      'High quality try-on output',
      'Advanced virtual try on model',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    monthlyPrice: 19.99,
    yearlyPrice: 10.00,
    oneTimePrice: 99.99,
    credits: 400,
    description: 'Great for fashion enthusiasts',
    features: [
      '400 credits of try-on image generation',
      'Private try-on images allowed',
      'High quality try-on output',
      'Advanced virtual try on model',
      'Priority virtual try on generation',
    ],
    popular: true,
  },
  {
    name: 'Pro',
    monthlyPrice: 39.99,
    yearlyPrice: 20.00,
    oneTimePrice: 199.99,
    credits: 900,
    description: 'Best for professionals',
    features: [
      '900 credits of try-on image generation',
      'Private try-on images allowed',
      'High quality try-on output',
      'Advanced virtual try on model',
      'Priority virtual try on generation',
      '+100 Bonus Credits',
    ],
    popular: false,
  },
]

type BillingPeriod = 'monthly' | 'yearly' | 'oneTime'

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  const getPrice = (plan: typeof plans[0]) => {
    switch (billingPeriod) {
      case 'monthly':
        return plan.monthlyPrice
      case 'yearly':
        return plan.yearlyPrice
      case 'oneTime':
        return plan.oneTimePrice
    }
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">Pricing</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose a plan to instantly access virtual try on. Generate realistic outfit and accessory try-on images.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-12">
          {(['monthly', 'yearly', 'oneTime'] as BillingPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === period
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {period === 'monthly' && 'Monthly'}
              {period === 'yearly' && 'Yearly (Save 50%)'}
              {period === 'oneTime' && 'One-Time'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-yellow-500/20 to-amber-500/10 border-2 border-yellow-500/50'
                  : 'card-gold'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-sm font-bold rounded-full flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">${getPrice(plan)}</span>
                  {billingPeriod !== 'oneTime' && (
                    <span className="text-gray-400">/mo</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-2">{plan.credits} credits</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-600 text-black hover:opacity-90'
                    : 'border border-white/20 text-white hover:bg-white/10'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}